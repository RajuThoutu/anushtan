import { google } from 'googleapis';

// Google Sheets configuration
const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1iCw9yiZ4R_yrR82V2TvmOH9mfiXDIrFdHrXdRnxxNIg';
const SOR_SHEET_NAME = 'Inquiries (SOR)';      // Source of Record - Google Forms submits here
const WORKING_SHEET_NAME = 'Inquiries (Working)'; // Working copy - Counselors edit here

// Initialize Google Sheets API client
export function getGoogleSheetsClient() {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
}

// Fetch all inquiries from Working sheet
export async function getAllInquiries() {
    try {
        const sheets = getGoogleSheetsClient();

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${WORKING_SHEET_NAME}!A2:AA`, // All columns including lastUpdated
        });

        const rows = response.data.values || [];

        // Map rows to inquiry objects
        const inquiries = rows.map((row) => ({
            id: row[0] || '',              // Column A: Inquiry ID (S-1, S-2, etc.)
            timestamp: row[1] || '',        // Column B: Timestamp
            studentName: row[2] || '',      // Column C: Student Name
            currentClass: row[3] || '',     // Column D: Current Class
            currentSchool: row[4] || '',    // Column E: Current School
            board: row[5] || '',            // Column F: Board
            parentName: row[6] || '',       // Column G: Parent Name
            occupation: row[7] || '',       // Column H: Occupation
            phone: row[8] || '',            // Column I: Primary Contact
            secondaryContact: row[9] || '', // Column J: Secondary Contact
            email: row[10] || '',           // Column K: Email Address
            educationGuide: row[11] || '',  // Column L: Who should guide education
            learningMethod: row[12] || '',  // Column M: How children learn
            teacherPreference: row[13] || '', // Column N: Teacher preference
            childImportance: row[14] || '', // Column O: What's important for child
            schoolEnvironment: row[15] || '', // Column P: School environment preference
            howHeard: row[16] || '',        // Column Q: How did you hear about us
            dayScholarHostel: row[17] || '', // Column R: Day Scholar / Hostel
            inquiryDate: row[18] || '',     // Column S: Inquiry Date
            priority: row[19] || '',        // Column T: Priority
            notes: row[20] || '',           // Column U: Comments / Notes
            // Counselor fields (V-Z)
            counselorName: row[21] || '',   // Column V: Counselor Name (who updated)
            status: row[22] || 'New',       // Column W: Status (default: New)
            caseStatus: row[23] || 'Active', // Column X: Inq Status (default: Active)
            followUpDate: row[24] || '',    // Column Y: Follow-up Date
            counselorComments: row[25] || '', // Column Z: Counselor Comments
            lastUpdated: row[26] || row[1] || '', // Column AA: Last Updated (fallback to creation timestamp)
        }));

        return inquiries;
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        throw new Error(`Failed to fetch inquiries: ${error instanceof Error ? error.message : String(error)}`);
    }
}

// Fetch single inquiry by ID (S-1, S-2, etc.)
export async function getInquiryById(inquiryId: string): Promise<Inquiry> {
    try {
        const sheets = getGoogleSheetsClient();

        // Get all inquiries and find the one with matching ID
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${WORKING_SHEET_NAME}!A2:AA`, // All columns including lastUpdated
        });

        const rows = response.data.values || [];
        const rowIndex = rows.findIndex(row => row[0] === inquiryId);

        if (rowIndex === -1) {
            throw new Error('Inquiry not found');
        }

        const row = rows[rowIndex];

        // Map to Inquiry type
        return {
            id: row[0] || '',              // Column A: Inquiry ID
            timestamp: row[1] || '',        // Column B: Timestamp
            studentName: row[2] || '',      // Column C: Student Name
            currentClass: row[3] || '',     // Column D: Current Class
            currentSchool: row[4] || '',    // Column E: Current School
            board: row[5] || '',            // Column F: Board
            parentName: row[6] || '',       // Column G: Parent Name
            occupation: row[7] || '',       // Column H: Occupation
            phone: row[8] || '',            // Column I: Primary Contact
            secondaryContact: row[9] || '', // Column J: Secondary Contact
            email: row[10] || '',           // Column K: Email Address
            educationGuide: row[11] || '',  // Column L: Who should guide education
            learningMethod: row[12] || '',  // Column M: How children learn
            teacherPreference: row[13] || '', // Column N: Teacher preference
            childImportance: row[14] || '', // Column O: What's important for child
            schoolEnvironment: row[15] || '', // Column P: School environment
            howHeard: row[16] || '',        // Column Q: How heard about us
            dayScholarHostel: row[17] || '', // Column R: Day Scholar / Hostel
            inquiryDate: row[18] || '',     // Column S: Inquiry Date
            priority: row[19] || '',        // Column T: Priority
            notes: row[20] || '',           // Column U: Notes
            // Counselor fields (V-Z)
            counselorName: row[21] || '',   // Column V: Counselor Name (who updated)
            status: row[22] || 'New',       // Column W: Status (default: New)
            caseStatus: row[23] || 'Active', // Column X: Inq Status (default: Active)
            followUpDate: row[24] || '',    // Column Y: Follow-up Date
            counselorComments: row[25] || '', // Column Z: Counselor Comments
            lastUpdated: row[26] || row[1] || '', // Column AA: Last Updated
        };
    } catch (error) {
        console.error('Error fetching inquiry:', error);
        throw new Error('Failed to fetch inquiry from Google Sheets');
    }
}

