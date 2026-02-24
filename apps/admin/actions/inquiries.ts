'use server';

/**
 * apps/admin/actions/inquiries.ts
 *
 * Server Action: Submit a new inquiry
 * ─────────────────────────────────
 * 1. Validate input
 * 2. INSERT into PostgreSQL (Prisma) — source of truth
 * 3. Non-blocking: POST to N8N_WEBHOOK_URL for downstream sync
 * 4. If n8n responds 200 OK → flip isSyncedToSheet = true in Postgres
 * 5. Return success to the user regardless of n8n outcome
 */

import { prisma } from '@repo/database';
import { env, n8nConfig } from '@repo/env-config';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface InquiryInput {
    tenantId?: string;          // defaults to 'anushtan-siddipet'

    // Student
    studentName: string;
    currentClass?: string;
    currentSchool?: string;
    board?: string;

    // Parent / Guardian
    parentName: string;
    phone: string;
    secondaryPhone?: string;
    email?: string;
    occupation?: string;

    // Admission Survey
    educationGuide?: string;
    learningMethod?: string;
    teacherPreference?: string;
    childImportance?: string;
    schoolEnvironment?: string;
    dayScholarHostel?: string;

    // Routing & Workflow
    source?: 'Website' | 'WhatsApp' | 'PaperForm' | 'PhoneCall' | 'Referral' | 'Other';
    howHeard?: string;
    createdBy?: string;
    notes?: string;
    priority?: string;
    assignedTo?: string;
}

export interface ActionResult {
    success: boolean;
    inquiryId?: string;
    error?: string;
}

// ─── Helper: generate next sequential S-N ID ─────────────────────────────────

async function getNextInquiryId(): Promise<string> {
    const result = await prisma.$queryRaw<{ max_num: number | null }[]>`
        SELECT MAX(CAST(REPLACE(inquiry_id, 'S-', '') AS INTEGER)) AS max_num
        FROM inquiries
        WHERE inquiry_id ~ '^S-[0-9]+$'
    `;
    const maxNum = result[0]?.max_num ?? 0;
    return `S-${maxNum + 1}`;
}

// ─── Non-blocking n8n Sync ────────────────────────────────────────────────────

/**
 * Fires a POST to the n8n webhook and updates isSyncedToSheet in Postgres.
 * Called with void — never awaited from the main action path.
 */
async function triggerN8nSync(
    inquiryId: string,
    payload: Record<string, unknown>
): Promise<void> {
    const webhookUrl = n8nConfig.webhookUrl;

    if (!webhookUrl) {
        console.log(`[n8n] N8N_WEBHOOK_URL not set — skipping sync for ${inquiryId}`);
        return;
    }

    try {
        console.log(`[n8n] Triggering sync for ${inquiryId} → ${webhookUrl}`);

        const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            // ✅ n8n confirmed receipt — mark inquiry as synced to Sheet
            await prisma.inquiry.update({
                where: { inquiryId },
                data: { isSyncedToSheet: true },
            });
            console.log(`[n8n] ✅ Sync confirmed for ${inquiryId} — isSyncedToSheet set to true`);
        } else {
            // ⚠️ n8n returned non-200 — leave isSyncedToSheet = false for retry
            console.error(
                `[n8n] ⚠️ Sync failed for ${inquiryId}: HTTP ${res.status} ${res.statusText}`
            );
        }
    } catch (err) {
        // Network error — postgres is already written, no rollback needed
        console.error(
            `[n8n] ❌ Failed to reach webhook for ${inquiryId}:`,
            err instanceof Error ? err.message : String(err)
        );
        // isSyncedToSheet stays false — a retry job can pick these up later
    }
}

// ─── Server Action ────────────────────────────────────────────────────────────

/**
 * submitInquiry — Next.js Server Action
 *
 * Saves an inquiry to PostgreSQL, then triggers a non-blocking n8n webhook
 * for Google Sheets mirroring. Always returns success to the user as long as
 * the database write succeeds.
 */
