/**
 * sync-sor-to-neon.js
 *
 * Reads the Anushtan SOR (Source of Record) Google Sheet ("Walk ins" tab)
 * and updates matching records in the Neon PostgreSQL database.
 *
 * Column mapping (0-based, data starts at Row 3 = index 0 after slicing):
 *   A(0)  S/N
 *   B(1)  Admission Status   → inquiry.status
 *   C(2)  PRIORITY           → inquiry.priority
 *   D(3)  DATE
 *   E(4)  COUNSELLOR         → inquiry.assignedTo  (default: "Bhargavi")
 *   F(5)  ADMISSION FOR CLASS
 *   G(6)  TNT
 *   H(7)  NAME OF THE STUDENT → match key
 *   I(8)  PARENT NAME
 *   L(11) PRIMARY CONTACT    → match key (fallback)
 *   M(12) SECONDARY CONTACT
 *   N(13) CURRENT SCHOOL
 *   W(22) FOLLOW UP DATE T+2 → inquiry.followUpDate
 *   X(23) FOLLOW UP REMARKS  → counselorActivityLog comment
 *
 * Status mapping (SOR → InquiryStatus enum):
 *   CONVERTED   → Converted
 *   REJECTED    → CasualInquiry
 *   IN PROGRESS → FollowUp
 *   (blank)     → New
 *
 * Priority mapping (SOR → DB):
 *   HOT   → High
 *   WARM  → Medium
 *   CHILL → Low
 *
 * Run:
 *   node scripts/sync-sor-to-neon.js
 *   node scripts/sync-sor-to-neon.js --dry-run   (preview, no DB writes)
 */

'use strict';

const { readFileSync, existsSync } = require('fs');
const path = require('path');

