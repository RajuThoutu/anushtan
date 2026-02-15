
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
        const result = dotenv.config({ path: p });
        if (result.error) {
            console.error(`❌ Error parsing ${p}:`, result.error.message);
        } else {
            console.log(`📄 Parsed keys: ${Object.keys(result.parsed || {}).join(', ')}`);
            loaded = true;
        }
    } else {
        console.log(`❌ Not found: ${p}`);
    }
}

if (!loaded) console.warn('⚠️ No .env file found in standard locations.');

const OLD_SHEET_ID = '1zDQT1JLG4FIU2vps5SjLuYoXoV5G-Aw9rA6dPGxuBZY';
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

console.log('--- Debugging Loaded Vars ---');
console.log('GOOGLE_SHEETS_CLIENT_EMAIL:', process.env.GOOGLE_SHEETS_CLIENT_EMAIL ? 'Set' : 'Missing');
console.log('GOOGLE_SHEETS_PRIVATE_KEY:', process.env.GOOGLE_SHEETS_PRIVATE_KEY ? 'Set' : 'Missing');
console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID ? 'Set' : 'Missing');
console.log('SHEET_ID (Alternative):', process.env.SHEET_ID ? 'Set' : 'Missing');


async function inspectOldSheet() {
    console.log('--- Inspecting Old Sheet Headers ---');

    if (!CLIENT_EMAIL || !PRIVATE_KEY) {
        console.error('❌ Missing credentials in .env');
        return;
    }

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: CLIENT_EMAIL,
                private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        console.log(`✅ Authenticated. Accessing Sheet ID: ${OLD_SHEET_ID}`);

        // First, get the sheet name
        const meta = await sheets.spreadsheets.get({ spreadsheetId: OLD_SHEET_ID });
        const sheetName = meta.data.sheets?.[0]?.properties?.title;
        console.log(`ℹ️ First Sheet Name: "${sheetName}"`);

        if (!sheetName) {
            throw new Error('Could not determine sheet name');
        }

        // Read the first row (headers)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: OLD_SHEET_ID,
            range: `'${sheetName}'!A1:Z1`, // Use dynamic name
        });

        const headers = response.data.values?.[0] || [];

        if (headers.length === 0) {
            console.warn('⚠️ No headers found, or sheet is empty/named differently.');
            // Try fetching sheet metadata to get real sheet name
            const meta = await sheets.spreadsheets.get({ spreadsheetId: OLD_SHEET_ID });
            const sheetName = meta.data.sheets?.[0]?.properties?.title;
            console.log(`ℹ️ Actual Sheet Name: "${sheetName}"`);

            if (sheetName) {
                console.log(`Retrying with "${sheetName}"...`);
                const retry = await sheets.spreadsheets.values.get({
                    spreadsheetId: OLD_SHEET_ID,
                    range: `'${sheetName}'!A1:Z1`,
                });
                console.log('Headers:', retry.data.values?.[0]);
            }
        } else {
            console.log('✅ Headers found:');
            headers.forEach((h, i) => console.log(`${i}: ${h}`));
        }

    } catch (error: any) {
        console.error('❌ Error accessing old sheet:', error.message);
        console.log('💡 Note: You may need to share the old sheet with:', CLIENT_EMAIL);
    }
}

inspectOldSheet();
