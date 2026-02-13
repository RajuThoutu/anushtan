import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const LEGACY_SHEET_ID = '1zDQT1JLG4FIU2vps5SjLuYoXoV5G-Aw9rA6dPGxuBZY';

async function analyzeLegacySheet() {
    try {
        console.log('Authenticating with Google Sheets...');
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        console.log(`Reading headers from sheet: ${LEGACY_SHEET_ID}`);
        // Read the first row (headers) and maybe a few data rows
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: LEGACY_SHEET_ID,
            range: 'A1:Z5', // Read first 5 rows, columns A to Z (assuming unlikely to have more columns)
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            console.log('No data found.');
            return;
        }

        console.log('--- Headers (Row 1) ---');
        rows[0].forEach((header, index) => {
            console.log(`Column ${String.fromCharCode(65 + index)}: ${header}`);
        });

        console.log('\n--- Sample Data (Row 2) ---');
        if (rows.length > 1) {
            rows[1].forEach((value, index) => {
                console.log(`Column ${String.fromCharCode(65 + index)}: ${value}`);
            });
        }

    } catch (error) {
        console.error('Error analyzing sheet:', error);
    }
}

analyzeLegacySheet();
