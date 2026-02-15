
import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'apps/admin/.env') }); // Try admin env too

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

const WORKING_SHEET_NAME = 'Inquiries (Working)';

async function testUpdate() {
    console.log('--- Google Sheets Update Test ---');

    if (!SHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
        console.error('❌ Missing environment variables!');
        console.log('SHEET_ID:', SHEET_ID ? 'Set' : 'Missing');
        console.log('CLIENT_EMAIL:', CLIENT_EMAIL ? 'Set' : 'Missing');
        console.log('PRIVATE_KEY:', PRIVATE_KEY ? 'Set' : 'Missing');
        return;
    }

    try {
        console.log('✅ Environment variables loaded.');

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: CLIENT_EMAIL,
                private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        console.log('✅ Authenticated with Google Sheets API.');

        // 1. Read to find a row
        const targetId = 'S-1'; // Assuming S-1 exists, or we can list first few
        console.log(`\n🔍 Searching for ID "${targetId}" in ${WORKING_SHEET_NAME}...`);

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${WORKING_SHEET_NAME}!A2:A`,
        });

        const ids = response.data.values || [];
        const rowIndex = ids.findIndex(row => row[0] === targetId);

        if (rowIndex === -1) {
            console.error(`❌ ID ${targetId} not found in first ${ids.length} rows.`);
            console.log('Available IDs (first 5):', ids.slice(0, 5).map(r => r[0]));
            return;
        }

        const actualRow = rowIndex + 2;
        console.log(`✅ Found "${targetId}" at row ${actualRow}.`);

        // 2. Try to update
        const timestamp = new Date().toISOString();
        const updateValues = [
            [
                'Test Script',       // Counselor Name
                'Open',              // Status
                'Active',            // Case Status
                '2026-03-01',        // Follow Up
                `Test update at ${timestamp}`, // Comments
                timestamp            // Last Updated
            ]
        ];

        console.log(`\n📝 Attempting update on range: ${WORKING_SHEET_NAME}!V${actualRow}:AA${actualRow}`);

        const updateResponse = await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `${WORKING_SHEET_NAME}!V${actualRow}:AA${actualRow}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: updateValues },
        });

        console.log('✅ Update API call completed.');
        console.log('Status:', updateResponse.status);
        console.log('Updated Cells:', updateResponse.data.updatedCells);

    } catch (error: any) {
        console.error('\n❌ Test Failed:', error.message);
        if (error.response) {
            console.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testUpdate();
