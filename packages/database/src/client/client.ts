/**
 * Anushtan — PostgreSQL-first Database Client
 *
 * All reads and writes go to PostgreSQL (source of truth).
 * Google Sheets is updated directly by the app (using googleapis) as a
 * downstream reporting mirror — async, fire-and-forget.
 *
 * Sync is gated by SHEETS_SYNC_ENABLED=true. Set to false in dev to
 * avoid touching the live Google Sheet.
 */

import { google, sheets_v4 } from 'googleapis';
import { prisma } from '../index';
import { InquiryStatus, CaseStatus, InquirySource, Prisma } from '@prisma/client';
import { env, sheetsConfig } from '@repo/env-config';

// ─── Re-export Prisma types for consumers ────────────────────────────────────
export type { InquiryStatus, CaseStatus, InquirySource };
export type SheetInquiry = Awaited<ReturnType<typeof getAllInquiries>>[number];

// ─── Configuration (from @repo/env-config — validated at startup) ────────────

// Gate: reads ENABLE_GOOGLE_SHEETS_SYNC from env (false in dev, true in prod)
const SHEETS_SYNC_ENABLED = sheetsConfig.enableGoogleSheetsSync;
const SHEET_ID = sheetsConfig.sheetId;
const SOR_SHEET_NAME = 'Inquiries (SOR)';       // Source of Record — immutable history
const WORKING_SHEET_NAME = 'Inquiries (Working)'; // Working copy — counselors view here

// ─── Google Sheets Client ────────────────────────────────────────────────────

function getGoogleSheetsClient(): sheets_v4.Sheets {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: sheetsConfig.clientEmail,
            private_key: sheetsConfig.privateKey.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
}

// ─── Sheets Sync Helpers (async, fire-and-forget) ────────────────────────────

/**
 * APPEND a new inquiry row to BOTH Sheets tabs (SOR + Working).
 * Called after successful PostgreSQL insert.
 * Never throws — failures are logged to `sheets_sync_log`.
 */