// Update counselor actions in Working sheet with workflow logic
export async function updateCounselorActions(
    inquiryId: string,
    data: {
        status?: string;
        assignedTo?: string;
        counselorPriority?: string;
        followUpDate?: string;
        counselorComments?: string;
        updatedBy: string; // Required: counselor name from session
    }
) {
    try {
        const sheets = getGoogleSheetsClient();

        // Find the row with this inquiry ID
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${WORKING_SHEET_NAME}!A2:A`,
        });

        const ids = response.data.values || [];
        const rowIndex = ids.findIndex(row => row[0] === inquiryId);

        if (rowIndex === -1) {
            throw new Error('Inquiry not found');
        }

        const actualRow = rowIndex + 2; // +2 because: +1 for 0-index, +1 for header

        // Get current values to preserve unchanged fields (columns V-Z: 5 columns)
        const currentResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${WORKING_SHEET_NAME}!V${actualRow}:Z${actualRow}`,
        });

        const currentValues = currentResponse.data.values?.[0] || ['', '', '', '', ''];

        // Auto-calculate Inq Status (case status) based on workflow
        let inqStatus = 'Active';
        const newStatus = data.status !== undefined ? data.status : currentValues[1]; // Column W (index 1)
        if (newStatus === 'Converted' || newStatus === 'Closed') {
            inqStatus = 'Resolved-Completed';
        }

        // Prepare update data (columns V-AA: 6 columns)
        // V: Counselor Name (who updated)
        // W: Status (from UI)
        // X: Inq Status (case status - auto-calculated)
        // Y: Follow-up Date
        // Z: Counselor Comments
        // AA: Last Updated (new)
        const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

        const values = [
            [
                data.updatedBy,                                                      // Column V: Counselor Name (who updated)
                data.status !== undefined ? data.status : currentValues[1],         // Column W: Status
                inqStatus,                                                           // Column X: Inq Status (auto-calculated)
                data.followUpDate !== undefined ? data.followUpDate : currentValues[3], // Column Y: Follow-up Date
                data.counselorComments !== undefined ? data.counselorComments : currentValues[4], // Column Z: Counselor Comments
                timestamp,                                                           // Column AA: Last Updated
            ],
        ];

        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `${WORKING_SHEET_NAME}!V${actualRow}:AA${actualRow}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values },
        });

        return { success: true };
    } catch (error) {
        console.error(`Error updating counselor actions for ${inquiryId}:`, error);
        throw error; // Re-throw to propagate
    }
}

// Helper to generate the next Inquiry ID (S-1, S-2, etc.)
async function getNextInquiryId(sheets: any): Promise<string> {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SOR_SHEET_NAME}!A:A`, // Check SOR sheet ID column
        });

        const rows = response.data.values || [];
        const lastRow = rows.length;

        // If no data (just header), start at S-1
        if (lastRow <= 1) return 'S-1';

        // Try to parse the last ID
        const lastId = rows[lastRow - 1][0];
        if (lastId && lastId.startsWith('S-')) {
            const num = parseInt(lastId.replace('S-', ''), 10);
            if (!isNaN(num)) {
                return `S-${num + 1}`;
            }
        }

        // Fallback: Use row count as ID
        return `S-${lastRow}`;
    } catch (error) {
        console.error('Error generating ID:', error);
        return `S-${Date.now()}`; // Fallback constant if generation fails
    }
}

