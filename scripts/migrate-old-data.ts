
import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), 'apps/admin/.env'),
    path.resolve(process.cwd(), 'apps/admin/.env.local'),
    path.resolve(process.cwd(), 'apps/web/.env'),
    path.resolve(process.cwd(), 'apps/web/.env.local'),
    path.resolve(process.cwd(), 'packages/database/.env'),
    '/Applications/anushtan/.env.local',
    '/Applications/anushtan/apps/admin/.env.local'
];

console.log('--- Loading Environment Variables ---');
let loaded = false;
for (const p of envPaths) {
    if (require('fs').existsSync(p)) {
        console.log(`✅ Found .env at: ${p}`);
        dotenv.config({ path: p });
        loaded = true;
    }
}

if (!loaded) console.warn('⚠️ No .env file found in standard locations.');

// Configuration
const OLD_SHEET_ID = '1zDQT1JLG4FIU2vps5SjLuYoXoV5G-Aw9rA6dPGxuBZY';
const OLD_SHEET_NAME = 'Walk ins';
const NEW_SHEET_ID = process.env.GOOGLE_SHEET_ID || '1iCw9yiZ4R_yrR82V2TvmOH9mfiXDIrFdHrXdRnxxNIg'; // Fallback to what we saw in client.ts
const NEW_SHEET_NAME = 'Inquiries (Working)';

const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

if (!CLIENT_EMAIL || !PRIVATE_KEY) {
    console.error('❌ Missing credentials (GOOGLE_SHEETS_CLIENT_EMAIL / PRIVATE_KEY)');
    process.exit(1);
}

// Column Indices in Old Sheet ('Walk ins')
const IDX = {
    SN: 0,
    STATUS: 1,
    PRIORITY: 2,
    DATE: 3,
    COUNSELOR: 4,
    STUDENT_NAME: 7,
    PARENT_NAME: 8,
    OCCUPATION: 9,
    PHONE: 11,
    SECONDARY_PHONE: 12,
    CURRENT_SCHOOL: 13,
    CURRENT_CLASS: 14,
    BOARD: 15,
    LEAD_SOURCE: 16,
    DS_HOSTEL: 17,
    COMMENTS: 19,
};