export async function submitInquiry(data: InquiryInput): Promise<ActionResult> {
    // ── 1. Basic validation ──────────────────────────────────────────────────
    if (!data.studentName?.trim()) {
        return { success: false, error: 'Student name is required' };
    }
    if (!data.parentName?.trim()) {
        return { success: false, error: 'Parent name is required' };
    }
    if (!data.phone?.trim()) {
        return { success: false, error: 'Phone number is required' };
    }

    try {
        // ── 2. Generate sequential ID ────────────────────────────────────────
        const inquiryId = await getNextInquiryId();
        const tenantId = data.tenantId ?? 'anushtan-siddipet';

        // ── 3. INSERT into PostgreSQL ────────────────────────────────────────
        const inquiry = await prisma.inquiry.create({
            data: {
                inquiryId,
                tenantId,
                studentName: data.studentName.trim(),
                currentClass: data.currentClass?.trim(),
                currentSchool: data.currentSchool?.trim(),
                board: data.board?.trim(),
                parentName: data.parentName.trim(),
                phone: data.phone.trim(),
                secondaryPhone: data.secondaryPhone?.trim(),
                email: data.email?.trim(),
                occupation: data.occupation?.trim(),
                educationGuide: data.educationGuide?.trim(),
                learningMethod: data.learningMethod?.trim(),
                teacherPreference: data.teacherPreference?.trim(),
                childImportance: data.childImportance?.trim(),
                schoolEnvironment: data.schoolEnvironment?.trim(),
                dayScholarHostel: data.dayScholarHostel?.trim(),
                source: data.source ?? 'Website',
                howHeard: data.howHeard?.trim(),
                createdBy: data.createdBy?.trim() ?? 'Admin Portal',
                notes: data.notes?.trim(),
                priority: data.priority?.trim(),
                assignedTo: data.assignedTo?.trim(),
                status: 'New',
                isSyncedToSheet: false, // will flip to true after n8n confirms
            },
        });

        // ── 4. Log creation in activity log ─────────────────────────────────
        await prisma.counselorActivityLog.create({
            data: {
                inquiryId,
                counselorName: data.createdBy ?? 'Admin Portal',
                action: 'created',
                newValue: 'New',
                comments: data.notes ?? null,
            },
        });

        // ── 5. Google Sheets / n8n sync (feature-flagged, fire-and-forget) ───
        // ENABLE_GOOGLE_SHEETS_SYNC=false (default) → skip entirely.
        // ENABLE_GOOGLE_SHEETS_SYNC=true            → async, never blocks response.
        if (env.ENABLE_GOOGLE_SHEETS_SYNC) {
            void triggerN8nSync(inquiryId, {
                inquiry_id: inquiryId,
                tenant_id: tenantId,
                student_name: inquiry.studentName,
                current_class: inquiry.currentClass,
                current_school: inquiry.currentSchool,
                board: inquiry.board,
                parent_name: inquiry.parentName,
                phone: inquiry.phone,
                secondary_phone: (inquiry as Record<string, unknown>).secondaryPhone,
                email: inquiry.email,
                occupation: inquiry.occupation,
                education_guide: inquiry.educationGuide,
                learning_method: inquiry.learningMethod,
                teacher_preference: inquiry.teacherPreference,
                child_importance: inquiry.childImportance,
                school_environment: inquiry.schoolEnvironment,
                day_scholar_hostel: inquiry.dayScholarHostel,
                source: inquiry.source,
                how_heard: inquiry.howHeard,
                created_by: inquiry.createdBy,
                notes: inquiry.notes,
                priority: inquiry.priority,
                status: inquiry.status,
                assigned_to: (inquiry as Record<string, unknown>).assignedTo,
                inquiry_date: inquiry.inquiryDate.toISOString(),
                created_at: inquiry.createdAt.toISOString(),
            });
        }

        // ── 6. Return success ────────────────────────────────────────────────
        // Postgres is the source of truth — n8n failure does NOT affect user response.
        return { success: true, inquiryId };

    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('[submitInquiry] DB write failed:', err);
        return { success: false, error: message };
    }
}

// ─── Additional Actions ───────────────────────────────────────────────────────

/**
 * Retry syncing inquiries that failed to reach n8n.
 * Useful for a cron job or manual admin retry button.
 */
export async function retryFailedSyncs(): Promise<{
    attempted: number;
    succeeded: number;
}> {
    const unsynced = await prisma.inquiry.findMany({
        where: { isSyncedToSheet: false },
        orderBy: { createdAt: 'asc' },
        take: 50, // batch cap
    });

    let succeeded = 0;

    for (const inquiry of unsynced) {
        try {
            await triggerN8nSync(inquiry.inquiryId, {
                inquiry_id: inquiry.inquiryId,
                tenant_id: inquiry.tenantId,
                student_name: inquiry.studentName,
                parent_name: inquiry.parentName,
                phone: inquiry.phone,
                email: inquiry.email,
                status: inquiry.status,
                source: inquiry.source,
                created_at: inquiry.createdAt.toISOString(),
                retry: true,
            });
            succeeded++;
        } catch {
            // Individual failure — continue with rest
        }
    }

    console.log(`[retryFailedSyncs] Attempted: ${unsynced.length}, Succeeded: ${succeeded}`);
    return { attempted: unsynced.length, succeeded };
}