async function syncInsertToSheets(inquiryId: string, data: Record<string, string>): Promise<void> {
    if (!SHEETS_SYNC_ENABLED) {
        console.log(`[Sheets] Sync disabled (dev mode). Skipping insert for ${inquiryId}`);
        return;
    }

    try {
        const sheets = getGoogleSheetsClient();
        const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

        // Base data: Columns A–U
        const baseRow = [
            data.inquiryId,                    // A: Inquiry ID
            timestamp,                         // B: Timestamp
            data.studentName,                  // C: Student Name
            data.currentClass || '',           // D: Current Class
            data.currentSchool || '',          // E: Current School
            data.board || '',                  // F: Board
            data.parentName,                   // G: Parent Name
            data.occupation || '',             // H: Occupation
            data.phone,                        // I: Primary Contact
            data.secondaryPhone || '',         // J: Secondary Contact
            data.email || '',                  // K: Email Address
            data.educationGuide || '',         // L: Who should guide education
            data.learningMethod || '',         // M: How children learn
            data.teacherPreference || '',      // N: Teacher preference
            data.childImportance || '',        // O: What's important for child
            data.schoolEnvironment || '',      // P: School environment
            data.howHeard || '',               // Q: How heard about us
            data.dayScholarHostel || '',        // R: Day Scholar / Hostel
            timestamp,                         // S: Inquiry Date
            data.priority || '',               // T: Priority
            data.notes || '',                  // U: Notes
        ];

        // 1. Append to SOR (Columns A–U only)
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: `${SOR_SHEET_NAME}!A:U`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [baseRow] },
        });

        // 2. Append to Working (Columns A–AA with counselor fields)
        const workingRow = [
            ...baseRow,
            data.counselorName || '',          // V: Counselor Name
            data.status || 'New',              // W: Status
            'Active',                          // X: Case Status
            data.followUpDate || '',           // Y: Follow-up Date
            data.counselorComments || '',      // Z: Counselor Comments
            timestamp,                         // AA: Last Updated
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: `${WORKING_SHEET_NAME}!A:AA`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [workingRow] },
        });

        // Log success
        await prisma.sheetsSyncLog.create({
            data: { inquiryId, operation: 'insert', status: 'success' },
        });
        console.log(`[Sheets] Inserted ${inquiryId} into SOR + Working`);

    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[Sheets] Insert sync error for ${inquiryId}:`, msg);
        try {
            await prisma.sheetsSyncLog.create({
                data: { inquiryId, operation: 'insert', status: 'failed', errorMessage: msg },
            });
        } catch (_) { /* swallow DB logging failure */ }
    }
}

/**
 * UPDATE an existing inquiry row in the Working sheet (Columns V–AA: counselor fields).
 * Called after successful PostgreSQL update.
 * Never throws — failures are logged to `sheets_sync_log`.
 */
async function syncUpdateToSheets(
    inquiryId: string,
    data: {
        counselorName: string;
        status: string;
        caseStatus: string;
        followUpDate?: string;
        counselorComments?: string;
    }
): Promise<void> {
    if (!SHEETS_SYNC_ENABLED) {
        console.log(`[Sheets] Sync disabled (dev mode). Skipping update for ${inquiryId}`);
        return;
    }

    try {
        const sheets = getGoogleSheetsClient();

        // Find the row in Working sheet by inquiry ID (Column A)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${WORKING_SHEET_NAME}!A2:A`,
        });

        const ids = response.data.values || [];
        const rowIndex = ids.findIndex(row => row[0] === inquiryId);

        if (rowIndex === -1) {
            console.warn(`[Sheets] ID '${inquiryId}' not found in Working sheet — skipping update`);
            return;
        }

        const actualRow = rowIndex + 2; // +1 for 0-index, +1 for header

        // Get current comments to append (preserve history)
        const currentResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${WORKING_SHEET_NAME}!Z${actualRow}`,
        });

        let finalComments = currentResponse.data.values?.[0]?.[0] || '';
        if (data.counselorComments?.trim()) {
            const ts = new Date().toLocaleString('en-US', {
                month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true,
            });
            const entry = `[${ts}] ${data.counselorName}:\n${data.counselorComments.trim()}`;
            finalComments = finalComments ? `${finalComments}\n\n${entry}` : entry;
        }

        const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

        // Update Columns V–AA
        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `${WORKING_SHEET_NAME}!V${actualRow}:AA${actualRow}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    data.counselorName,             // V: Counselor Name
                    data.status,                    // W: Status
                    data.caseStatus,                // X: Case Status
                    data.followUpDate || '',        // Y: Follow-up Date
                    finalComments,                  // Z: Counselor Comments (history)
                    timestamp,                      // AA: Last Updated
                ]],
            },
        });

        await prisma.sheetsSyncLog.create({
            data: { inquiryId, operation: 'update', status: 'success', sheetRow: actualRow },
        });
        console.log(`[Sheets] Updated ${inquiryId} at row ${actualRow}`);

    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[Sheets] Update sync error for ${inquiryId}:`, msg);
        try {
            await prisma.sheetsSyncLog.create({
                data: { inquiryId, operation: 'update', status: 'failed', errorMessage: msg },
            });
        } catch (_) { /* swallow */ }
    }
}

// ─── ID Generation ────────────────────────────────────────────────────────────

/**
 * Generates the next sequential inquiry ID (S-1, S-2, …).
 * Reads the current maximum from PostgreSQL.
 */
async function getNextInquiryId(): Promise<string> {
    const result = await prisma.$queryRaw<{ max_num: number | null }[]>`
        SELECT MAX(CAST(REPLACE(inquiry_id, 'S-', '') AS INTEGER)) AS max_num
        FROM inquiries
        WHERE inquiry_id ~ '^S-[0-9]+$'
    `;

    const maxNum = result[0]?.max_num ?? 0;
    return `S-${maxNum + 1}`;
}

// ─── Reads (PostgreSQL) ──────────────────────────────────────────────────────

/** Fetch all inquiries from PostgreSQL, newest first. */
export async function getAllInquiries() {
    return prisma.inquiry.findMany({
        orderBy: { inquiryDate: 'desc' },
        include: {
            activityLog: {
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: {
                    counselorName: true,
                    action: true,
                    oldValue: true,
                    newValue: true,
                    comments: true,
                    createdAt: true,
                },
            },
        },
    });
}


/** Fetch a single inquiry by its human-readable ID (e.g. "S-42"). */
export async function getInquiryById(inquiryId: string) {
    const inquiry = await prisma.inquiry.findUnique({
        where: { inquiryId },
        include: {
            activityLog: {
                orderBy: { createdAt: 'desc' },
                select: {
                    counselorName: true,
                    action: true,
                    oldValue: true,
                    newValue: true,
                    comments: true,
                    createdAt: true,
                },
            },
            student: true,
        },
    });

    if (!inquiry) throw new Error(`Inquiry '${inquiryId}' not found`);
    return inquiry;
}


// ─── Writes (PostgreSQL → then Sheets sync) ─────────────────────────────────

/**
 * Create a new inquiry.
 * 1. INSERT into PostgreSQL (source of truth)
 * 2. INSERT activity log row
 * 3. APPEND to Google Sheets (async, fire-and-forget)
 */
export async function createInquiry(data: {
    studentName: string;
    currentClass?: string;
    currentSchool?: string;
    board?: string;
    parentName: string;
    phone: string;
    secondaryPhone?: string;
    email?: string;
    occupation?: string;
    educationGuide?: string;
    learningMethod?: string;
    teacherPreference?: string;
    childImportance?: string;
    schoolEnvironment?: string;
    dayScholarHostel?: string;
    source?: InquirySource;
    howHeard?: string;
    createdBy?: string;
    status?: InquiryStatus;
    assignedTo?: string;
    followUpDate?: string;
    priority?: string;
    notes?: string;
    counselorName?: string;
    counselorComments?: string;
}) {
    const inquiryId = await getNextInquiryId();

    // 1. PostgreSQL INSERT
    await prisma.inquiry.create({
        data: {
            inquiryId,
            studentName: data.studentName,
            currentClass: data.currentClass,
            currentSchool: data.currentSchool,
            board: data.board,
            parentName: data.parentName,
            phone: data.phone,
            secondaryPhone: data.secondaryPhone,
            email: data.email,
            occupation: data.occupation,
            educationGuide: data.educationGuide,
            learningMethod: data.learningMethod,
            teacherPreference: data.teacherPreference,
            childImportance: data.childImportance,
            schoolEnvironment: data.schoolEnvironment,
            dayScholarHostel: data.dayScholarHostel,
            source: data.source ?? 'Website',
            howHeard: data.howHeard,
            createdBy: data.createdBy,
            status: data.status ?? 'New',
            assignedTo: data.assignedTo,
            followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
            priority: data.priority,
            notes: data.notes,
        },
    });

    // 2. Activity log
    await prisma.counselorActivityLog.create({
        data: {
            inquiryId,
            counselorName: data.createdBy ?? 'System',
            action: 'created',
            newValue: data.status ?? 'New',
            comments: data.counselorComments ?? data.notes ?? null,
        },
    });

    // 3. Create notification for counselor bell (fire-and-forget)
    prisma.notification.create({
        data: {
            inquiryId,
            message: `New inquiry from ${data.studentName} — ${data.source ?? 'Website'} (${data.phone})`,
            type: 'new_inquiry',
        },
    }).catch(err => console.error('[Notifications] Failed to create notification:', err));

    // 4. Async Sheets sync (fire-and-forget — does NOT block the response)
    syncInsertToSheets(inquiryId, {
        inquiryId,
        studentName: data.studentName,
        currentClass: data.currentClass || '',
        currentSchool: data.currentSchool || '',
        board: data.board || '',
        parentName: data.parentName,
        phone: data.phone,
        secondaryPhone: data.secondaryPhone || '',
        email: data.email || '',
        occupation: data.occupation || '',
        educationGuide: data.educationGuide || '',
        learningMethod: data.learningMethod || '',
        teacherPreference: data.teacherPreference || '',
        childImportance: data.childImportance || '',
        schoolEnvironment: data.schoolEnvironment || '',
        howHeard: data.howHeard || '',
        dayScholarHostel: data.dayScholarHostel || '',
        priority: data.priority || '',
        notes: data.notes || '',
        status: data.status ?? 'New',
        counselorName: data.counselorName || '',
        followUpDate: data.followUpDate || '',
        counselorComments: data.counselorComments || '',
    });

    return { success: true, id: inquiryId };
}

/**
 * Update counselor fields on an inquiry.
 * 1. UPDATE PostgreSQL (source of truth)
 * 2. INSERT activity log row
 * 3. UPDATE Google Sheet Working tab counselor columns (async)
 */
export async function updateCounselorActions(
    idOrInquiryId: string,
    data: {
        status?: string;
        assignedTo?: string;
        /** @deprecated Use assignedTo */
        updatedBy?: string;
        followUpDate?: string;
        counselorComments?: string;
        priority?: string;
    }
) {
    console.log(`[DB] updateCounselorActions: ${idOrInquiryId}`, data);

    const counselorName = data.assignedTo ?? data.updatedBy ?? 'Unknown';

    // Flexible fetch to allow UI to pass either the UUID (id) or the sequence (S-XXX)
    const isUuid = idOrInquiryId.length > 20 && !idOrInquiryId.startsWith('S-');
    const current = await prisma.inquiry.findUnique({
        where: isUuid ? { id: idOrInquiryId } : { inquiryId: idOrInquiryId },
        select: { inquiryId: true, status: true, caseStatus: true, followUpDate: true, assignedTo: true },
    });

    if (!current) throw new Error(`Inquiry '${idOrInquiryId}' not found`);

    const trueInquiryId = current.inquiryId;

    // Auto-calculate case status
    let newCaseStatus: CaseStatus = current.caseStatus;
    if (data.status === 'Converted' || data.status === 'Closed') {
        newCaseStatus = 'ResolvedCompleted';
    } else if (data.status) {
        newCaseStatus = 'Active';
    }

    // Build update payload
    const updateData: Prisma.InquiryUpdateInput = {
        caseStatus: newCaseStatus,
        assignedTo: counselorName,
    };
    if (data.status) updateData.status = data.status as InquiryStatus;
    if (data.followUpDate) updateData.followUpDate = new Date(data.followUpDate);
    if (data.priority) updateData.priority = data.priority;

    // 1. PostgreSQL UPDATE
    await prisma.inquiry.update({ where: { inquiryId: trueInquiryId }, data: updateData });

    // 2. Activity log
    await prisma.counselorActivityLog.create({
        data: {
            inquiryId: trueInquiryId,
            counselorName,
            action: data.status ? 'status_change' : data.counselorComments ? 'note_added' : 'assigned',
            oldValue: current.status,
            newValue: data.status ?? current.status,
            comments: data.counselorComments ?? null,
        },
    });

    // 3. Async Sheets sync (fire-and-forget)
    syncUpdateToSheets(trueInquiryId, {
        counselorName,
        status: data.status ?? current.status,
        caseStatus: newCaseStatus,
        followUpDate: data.followUpDate,
        counselorComments: data.counselorComments,
    });

    return { success: true };
}

// ─── Notifications ────────────────────────────────────────────────────────────

/** Return the 20 most recent unread notifications, newest first. */
export async function getUnreadNotifications() {
    return prisma.notification.findMany({
        where: { isRead: false },
        orderBy: { createdAt: 'desc' },
        take: 20,
    });
}

/** Mark a single notification as read. */
export async function markNotificationRead(id: number) {
    return prisma.notification.update({
        where: { id },
        data: { isRead: true },
    });
}
