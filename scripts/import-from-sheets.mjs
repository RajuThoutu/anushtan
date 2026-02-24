/**
 * import-from-sheets.mjs
 *
 * Reads ALL rows from:
 *   - "Inquiries (Working)" tab → inquiries table (preferred: has counselor data)
 *   - Skips rows already present (upsert by inquiry_id)
 *
 * Run: node scripts/import-from-sheets.mjs
 *      node scripts/import-from-sheets.mjs --dry-run   (preview only, no DB writes)
 */

import { createRequire } from 'module';
import { readFileSync, existsSync } from 'fs';

const require = createRequire(import.meta.url);
const DRY_RUN = process.argv.includes('--dry-run');

// ─── Load .env ──────────────────────────────────────────────────────────────
const envPath = '/Applications/anushtan/apps/admin/.env.local';
if (existsSync(envPath)) {
    const lines = readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
        const m = line.match(/^([^#=]+)=(.*)$/);
        if (m) {
            const key = m[1].trim();
            const val = m[2].trim().replace(/^"(.*)"$/, '$1');
            process.env[key] = val;
        }
    }
}

// ─── Deps ────────────────────────────────────────────────────────────────────
const { google } = require('googleapis');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!SHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    console.error('❌ Missing Google Sheets credentials in .env.local');
    process.exit(1);
}

// ─── Google Auth ─────────────────────────────────────────────────────────────
const auth = new google.auth.GoogleAuth({
    credentials: { client_email: CLIENT_EMAIL, private_key: PRIVATE_KEY },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});
const sheets = google.sheets({ version: 'v4', auth });

// ─── Column indices for "Inquiries (Working)" (0-based) ─────────────────────
// A=0  Inquiry ID
// B=1  Timestamp
// C=2  Student Name
// D=3  Current Class
// E=4  Current School
// F=5  Board
// G=6  Parent Name
// H=7  Occupation
// I=8  Primary Contact
// J=9  Secondary Contact
// K=10 Email
// L=11 Q1 – Education Guide
// M=12 Q2 – Learning Method
// N=13 Q3 – Teacher Preference
// O=14 Q4 – Child Priority       ← NOTE: Working tab has "Follow-up" here in sample, ignore if not Q-looking
// P=15 Q5 – School Environment
// Q=16 How did you hear
// R=17 Day Scholar / Hostel
// S=18 Inquiry Date
// T=19 Priority
// U=20 Comments / Notes
// V=21 Counselor Name
// W=22 Status  (e.g. "IN PROGRESS", "NEW", "CLOSED")
// X=23 Inq Status (Active / Resolved-Completed)
// Y=24 Follow-up Date
// Z=25 Counselor Comments

const COL = {
    inquiryId: 0,
    timestamp: 1,
    studentName: 2,
    currentClass: 3,
    currentSchool: 4,
    board: 5,
    parentName: 6,
    occupation: 7,
    phone: 8,
    secondaryPhone: 9,
    email: 10,
    educationGuide: 11,
    learningMethod: 12,
    teacherPreference: 13,
    childImportance: 14,
    schoolEnvironment: 15,
    howHeard: 16,
    dayScholarHostel: 17,
    inquiryDate: 18,
    priority: 19,
    notes: 20,
    counselorName: 21,
    status: 22,
    caseStatus: 23,
    followUpDate: 24,
    counselorComments: 25,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function cell(row, idx) {
    return (row[idx] ?? '').toString().trim();
}

/** Normalise sheet status → Prisma InquiryStatus enum */
function normaliseStatus(raw) {
    const s = raw.toUpperCase().replace(/[^A-Z]/g, '');
    if (!s || s === 'NEW') return 'New';
    if (s === 'OPEN') return 'Open';
    if (s.includes('PROGRESS') || s === 'OPEN') return 'Open';
    if (s.includes('FOLLOWUP') || s.includes('FOLLOW')) return 'FollowUp';
    if (s === 'CONVERTED' || s.includes('ADMIT')) return 'Converted';
    if (s === 'CLOSED' || s.includes('CLOS')) return 'Closed';
    return 'New'; // default
}

/** Normalise case status → Prisma CaseStatus enum */
function normaliseCaseStatus(raw) {
    const s = raw.toUpperCase();
    if (s.includes('RESOLVED') || s.includes('COMPLETED')) return 'ResolvedCompleted';
    return 'Active';
}

/** Normalise source from howHeard / timestamp context */
function normaliseSource(howHeard) {
    const h = howHeard?.toLowerCase() ?? '';
    if (h.includes('walk')) return 'PhoneCall'; // Walk-in → treat as phone
    if (h.includes('website')) return 'Website';
    if (h.includes('whatsapp')) return 'WhatsApp';
    if (h.includes('referral')) return 'Referral';
    if (h.includes('paper') || h.includes('form')) return 'PaperForm';
    return 'Website'; // sheet rows came from website form
}

/** Parse date strings like "21-01-2026", "2/5/2026 0:29:17", "2026-01-21" */
function parseDate(raw) {
    if (!raw) return null;
    // Try ISO first
    const iso = new Date(raw);
    if (!isNaN(iso.getTime())) return iso;
    // Try DD-MM-YYYY
    const m1 = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (m1) {
        const d = new Date(`${m1[3]}-${m1[2].padStart(2, '0')}-${m1[1].padStart(2, '0')}`);
        if (!isNaN(d.getTime())) return d;
    }
    return null;
}

/** Strip duplicate preference text (sheet includes Telugu in parens) */
function cleanPref(raw) {
    if (!raw) return null;
    // Remove everything from " (" to end — that's the Telugu portion
    return raw.replace(/\s*\(.*$/, '').trim() || null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    console.log(`\n${DRY_RUN ? '🔍 DRY RUN — no DB writes' : '🚀 LIVE IMPORT'}`);
    console.log(`📊 Sheet: ${SHEET_ID}\n`);

    // 1. Fetch all rows from Working tab
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: "'Inquiries (Working)'!A1:Z1000",
    });

    const allRows = res.data.values ?? [];
    if (allRows.length < 2) {
        console.log('⚠️  Sheet appears empty (only header or no rows).');
        return;
    }

    const [header, ...dataRows] = allRows;
    console.log(`📥 Found ${dataRows.length} data rows in "Inquiries (Working)"\n`);

    // 2. Get existing inquiry IDs so we can skip dupes
    const existing = await prisma.inquiry.findMany({ select: { inquiryId: true } });
    const existingIds = new Set(existing.map(e => e.inquiryId));
    console.log(`ℹ️  Already in DB: ${existingIds.size} inquiries\n`);

    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        const inquiryId = cell(row, COL.inquiryId);

        if (!inquiryId || !inquiryId.startsWith('S-')) {
            console.log(`  Row ${i + 2}: ⏭  Skipping — no valid Inquiry ID ("${inquiryId}")`);
            skipped++;
            continue;
        }

        if (existingIds.has(inquiryId)) {
            console.log(`  Row ${i + 2}: ⏭  ${inquiryId} already in DB — skip`);
            skipped++;
            continue;
        }

        const studentName = cell(row, COL.studentName);
        const parentName = cell(row, COL.parentName);
        const phone = cell(row, COL.phone);

        if (!studentName || !phone) {
            console.log(`  Row ${i + 2}: ⚠️  ${inquiryId} missing student name or phone — skip`);
            skipped++;
            continue;
        }

        // Build inquiry record
        const rawStatus = cell(row, COL.status);
        const rawCaseStatus = cell(row, COL.caseStatus);
        const rawFollowUp = cell(row, COL.followUpDate);
        const rawInqDate = cell(row, COL.inquiryDate) || cell(row, COL.timestamp);
        const rawPriority = cell(row, COL.priority)?.toUpperCase();
        const counselorName = cell(row, COL.counselorName) || null;
        const counselComments = cell(row, COL.counselorComments) || null;
        const inquiryNotes = cell(row, COL.notes) || null;

        // Merge counselor comments into notes
        const mergedNotes = [inquiryNotes, counselComments ? `[Counselor] ${counselComments}` : '']
            .filter(Boolean).join('\n\n') || null;

        // Normalise priority
        const priority = ['LOW', 'MEDIUM', 'HIGH'].includes(rawPriority)
            ? rawPriority.charAt(0) + rawPriority.slice(1).toLowerCase()
            : rawPriority === 'WARM' ? 'Medium'
                : rawPriority === 'HOT' ? 'High'
                    : rawPriority === 'COLD' ? 'Low'
                        : 'Medium';

        const data = {
            inquiryId,
            tenantId: 'anushtan-siddipet',
            studentName,
            currentClass: cell(row, COL.currentClass) || null,
            currentSchool: cell(row, COL.currentSchool) || null,
            board: cell(row, COL.board) || null,
            parentName: parentName || 'Unknown',
            phone,
            secondaryPhone: cell(row, COL.secondaryPhone) || null,
            email: cell(row, COL.email) || null,
            occupation: cell(row, COL.occupation) || null,
            educationGuide: cleanPref(cell(row, COL.educationGuide)),
            learningMethod: cleanPref(cell(row, COL.learningMethod)),
            teacherPreference: cleanPref(cell(row, COL.teacherPreference)),
            childImportance: cleanPref(cell(row, COL.childImportance)),
            schoolEnvironment: cleanPref(cell(row, COL.schoolEnvironment)),
            dayScholarHostel: cell(row, COL.dayScholarHostel) || null,
            source: normaliseSource(cell(row, COL.howHeard)),
            howHeard: cell(row, COL.howHeard) || null,
            createdBy: counselorName ?? 'Sheet Import',
            status: normaliseStatus(rawStatus),
            caseStatus: normaliseCaseStatus(rawCaseStatus),
            assignedTo: counselorName,
            followUpDate: parseDate(rawFollowUp),
            priority,
            notes: mergedNotes,
            inquiryDate: parseDate(rawInqDate) ?? new Date(),
            isSyncedToSheet: true,
        };

        if (DRY_RUN) {
            console.log(`  Row ${i + 2}: ✅ [DRY] Would insert ${inquiryId} — ${studentName} (${phone})`);
            inserted++;
            continue;
        }

        try {
            await prisma.inquiry.create({ data });

            // Activity log entry for import
            await prisma.counselorActivityLog.create({
                data: {
                    inquiryId,
                    counselorName: 'Sheet Import',
                    action: 'created',
                    newValue: data.status,
                    comments: 'Backfilled from Google Sheets',
                },
            });

            console.log(`  Row ${i + 2}: ✅ Inserted ${inquiryId} — ${studentName}`);
            inserted++;
            existingIds.add(inquiryId); // prevent re-insert if ID appears twice in sheet
        } catch (err) {
            console.error(`  Row ${i + 2}: ❌ ${inquiryId} — ${err.message}`);
            errors++;
        }
    }

    console.log('\n─────────────────────────────────────');
    console.log(`✅ Inserted : ${inserted}`);
    console.log(`⏭  Skipped  : ${skipped}`);
    console.log(`❌ Errors   : ${errors}`);
    console.log('─────────────────────────────────────\n');

    await prisma.$disconnect();
}

main().catch(err => {
    console.error('Fatal:', err.message);
    process.exit(1);
});