// Generic function to create an inquiry in BOTH sheets
export async function createInquiry(data: {
    studentName: string;
    currentClass: string;
    currentSchool?: string;
    board?: string;
    parentName: string;
    occupation?: string;
    phone: string;
    secondaryContact?: string;  // NEW: Column J
    email: string;
    educationGuide?: string;    // NEW: Column L - Who should guide education
    learningMethod?: string;    // NEW: Column M - How children learn
    teacherPreference?: string; // NEW: Column N - Teacher preference
    childImportance?: string;   // NEW: Column O - What's important for child
    schoolEnvironment?: string; // NEW: Column P - School environment preference
    howHeard: string;
    dayScholarHostel?: string;  // NEW: Column R - Day Scholar / Hostel
    priority?: string;          // NEW: Column T - Priority
    address?: string; // Made optional (deprecated, not in Google Form)
    createdBy: string;
    source?: string;  // Optional, defaults to 'Digital' or 'Paper' based on caller logic
    notes?: string;   // Optional initial notes
    status?: string;  // Optional initial status
    counselorName?: string; // Optional counselor assignment
    followUpDate?: string;  // Optional follow-up date
    counselorComments?: string; // Optional counselor comments
}) {
    try {
        const sheets = getGoogleSheetsClient();
        const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

        // Generate ID manually
        const inquiryId = await getNextInquiryId(sheets);

        // Base data (Columns A-U)
        const baseRowData = [
            inquiryId,                      // Column A: Inquiry ID
            timestamp,                      // Column B: Timestamp
            data.studentName,               // Column C: Student Name
            data.currentClass,              // Column D: Current Class
            data.currentSchool || '',       // Column E: Current School
            data.board || '',               // Column F: Board
            data.parentName,                // Column G: Parent Name
            data.occupation || '',          // Column H: Occupation
            data.phone,                     // Column I: Primary Contact
            data.secondaryContact || '',    // Column J: Secondary Contact
            data.email,                     // Column K: Email Address
            data.educationGuide || '',      // Column L: Who should guide education
            data.learningMethod || '',      // Column M: How children learn
            data.teacherPreference || '',   // Column N: Teacher preference
            data.childImportance || '',     // Column O: What's important for child
            data.schoolEnvironment || '',   // Column P: School environment preference
            data.howHeard,                  // Column Q: How did you hear about us?
            data.dayScholarHostel || '',    // Column R: Day Scholar / Hostel
            timestamp,                      // Column S: Inquiry Date (use same as timestamp)
            data.priority || '',            // Column T: Priority
            data.notes || 'Added via Add Student form',  // Column U: Comments / Notes
        ];

        // 1. Append to "Inquiries (SOR)" - Base data only (A-U)
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: `${SOR_SHEET_NAME}!A:U`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [baseRowData] },
        });

        // 2. Append to "Inquiries (Working)" - Full data with Counselor fields (A-Z)
        const workingRowData = [
            ...baseRowData,
            // Counselor Columns V-Z
            data.counselorName || '',       // Column V: Counselor Name
            data.status || 'New',           // Column W: Status
            'Active',                       // Column X: Case Status (default)
            data.followUpDate || '',        // Column Y: Follow-up Date
            data.counselorComments || '',   // Column Z: Counselor Comments
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: `${WORKING_SHEET_NAME}!A:Z`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [workingRowData] },
        });

        return { success: true, id: inquiryId };
    } catch (error) {
        console.error('Error creating inquiry:', error);
        throw new Error('Failed to create inquiry in Google Sheets');
    }
}

// TypeScript types
export interface Inquiry {
    id: string;              // Column A: Inquiry ID (S-1, S-2, etc.)
    timestamp: string;       // Column B: Timestamp
    studentName: string;     // Column C: Student Name
    currentClass: string;    // Column D: Current Class
    currentSchool: string;   // Column E: Current School
    board: string;           // Column F: Board
    parentName: string;      // Column G: Parent Name
    occupation: string;      // Column H: Occupation
    phone: string;           // Column I: Primary Contact
    secondaryContact: string; // Column J: Secondary Contact
    email: string;           // Column K: Email
    educationGuide: string;  // Column L: Who should guide education
    learningMethod: string;  // Column M: How children learn
    teacherPreference: string; // Column N: Teacher preference
    childImportance: string; // Column O: What's important for child
    schoolEnvironment: string; // Column P: School environment
    howHeard: string;        // Column Q: How heard about us
    dayScholarHostel: string; // Column R: Day Scholar / Hostel
    inquiryDate: string;     // Column S: Inquiry Date
    priority: string;        // Column T: Priority
    notes: string;           // Column U: Notes

    // Counselor fields (columns V-Z)
    counselorName: string;   // Column V: Counselor Name (who updated)
    status: string;          // Column W: Status (New/Open/Follow-up/Converted/Closed)
    caseStatus: string;      // Column X: Inq Status (Active/Resolved-Completed)
    followUpDate: string;    // Column Y: Follow-up Date
    counselorComments: string; // Column Z: Counselor Comments
    lastUpdated: string;       // Column AA: Last Updated

    // Legacy fields
    source?: string;
    createdBy?: string;
    address?: string;
}
