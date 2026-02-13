const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

async function testConnection() {
    console.log('--- Google Sheets Connection Test ---');

    // 1. Load environment variables manually
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) {
            console.error('❌ .env.local file not found!');
            return;
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        const envVars = {};

        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                let value = match[2].trim();
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                envVars[match[1]] = value;
            }
        });

        // 2. Configure Auth
        const clientEmail = envVars.GOOGLE_SHEETS_CLIENT_EMAIL;
        const privateKey = envVars.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const sheetId = envVars.GOOGLE_SHEET_ID;

        console.log(`Checking credentials for: ${clientEmail}`);
        console.log(`Sheet ID: ${sheetId}`);

        if (!clientEmail || !privateKey || !sheetId) {
            console.error('❌ Missing required environment variables!');
            return;
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // 3. Try to read the sheet
        console.log('Attempting to read sheet metadata...');
        const response = await sheets.spreadsheets.get({
            spreadsheetId: sheetId,
        });

        console.log('✅ Connection Successful!');
        console.log(`Sheet Title: ${response.data.properties.title}`);

        // 4. Try to append a test row
        console.log('Attempting to append a test row...');
        const testRow = ['TEST-CONNECTION', new Date().toISOString(), 'Connection Test', 'N/A'];

        // Check if "Inquiries (Working)" exists, if not list sheets
        const sheetNames = response.data.sheets.map(s => s.properties.title);
        console.log(`Available Sheets: ${sheetNames.join(', ')}`);

        const targetSheet = sheetNames.includes('Inquiries (Working)') ? 'Inquiries (Working)' : sheetNames[0];

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: `${targetSheet}!A:A`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [testRow] },
        });

        console.log(`✅ Successfully appended test row to "${targetSheet}"`);

    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
        if (error.response) {
            console.error('API Error:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testConnection();