async function migrateData() {
    console.log('--- Starting Data Migration ---');

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: CLIENT_EMAIL,
            private_key: PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 1. Fetch Old Data
    console.log(`\n📥 Fetching data from Old Sheet: ${OLD_SHEET_NAME}...`);
    const oldResp = await sheets.spreadsheets.values.get({
        spreadsheetId: OLD_SHEET_ID,
        range: `'${OLD_SHEET_NAME}'!A2:Z`, // Skip header
    });
    const oldRows = oldResp.data.values || [];
    console.log(`   Found ${oldRows.length} rows in Old Sheet.`);

    // 2. Fetch New Data (to find where to update)
    console.log(`\n📥 Fetching data from New Sheet: ${NEW_SHEET_NAME}...`);
    const newResp = await sheets.spreadsheets.values.get({
        spreadsheetId: NEW_SHEET_ID,
        range: `'${NEW_SHEET_NAME}'!A2:A`, // Just IDs to find index
    });
    const newIds = newResp.data.values || [];
    console.log(`   Found ${newIds.length} existing rows in New Sheet.`);

    // 3. Process Rows
    console.log('\n🔄 Processing rows...');
    let updatedCount = 0;
    let skippedCount = 0;
    let notFoundCount = 0;

    // Create a map of New IDs for faster lookup
    const newIdMap = new Map();
    newIds.forEach((row, index) => {
        if (row[0]) newIdMap.set(row[0].toString().trim().toUpperCase(), index + 2);
    });

    console.log(`   Indexed ${newIdMap.size} rows in New Sheet.`);
    console.log(`   Sample New IDs: ${Array.from(newIdMap.keys()).slice(0, 5).join(', ')}`);

    for (const oldRow of oldRows) {
        // Get ID (S/N)
        let idRaw = oldRow[IDX.SN];
        if (!idRaw) continue;

        // Normalize ID (e.g. "139" -> "S-139")
        let id = idRaw.toString().trim();
        // If it's just a number, prepend S-
        if (/^\d+$/.test(id)) {
            id = `S-${id}`;
        }

        const idKey = id.toUpperCase();
        const actualRow = newIdMap.get(idKey);

        if (!actualRow) {
            if (notFoundCount < 5) console.log(`   ⚠️ ID Not Found in Target: ${id} (Raw: ${idRaw})`);
            notFoundCount++;
            continue;
        }

        // Extract Data
        const studentName = oldRow[IDX.STUDENT_NAME] || 'Unknown';
        // Basic check: if student name is empty in old sheet, maybe skip?
        if (!oldRow[IDX.STUDENT_NAME]) {
            skippedCount++;
            continue;
        }

        // Map to New Sheet Columns (A-U)
        // A: ID (already match)
        // B: Timestamp (Keep existing? or use Date from old?) -> Let's update Date if valid
        // C: Student Name
        // ...

        const updateValuesMap = {
            timestamp: oldRow[IDX.DATE] || new Date().toISOString(),
            studentName: oldRow[IDX.STUDENT_NAME] || '',
            currentClass: oldRow[IDX.CURRENT_CLASS] || '',
            currentSchool: oldRow[IDX.CURRENT_SCHOOL] || '',
            board: oldRow[IDX.BOARD] || '',
            parentName: oldRow[IDX.PARENT_NAME] || '',
            occupation: oldRow[IDX.OCCUPATION] || '',
            phone: oldRow[IDX.PHONE] || '',
            secondaryContact: oldRow[IDX.SECONDARY_PHONE] || '',
            // email: ??? Old sheet has no email column! Keep existing.
            // educationGuide... childImportance (Stats) -> Empty on old sheet?
            howHeard: oldRow[IDX.LEAD_SOURCE] || '',
            dayScholarHostel: oldRow[IDX.DS_HOSTEL] || '',
            inquiryDate: oldRow[IDX.DATE] || '',
            priority: oldRow[IDX.PRIORITY] || '',
            notes: oldRow[IDX.COMMENTS] || '',
            counselorName: oldRow[IDX.COUNSELOR] || '',
            status: oldRow[IDX.STATUS] || '',
        };

        // Construct Update Array for Columns B-U (Indices 1-20)
        // AND V-Z (Counselor fields)

        // Strategy: We need to perform individual updates or batch them.
        // Batching is harder with random row indices.
        // We will do one update per row for now (slow but safe). 
        // Wait, batching `batchUpdate` is better.
        // For simplicity and safety (to not overwrite existing Email if it exists), 
        // we might want to read the row first. But that's slow.
        // The user says they are "unknown", implying they are likely blank/default.
        // I will overwrite Columns C-J (Student details) and V-Z (Counselor details).

        // Construct Batch Update Data
        const updateData = [];

        // Range 1: C-J (Student to Secondary Contact)
        updateData.push({
            range: `'${NEW_SHEET_NAME}'!C${actualRow}:J${actualRow}`,
            values: [[
                updateValuesMap.studentName,
                updateValuesMap.currentClass,
                updateValuesMap.currentSchool,
                updateValuesMap.board,
                updateValuesMap.parentName,
                updateValuesMap.occupation,
                updateValuesMap.phone,
                updateValuesMap.secondaryContact
            ]]
        });

        // Range 2: Q-T (How Heard, DS, Date, Priority)
        updateData.push({
            range: `'${NEW_SHEET_NAME}'!Q${actualRow}:T${actualRow}`,
            values: [[
                updateValuesMap.howHeard,
                updateValuesMap.dayScholarHostel,
                updateValuesMap.inquiryDate,
                updateValuesMap.priority
            ]]
        });

        // Range 3: V-W (Counselor, Status)
        updateData.push({
            range: `'${NEW_SHEET_NAME}'!V${actualRow}:W${actualRow}`,
            values: [[
                updateValuesMap.counselorName,
                updateValuesMap.status
            ]]
        });

        // Notes/Comments (U & Z)
        if (updateValuesMap.notes) {
            updateData.push({
                range: `'${NEW_SHEET_NAME}'!U${actualRow}`,
                values: [[updateValuesMap.notes]]
            });
            updateData.push({
                range: `'${NEW_SHEET_NAME}'!Z${actualRow}`,
                values: [[updateValuesMap.notes]]
            });
        }

        // Execute Batch Update (1 call instead of 4-5)
        try {
            await sheets.spreadsheets.values.batchUpdate({
                spreadsheetId: NEW_SHEET_ID,
                requestBody: {
                    valueInputOption: 'USER_ENTERED',
                    data: updateData
                }
            });

            updatedCount++;
            console.log(`   ✅ Updated ${id} (${updateValuesMap.studentName})`);

            // Rate Limit: Sleep 500ms
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (err: any) {
            console.error(`   ❌ Failed to update ${id}:`, err.message);
            // Verify if actually 429 and wait longer?
            if (err.code === 429) {
                console.log('   ⏳ 429 Hit. Waiting 10s...');
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        }

        // Rate limit logging/output
        if (updatedCount % 10 === 0) console.log(`   ... processed ${updatedCount} records`);
    }

    console.log('\n--- Migration Complete ---');
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped (Missing Name): ${skippedCount}`);
    console.log(`Not Found in Target: ${notFoundCount}`);
}

migrateData().catch(console.error);
