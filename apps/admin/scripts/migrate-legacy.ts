import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Configuration
const LEGACY_SHEET_ID = '1zDQT1JLG4FIU2vps5SjLuYoXoV5G-Aw9rA6dPGxuBZY';
const DEST_SHEET_ID = process.env.GOOGLE_SHEET_ID || '1iCw9yiZ4R_yrR82V2TvmOH9mfiXDIrFdHrXdRnxxNIg';

const SOR_SHEET_NAME = 'Inquiries (SOR)';
const WORKING_SHEET_NAME = 'Inquiries (Working)';

async function migrateLegacy() {
    console.log('Starting migration...');

    // 1. Auth
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // 2. Read Legacy Data
    console.log(`Reading legacy data from ${LEGACY_SHEET_ID}...`);
    const legacyResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: LEGACY_SHEET_ID,
        range: 'A2:Z', // Skip header
    });
    const legacyRows = legacyResponse.data.values || [];
    console.log(`Found ${legacyRows.length} rows to migrate.`);

    if (legacyRows.length === 0) return;

    // 3. Get Starting ID for New Sheet
    let nextIdNum = 1;
    try {
        const idResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: DEST_SHEET_ID,
            range: `${SOR_SHEET_NAME}!A:A`,
        });
        const existingIds = idResponse.data.values || [];
        if (existingIds.length > 1) {
            const lastId = existingIds[existingIds.length - 1][0]; // e.g., "S-105"
            const match = lastId.match(/S-(\d+)/);
            if (match) {
                nextIdNum = parseInt(match[1]) + 1;
            }
        }
    } catch (e) {
        console.warn('Could not determine last ID, starting from S-1', e);
    }

    console.log(`Starting ID generation from S-${nextIdNum}`);

    // 4. Batch Prepare Data
    const sorRows = [];
    const workingRows = [];

    for (const row of legacyRows) {
        // --- Extract Legacy Fields ---
        // A: S/N (Ignore, generate new)
        // B: STATUS -> Map to new status
        // D: DATE -> Inquiry Date
        // E: COUNSELLOR -> Counselor Name
        // H: STUDENT NAME
        // I: PARENT NAME
        // L: PRIMARY CONTACT
        // M: SECONDARY CONTACT (use if distinct)
        // N: CURRENT SCHOOL
        // O: CURRENT CLASS
        // P: BOARD
        // Q: LEAD SOURCE
        // R: DS / HOSTEL
        // T: COMMENTS
        // W: FOLLOW UP DATE

        const rawStatus = row[1] || 'New';
        const inquiryDate = row[3] || new Date().toISOString().split('T')[0];
        const counselor = row[4] || '';
        const studentName = row[7] || 'Unknown Student';
        const parentName = row[8] || 'Unknown Parent';
        const phone = row[11] || '';
        const secondary = row[12];
        const prevSchool = row[13] || '';
        const currentClass = row[14] || '';
        const board = row[15] || '';
        const source = row[16] || 'Legacy Import';
        const type = row[17] || ''; // DS/Hostel
        const comments = row[19] || '';
        const followUp = row[22] || '';

        // Status Mapping
        let status = 'New';
        const s = rawStatus.toLowerCase();
        if (s.includes('admission') || s.includes('converted') || s.includes('joined')) status = 'Converted';
        else if (s.includes('drop') || s.includes('close') || s.includes('not interested')) status = 'Closed';
        else if (s.includes('follow') || s.includes('call') || s.includes('visit')) status = 'Follow-up';
        else if (s.includes('enquiry') || s.includes('intrested')) status = 'Open';

        const id = `S-${nextIdNum++}`;
        const timestamp = new Date().toISOString();

        // --- Prepare Row Data for SOR (Cols A-U) ---
        // A: ID, B: Timestamp, C: Student, D: Class, E: School, F: Board, G: Parent, H: Occ, I: Phone, J: Secondary
        // K: Email, L: Guide, M: Learning, N: Teacher, O: ChildImp, P: Env, Q: HowHeard, R: Type, S: InqDate, T: Priority, U: Notes
        const sorRow = [
            id,
            timestamp,
            studentName,
            currentClass,
            prevSchool,
            board,
            parentName,
            '', // Occupation (J is occ in legacy? let's check. J=10. Array index 9. Yes, J is occupation)
            phone,
            secondary || '',
            '', // Email - missing in legacy
            '', // Education Guide
            '', // Learning Method
            '', // Teacher pref
            '', // Child imp
            '', // School env
            source, // How heard
            type, // Day scholar/Hostel
            inquiryDate, // Inquiry Date
            '', // Priority (Legacy col C is priority? C=2. Let's map it.)
            comments // Notes
        ];

        // Fix mappings I missed during array construction
        // Row J (index 9) is Occupation in Legacy. Row K (index 10) is Date of Joining. 
        // My extraction above: J is `row[9]`.
        sorRow[7] = row[9] || ''; // Set Occupation correctly

        // Priority from Col C (index 2)
        const priority = row[2] || 'Medium';
        sorRow[19] = priority;

        sorRows.push(sorRow);

        // --- Prepare Row Data for Working (Cols A-Z) ---
        // Same as SOR + V: Counselor, W: Status, X: CaseStatus, Y: FollowUp, Z: Comments
        let caseStatus = 'Active';
        if (status === 'Converted' || status === 'Closed') caseStatus = 'Resolved-Completed';

        const workingRow = [
            ...sorRow,
            counselor,          // V
            status,             // W
            caseStatus,         // X
            followUp,           // Y
            comments            // Z (Using same comments as notes for now)
        ];
        workingRows.push(workingRow);
    }

    // 5. Bulk Append (More efficient than 1-by-1)
    if (sorRows.length > 0) {
        console.log(`Appending ${sorRows.length} rows to SOR...`);
        await sheets.spreadsheets.values.append({
            spreadsheetId: DEST_SHEET_ID,
            range: `${SOR_SHEET_NAME}!A:U`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: sorRows },
        });

        console.log(`Appending ${workingRows.length} rows to Working Sheet...`);
        await sheets.spreadsheets.values.append({
            spreadsheetId: DEST_SHEET_ID,
            range: `${WORKING_SHEET_NAME}!A:Z`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: workingRows },
        });
    }

    console.log('Migration complete!');
}

migrateLegacy();
