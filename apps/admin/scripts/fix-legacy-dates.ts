import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1iCw9yiZ4R_yrR82V2TvmOH9mfiXDIrFdHrXdRnxxNIg';

const SOR_SHEET_NAME = 'Inquiries (SOR)';
const WORKING_SHEET_NAME = 'Inquiries (Working)';

async function distributeLegacyDates() {
    console.log('Starting date distribution...');

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // 1. Fetch SOR Data to identify rows
    console.log('Fetching SOR data...');
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${SOR_SHEET_NAME}!A:A`, // Get IDs
    });

    const rows = response.data.values || [];

    // Find migrated rows
    let startIndex = -1;
    let endIndex = -1;

    for (let i = 0; i < rows.length; i++) {
        const id = rows[i][0];
        if (id === 'S-19') startIndex = i;
        if (id === 'S-233') endIndex = i;
    }

    if (startIndex === -1) {
        console.error('Could not find start ID S-19');
        return;
    }
    if (endIndex === -1) endIndex = rows.length - 1;

    console.log(`Updating rows ${startIndex + 1} to ${endIndex + 1}`);

    // 2. Add Rows if needed (The error was grid limits)
    // We can't easily check grid limits via values.get, but we can try to append empty rows
    // or just rely on 'append' to create them? No, we are doing 'update'.
    // If we are updating row 233, and sheet only has 220 rows, it fails.
    // The previous migration used 'append', which automatically extends the sheet.
    // So the sheet SHOULD be big enough. 
    // Wait, the error said `Max rows: 220`. 
    // If I have 233 rows of data, how can max rows be 220?
    // Maybe the 'Working' sheet didn't get all the rows?
    // Let's check the Working sheet's data count.

    const workingResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${WORKING_SHEET_NAME}!A:A`,
    });
    const workingRows = workingResponse.data.values || [];
    console.log(`Working Sheet has ${workingRows.length} rows.`);

    if (workingRows.length < (endIndex + 1)) {
        console.warn(`Working sheet has fewer rows than expected. Sync issue?`);
        // If Working sheet is missing rows, we can't update them. 
        // But migration said "Appending 215 rows to Working Sheet...".
        // Let's assume there might be a mismatch or something.
        // We will limit our update to the minimum of available rows to avoid error.
        endIndex = Math.min(endIndex, workingRows.length - 1);
        console.log(`Adjusted End Index to ${endIndex + 1}`);
    }

    // 3. Generate Dates
    let currentDate = new Date('2026-01-23T09:00:00'); // Start Jan 23
    let dailyCount = 0;
    let dailyLimit = Math.floor(Math.random() * (15 - 10 + 1) + 10); // Random 10-15

    const updateRequests = [];

    for (let i = startIndex; i <= endIndex; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const timeStr = currentDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

        const sheetRow = i + 1;

        // Update SOR
        updateRequests.push({
            range: `${SOR_SHEET_NAME}!B${sheetRow}`,
            values: [[timeStr]]
        });
        updateRequests.push({
            range: `${SOR_SHEET_NAME}!S${sheetRow}`,
            values: [[dateStr]]
        });

        // Update Working
        updateRequests.push({
            range: `${WORKING_SHEET_NAME}!B${sheetRow}`,
            values: [[timeStr]]
        });
        updateRequests.push({
            range: `${WORKING_SHEET_NAME}!S${sheetRow}`,
            values: [[dateStr]]
        });

        // Increment Logic
        dailyCount++;
        if (dailyCount >= dailyLimit) {
            currentDate.setDate(currentDate.getDate() + 1);
            dailyCount = 0;
            dailyLimit = Math.floor(Math.random() * (15 - 10 + 1) + 10);
        }
    }

    console.log(`Prepared ${updateRequests.length} updates.`);

    if (updateRequests.length === 0) {
        console.log('No updates to make.');
        return;
    }

    // 4. Batch Update (Chunks of 50 to avoid payload limits/timeouts if any)
    const chunkSize = 50;
    for (let i = 0; i < updateRequests.length; i += chunkSize) {
        const chunk = updateRequests.slice(i, i + chunkSize);

        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: SHEET_ID,
            requestBody: {
                valueInputOption: 'USER_ENTERED',
                data: chunk
            }
        });
        console.log(`Updated chunk ${i}-${i + chunkSize}`);
    }

    console.log('Dates distributed successfully!');
}

distributeLegacyDates();
