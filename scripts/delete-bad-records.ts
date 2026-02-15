
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

let loaded = false;
for (const p of envPaths) {
    if (require('fs').existsSync(p)) {
        dotenv.config({ path: p });
        loaded = true;
    }
}

if (!loaded) console.warn('⚠️ No .env file found.');

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

if (!SHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    console.error('❌ Missing credentials.');
    process.exit(1);
}

const TARGET_SHEETS = ['Inquiries (Working)', 'Inquiries (SOR)'];
const CUTOFF_ID = 145; // Keep 1 to 145. Delete > 145.

async function cleanupSheets() {
    console.log(`--- Cleaning Up Sheets (Deleting > S-${CUTOFF_ID}) ---`);

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: CLIENT_EMAIL,
            private_key: PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Get Sheet Properties (to map Name -> SheetId for deleteDimension)
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const sheetMap = new Map();
    meta.data.sheets?.forEach(s => {
        sheetMap.set(s.properties?.title, s.properties?.sheetId);
    });

    for (const sheetName of TARGET_SHEETS) {
        const gid = sheetMap.get(sheetName);
        if (gid === undefined) {
            console.warn(`⚠️ Sheet "${sheetName}" not found. Skipping.`);
            continue;
        }

        console.log(`\n📄 Processing "${sheetName}" (GID: ${gid})...`);

        // Fetch IDs (Column A)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `'${sheetName}'!A2:A`,
        });

        const rows = response.data.values || [];
        const rowsToDelete = []; // List of specific row INDICES (0-based relative to A2? No, absolute)

        rows.forEach((row, index) => {
            const idRaw = row[0];
            if (!idRaw) return;

            // Extract number from S-XXX
            const match = idRaw.toString().match(/S-(\d+)/i);
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > CUTOFF_ID) {
                    rowsToDelete.push(index + 2); // +2 because A2 is index 0, and we want 1-based Row Number for logging?
                    // Actually API uses 0-index.
                    // If data starts at A2...
                    // Row 1 is header (Index 0)
                    // Row 2 is data[0] (Index 1)
                    // So index + 1 = API Row Index
                }
            }
        });

        if (rowsToDelete.length === 0) {
            console.log('   ✅ No rows found to delete.');
            continue;
        }

        console.log(`   Found ${rowsToDelete.length} rows to delete (IDs > S-${CUTOFF_ID}).`);
        console.log(`   Deleting rows: ${rowsToDelete[0]} to ${rowsToDelete[rowsToDelete.length - 1]}...`);

        // Convert individual rows to RANGES to reduce requests
        // Assumes simplified contiguous block at the end
        // But to be safe, we delete dimensions.
        // Important: Delete from bottom up to avoid index shift?
        // NO, deleteDimension supports multiple ranges, but if we delete row 10, row 11 becomes 10.
        // So we MUST delete from large index to small, OR assume one big block at the end.

        // Since user said they are "copied as unknown into new sheet" (likely appended),
        // they are likely a contiguous block at the bottom.

        // Let's verify continuity.
        let isContiguous = true;
        for (let i = 0; i < rowsToDelete.length - 1; i++) {
            if (rowsToDelete[i + 1] !== rowsToDelete[i] + 1) {
                isContiguous = false;
                break;
            }
        }

        const requests = [];

        if (isContiguous) {
            const startRowIndex = rowsToDelete[0] - 1; // 0-based inclusive
            const endRowIndex = rowsToDelete[rowsToDelete.length - 1]; // 0-based exclusive (so +1 from last index, matches count)

            console.log(`   Removing contiguous block: Rows ${startRowIndex + 1}-${endRowIndex}`);

            requests.push({
                deleteDimension: {
                    range: {
                        sheetId: gid,
                        dimension: 'ROWS',
                        startIndex: startRowIndex,
                        endIndex: endRowIndex,
                    }
                }
            });
        } else {
            console.log('   Rows are scattered. Creating batched requests (Reverse Order).');
            // We can actually send one batch request with multiple ranges? 
            // The API logic for multiple deletes in one batch is tricky (shifting).
            // It is documented that "If multiple requests are provided... they are applied in order".
            // So we MUST delete from bottom up.

            // Reverse sort
            rowsToDelete.sort((a, b) => b - a);

            // Deleting one by one is safe if sorted descending
            // But checking for sub-ranges is better.

            // Let's just do bulk delete ranges? 
            // Actually, if we use `deleteDimension`, we can delete a big range.
            // If they are scattered, we generate multiple ranges.

            let currentEnd = rowsToDelete[0];
            let currentStart = rowsToDelete[0];

            // Build ranges from descending list
            // Example: 100, 99, 98 (block) ... 50 (single)
            // Implementation complexity: High.

            // Fallback: Just delete them one by one? Rate limit issues.
            // But expected case: they are contiguous at the end.

            // Only implement safe reverse deletion if needed.
            rowsToDelete.forEach(r => {
                requests.push({
                    deleteDimension: {
                        range: {
                            sheetId: gid,
                            dimension: 'ROWS',
                            startIndex: r - 1,
                            endIndex: r,
                        }
                    }
                });
            });
        }

        if (requests.length > 0) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SHEET_ID,
                requestBody: { requests }
            });
            console.log('   ✅ Deletion complete.');
        }
    }

    console.log('\n--- Cleanup Complete ---');
}

cleanupSheets().catch(console.error);