// ─── Load .env.local ──────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '../apps/admin/.env.local');
if (existsSync(envPath)) {
    const lines = readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
        const m = line.match(/^([^#=]+)=(.*)$/);
        if (m) {
            const key = m[1].trim();
            const val = m[2].trim().replace(/^"(.*)"$/, '$1');
            if (!process.env[key]) process.env[key] = val;
        }
    }
}

// ─── Deps (CommonJS) ─────────────────────────────────────────────────────────
const { google } = require('googleapis');
// In pnpm monorepo, @prisma/client lives in the pnpm store — resolve it explicitly
let PrismaClient;
try {
    ({ PrismaClient } = require('@prisma/client'));
} catch (_) {
    // Fallback to pnpm cache path
    ({ PrismaClient } = require(
        '/Applications/anushtan/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client'
    ));
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

const DRY_RUN = process.argv.includes('--dry-run');

// ─── Config ───────────────────────────────────────────────────────────────────
const SOR_SHEET_ID = '1zDQT1JLG4FIU2vps5SjLuYoXoV5G-Aw9rA6dPGxuBZY';
const SHEET_TAB = 'Walk ins';
const DATA_START = 3;   // Rows 1-2 are headers; data starts at row 3
const DATA_RANGE = `'${SHEET_TAB}'!A${DATA_START}:X`;

const DEFAULT_COUNSELLOR = 'Bhargavi';

const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL
    || 'anushtan-sheets-access@anushtan-school.iam.gserviceaccount.com';
const PRIVATE_KEY = (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n');

// ─── Column indices (0-based within the fetched range A:X) ───────────────────
const C = {
    sn: 0,  // A
    admissionStatus: 1, // B
    priority: 2,  // C
    date: 3,  // D
    counsellor: 4,  // E
    admClass: 5,  // F
    tnt: 6,  // G
    studentName: 7,  // H
    parentName: 8,  // I
    // J=9, K=10 are skipped
    phone: 11, // L
    secondaryPhone: 12, // M
    currentSchool: 13, // N
    // O-V are skipped
    followUpDate: 22, // W
    followUpRemarks: 23, // X
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cell(row, idx) {
    return (row[idx] ?? '').toString().trim();
}

/**
 * Map SOR Admission Status → Prisma InquiryStatus enum value
 */
function mapStatus(raw) {
    const s = (raw || '').trim().toUpperCase();
    switch (s) {
        case 'CONVERTED': return 'Converted';
        case 'REJECTED': return 'CasualInquiry';
        case 'IN PROGRESS': return 'FollowUp';
        case 'NEW': return 'New';
        default: return null; // null = don't update status
    }
}

/**
 * Map SOR Priority → DB priority string
 *   HOT   → High
 *   WARM  → Medium
 *   CHILL → Low
 */
function mapPriority(raw) {
    const s = (raw || '').trim().toUpperCase();
    switch (s) {
        case 'HOT': return 'High';
        case 'WARM': return 'Medium';
        case 'CHILL': return 'Low';
        default: return null; // null = don't update
    }
}

/**
 * Parse dates like "12-03-2026", "2/5/2026", "2026-02-10"
 */
function parseDate(raw) {
    if (!raw || !raw.trim()) return null;
    const r = raw.trim();

    // Try DD-MM-YYYY or D/M/YYYY first
    const m = r.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/);
    if (m) {
        // m[1] = DD, m[2] = MM, m[3] = YYYY
        const d = new Date(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}T00:00:00.000+05:30`);
        if (!isNaN(d.getTime())) return d;
    }

    // Try ISO (2026-02-10)
    if (/^\d{4}-\d{2}-\d{2}/.test(r)) {
        const iso = new Date(r);
        if (!isNaN(iso.getTime())) return iso;
    }

    return null;
}

/**
 * Normalise a phone number to digits-only for comparison
 */
function normalisePhone(phone) {
    return (phone || '').replace(/\D/g, '').slice(-10); // last 10 digits
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    console.log(`\n${DRY_RUN ? '🔍  DRY RUN — no DB writes' : '🚀  LIVE SYNC'}`);
    console.log(`📊  SOR Sheet: ${SOR_SHEET_ID}`);
    console.log(`📋  Tab: "${SHEET_TAB}" — data from row ${DATA_START}\n`);

    // ── 1. Authenticate with Google Sheets ───────────────────────────────────
    if (!PRIVATE_KEY) {
        console.error('❌  GOOGLE_SHEETS_PRIVATE_KEY is missing. Check .env.local');
        process.exit(1);
    }

    const auth = new google.auth.GoogleAuth({
        credentials: { client_email: CLIENT_EMAIL, private_key: PRIVATE_KEY },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // ── 2. Fetch SOR rows ─────────────────────────────────────────────────────
    let sheetRows;
    try {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: SOR_SHEET_ID,
            range: DATA_RANGE,
        });
        sheetRows = res.data.values ?? [];
    } catch (err) {
        console.error('❌  Failed to read Google Sheet:', err.message);
        process.exit(1);
    }

    console.log(`📥  Found ${sheetRows.length} rows in SOR sheet\n`);

    if (sheetRows.length === 0) {
        console.log('⚠️   Sheet appears empty — nothing to sync.');
        await prisma.$disconnect();
        return;
    }

    // ── 3. Load all inquiries from DB (for matching) ──────────────────────────
    const dbRecords = await prisma.inquiry.findMany({
        select: {
            id: true,
            inquiryId: true,
            studentName: true,
            phone: true,
            secondaryPhone: true,
            status: true,
            priority: true,
            assignedTo: true,
            followUpDate: true,
            inquiryDate: true,
        },
    });

    console.log(`ℹ️   DB records loaded: ${dbRecords.length}\n`);

    // Build fast lookup by phone (last-10-digits)
    const byPhone = new Map();
    for (const rec of dbRecords) {
        const key = normalisePhone(rec.phone);
        if (key) {
            if (!byPhone.has(key)) byPhone.set(key, []);
            byPhone.get(key).push(rec);
        }
    }

    // ── 4. Process each SOR row ───────────────────────────────────────────────
    let updated = 0;
    let created = 0;
    let skipped = 0;
    let errors = 0;

    // Find max S-N so new records continue the sequence
    let maxSeq = 0;
    for (const rec of dbRecords) {
        const m = rec.inquiryId.match(/^S-(\d+)$/);
        if (m) maxSeq = Math.max(maxSeq, parseInt(m[1], 10));
    }
    console.log(`📌  Highest existing inquiry ID: S-${maxSeq}\n`);
    const usedIds = new Set(dbRecords.map(r => r.inquiryId));

    for (let i = 0; i < sheetRows.length; i++) {
        const row = sheetRows[i];
        const rowNum = DATA_START + i;

        const studentNameRaw = cell(row, C.studentName);
        const phoneRaw = cell(row, C.phone);
        const admStatus = cell(row, C.admissionStatus);
        const priorityRaw = cell(row, C.priority);
        const counsellorRaw = cell(row, C.counsellor);
        const followUpDateRaw = cell(row, C.followUpDate);
        const remarksRaw = cell(row, C.followUpRemarks);

        // Skip completely empty rows
        if (!studentNameRaw && !phoneRaw) {
            console.log(`  Row ${rowNum}: ⏭  Empty row — skipped`);
            skipped++;
            continue;
        }

        // ── Match record in DB ────────────────────────────────────────────────
        const phoneKey = normalisePhone(phoneRaw);
        const candidates = byPhone.get(phoneKey) ?? [];

        let matched = null;

        if (candidates.length === 1) {
            matched = candidates[0];
        } else if (candidates.length > 1) {
            // Multiple records share this phone → try to narrow by name
            const nameLower = studentNameRaw.toLowerCase().replace(/\s+/g, ' ').trim();
            matched = candidates.find(r =>
                r.studentName.toLowerCase().replace(/\s+/g, ' ').trim() === nameLower
            ) ?? candidates[0]; // take first if name still ambiguous
        }

        if (!matched) {
            // ── CREATE: insert this SOR row as a new inquiry ──────────────────
            if (!studentNameRaw) {
                console.log(`  Row ${rowNum}: ⏭  No student name and no phone match — skipped`);
                skipped++;
                continue;
            }

            const snRaw = cell(row, C.sn);
            const snNum = snRaw.match(/\d+/) ? parseInt(snRaw.match(/\d+/)[0], 10) : null;
            let newInqId;
            if (snNum) {
                newInqId = `S-${snNum}`;
                // If that ID already exists (collision), bump to after maxSeq
                if (usedIds.has(newInqId)) {
                    maxSeq++;
                    newInqId = `S-${maxSeq}`;
                }
            } else {
                maxSeq++;
                newInqId = `S-${maxSeq}`;
            }
            usedIds.add(newInqId);

            const newStatus = mapStatus(cell(row, C.admissionStatus)) ?? 'New';
            const newPriority = mapPriority(cell(row, C.priority));
            const counsellor = cell(row, C.counsellor) || DEFAULT_COUNSELLOR;
            const followUpDate = parseDate(cell(row, C.followUpDate));
            const remarksRaw = cell(row, C.followUpRemarks);
            const parentNameRaw = cell(row, C.parentName);
            const dateRaw = cell(row, C.date);

            console.log(
                `  Row ${rowNum}: ➕  CREATE "${studentNameRaw}" as ${newInqId}` +
                ` status=${newStatus} priority=${newPriority ?? '–'}` +
                ` counsellor="${counsellor}"` +
                (followUpDate ? ` followUp=${followUpDate.toDateString()}` : '')
            );

            if (DRY_RUN) {
                created++;
                continue;
            }

            try {
                await prisma.inquiry.create({
                    data: {
                        inquiryId: newInqId,
                        tenantId: 'anushtan-siddipet',
                        studentName: studentNameRaw,
                        parentName: parentNameRaw || 'Unknown',
                        phone: phoneRaw || '0000000000',
                        currentSchool: cell(row, C.currentSchool) || null,
                        source: 'PaperForm',
                        createdBy: counsellor,
                        assignedTo: counsellor,
                        status: newStatus,
                        priority: newPriority ?? null,
                        followUpDate: followUpDate ?? null,
                        inquiryDate: parseDate(dateRaw) ?? new Date(),
                        isSyncedToSheet: true,
                    },
                });

                // Activity log entries
                await prisma.counselorActivityLog.create({
                    data: {
                        inquiryId: newInqId,
                        counselorName: counsellor,
                        action: 'created',
                        newValue: newStatus,
                        comments: 'Backfilled from SOR Walk-ins sheet',
                    },
                });

                if (remarksRaw) {
                    await prisma.counselorActivityLog.create({
                        data: {
                            inquiryId: newInqId,
                            counselorName: counsellor,
                            action: 'note_added',
                            comments: `[SOR Follow-up Remark] ${remarksRaw}`,
                        },
                    });
                }

                created++;
            } catch (err) {
                console.error(`  Row ${rowNum}: ❌  Create ${newInqId} — ${err.message}`);
                errors++;
            }
            continue;
        }

        // ── Build update payload ──────────────────────────────────────────────
        const newStatus = mapStatus(admStatus);
        const newPriority = mapPriority(priorityRaw);
        const counsellor = counsellorRaw || DEFAULT_COUNSELLOR;
        const followUpDate = parseDate(followUpDateRaw);

        const updateData = {};
        const logEntries = [];

        // Status
        if (newStatus && matched.status !== newStatus) {
            updateData.status = newStatus;
            logEntries.push({
                inquiryId: matched.inquiryId,
                counselorName: counsellor,
                action: 'status_change',
                oldValue: matched.status,
                newValue: newStatus,
                comments: `SOR sync: status updated from ${matched.status} → ${newStatus}`,
            });
        }

        // Priority
        if (newPriority && matched.priority !== newPriority) {
            updateData.priority = newPriority;
            logEntries.push({
                inquiryId: matched.inquiryId,
                counselorName: counsellor,
                action: 'note_added',
                newValue: newPriority,
                comments: `SOR sync: priority set to ${newPriority} (${priorityRaw})`,
            });
        }

        // Counsellor / assignedTo
        if (!matched.assignedTo || matched.assignedTo !== counsellor) {
            updateData.assignedTo = counsellor;
        }

        // Follow-up date
        if (followUpDate) {
            const existing = matched.followUpDate ? new Date(matched.followUpDate).toDateString() : null;
            if (existing !== followUpDate.toDateString()) {
                updateData.followUpDate = followUpDate;
                logEntries.push({
                    inquiryId: matched.inquiryId,
                    counselorName: counsellor,
                    action: 'follow_up_set',
                    newValue: followUpDate.toISOString().split('T')[0],
                    comments: `SOR sync: follow-up date set to ${followUpDate.toDateString()}`,
                });
            }
        }

        // Date (inquiryDate)
        const dateRaw = cell(row, C.date);
        const parsedInqDate = parseDate(dateRaw);
        if (parsedInqDate) {
            const existingInq = matched.inquiryDate ? new Date(matched.inquiryDate).toDateString() : null;
            if (existingInq !== parsedInqDate.toDateString()) {
                updateData.inquiryDate = parsedInqDate;
                logEntries.push({
                    inquiryId: matched.inquiryId,
                    counselorName: counsellor,
                    action: 'note_added',
                    comments: `SOR sync: inquiry date corrected to ${parsedInqDate.toDateString()}`,
                });
            }
        }

        // Follow-Up Remarks → counselor log
        if (remarksRaw) {
            logEntries.push({
                inquiryId: matched.inquiryId,
                counselorName: counsellor,
                action: 'note_added',
                comments: `[SOR Follow-up Remark] ${remarksRaw}`,
            });
        }

        const hasUpdates = Object.keys(updateData).length > 0 || logEntries.length > 0;

        if (!hasUpdates) {
            console.log(`  Row ${rowNum}: ✅  "${studentNameRaw}" — already up-to-date`);
            skipped++;
            continue;
        }

        console.log(
            `  Row ${rowNum}: 🔄  "${studentNameRaw}" (${matched.inquiryId})` +
            ` status=${newStatus ?? '–'} priority=${newPriority ?? '–'}` +
            ` counsellor="${counsellor}"` +
            (followUpDate ? ` followUp=${followUpDate.toDateString()}` : '') +
            (remarksRaw ? ` remark="${remarksRaw.substring(0, 40)}${remarksRaw.length > 40 ? '…' : ''}"` : '')
        );

        if (DRY_RUN) {
            updated++;
            continue;
        }

        try {
            // Update the inquiry record
            if (Object.keys(updateData).length > 0) {
                await prisma.inquiry.update({
                    where: { inquiryId: matched.inquiryId },
                    data: updateData,
                });
            }

            // Append activity log entries
            for (const entry of logEntries) {
                await prisma.counselorActivityLog.create({ data: entry });
            }

            updated++;
        } catch (err) {
            console.error(`  Row ${rowNum}: ❌  ${matched.inquiryId} — ${err.message}`);
            errors++;
        }
    }

    // ── 5. Summary ────────────────────────────────────────────────────────────
    console.log('\n──────────────────────────────────────────');
    console.log(`✅  Updated  : ${updated}`);
    console.log(`➕  Created  : ${created}`);
    console.log(`⏭   Skipped  : ${skipped}`);
    console.log(`❌  Errors   : ${errors}`);
    console.log('──────────────────────────────────────────\n');

    await prisma.$disconnect();
}

main().catch(err => {
    console.error('Fatal:', err.message);
    process.exit(1);
});
