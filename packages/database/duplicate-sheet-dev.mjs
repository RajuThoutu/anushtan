/**
 * duplicate-sheet-dev.mjs
 * Copies the production Google Sheet and names it "Anushtan Inquiries _dev"
 * Outputs the new Sheet ID so we can update env vars.
 */
import { createRequire } from 'module';
import { readFileSync, existsSync } from 'fs';

const require = createRequire(import.meta.url);

// Load credentials
const envPath = '/Applications/anushtan/apps/admin/.env.local';
if (existsSync(envPath)) {
    readFileSync(envPath, 'utf8').split('\n').forEach(line => {
        const m = line.match(/^([^#=]+)=(.*)$/);
        if (m) process.env[m[1].trim()] = m[2].trim().replace(/^"(.*)"$/, '$1');
    });
}

const { google } = require('googleapis');
const PROD_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

const auth = new google.auth.GoogleAuth({
    credentials: { client_email: CLIENT_EMAIL, private_key: PRIVATE_KEY },
    scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'],
});

const drive = google.drive({ version: 'v3', auth });
const sheets = google.sheets({ version: 'v4', auth });

async function main() {
    console.log(`\n📋 Copying production sheet: ${PROD_SHEET_ID}`);

    // 1. Get the original sheet name
    const meta = await sheets.spreadsheets.get({ spreadsheetId: PROD_SHEET_ID });
    const originalTitle = meta.data.properties.title;
    const devTitle = `${originalTitle} _dev`;
    console.log(`   Original name: "${originalTitle}"`);
    console.log(`   New dev name:  "${devTitle}"`);

    // 2. Copy the file via Drive API
    const copy = await drive.files.copy({
        fileId: PROD_SHEET_ID,
        requestBody: { name: devTitle },
        fields: 'id,name,webViewLink',
    });

    const devSheetId = copy.data.id;
    const devSheetUrl = copy.data.webViewLink;

    console.log(`\n✅ Dev sheet created!`);
    console.log(`   Sheet ID:  ${devSheetId}`);
    console.log(`   Sheet URL: ${devSheetUrl}`);
    console.log(`\n📌 Add this to your dev .env.local / packages/database/.env:`);
    console.log(`   GOOGLE_SHEET_ID="${devSheetId}"`);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
