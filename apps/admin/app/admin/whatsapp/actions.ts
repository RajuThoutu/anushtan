'use server';

import { getAllInquiries, getAppConfigValue, setAppConfigValue } from '@repo/database';
import { sendInquiryAck, sendTemplateMessage } from '@repo/utils/src/whatsapp';

const WA_API_VERSION = 'v22.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID ?? '';
const ACCESS_TOKEN    = process.env.WHATSAPP_ACCESS_TOKEN ?? '';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WATemplate {
    id: string;
    name: string;
    status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'PAUSED';
    category: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION';
    language: string;
    components: Array<{ type: string; text?: string }>;
}

export interface AudienceCriteria {
    statuses?: string[];       // e.g. ['New', 'Contacted']
    grades?: string[];         // e.g. ['Grade 1', 'Pre-KG']
    sources?: string[];        // e.g. ['QRScan', 'WalkIn']
    preference?: string;       // 'Day Scholar' | 'Hostel' | ''
    daysBack?: number;         // inquiries from last N days (0 = all time)
}

export interface AudiencePreview {
    count: number;
    sample: Array<{ name: string; phone: string; grade: string }>;
}

export interface BlastResult {
    total: number;
    sent: number;
    failed: number;
    errors: string[];
}

// ─── Fetch templates from Meta API ───────────────────────────────────────────

export async function fetchWATemplates(): Promise<{ templates: WATemplate[]; error?: string }> {
    if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
        return { templates: [], error: 'WhatsApp credentials not configured' };
    }

    try {
        // Step 1: get WABA ID from phone number
        const phoneRes = await fetch(
            `https://graph.facebook.com/${WA_API_VERSION}/${PHONE_NUMBER_ID}?fields=whatsapp_business_account`,
            { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }, cache: 'no-store' }
        );
        const phoneData = await phoneRes.json() as {
            whatsapp_business_account?: { id: string };
            error?: { message: string };
        };

        if (phoneData.error || !phoneData.whatsapp_business_account?.id) {
            return { templates: [], error: phoneData.error?.message ?? 'Could not resolve WABA ID' };
        }

        const wabaId = phoneData.whatsapp_business_account.id;

        // Step 2: fetch templates
        const tplRes = await fetch(
            `https://graph.facebook.com/${WA_API_VERSION}/${wabaId}/message_templates?limit=50&fields=id,name,status,category,language,components`,
            { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }, cache: 'no-store' }
        );
        const tplData = await tplRes.json() as {
            data?: WATemplate[];
            error?: { message: string };
        };

        if (tplData.error) {
            return { templates: [], error: tplData.error.message };
        }

        return { templates: tplData.data ?? [] };
    } catch (err) {
        return { templates: [], error: err instanceof Error ? err.message : 'Unknown error' };
    }
}

// ─── Audience preview ─────────────────────────────────────────────────────────

export async function getAudiencePreview(criteria: AudienceCriteria): Promise<AudiencePreview> {
    const all = await getAllInquiries();
    const cutoff = criteria.daysBack && criteria.daysBack > 0
        ? new Date(Date.now() - criteria.daysBack * 86400_000)
        : null;

    const matched = all.filter(inq => {
        if (!inq.phone) return false;

        if (criteria.statuses?.length && !criteria.statuses.includes(inq.status ?? '')) return false;
        if (criteria.grades?.length && !criteria.grades.includes(inq.currentClass ?? '')) return false;
        if (criteria.sources?.length && !criteria.sources.includes(inq.source ?? '')) return false;
        if (criteria.preference && inq.dayScholarHostel !== criteria.preference) return false;
        if (cutoff && new Date(inq.inquiryDate) < cutoff) return false;

        return true;
    });

    return {
        count: matched.length,
        sample: matched.slice(0, 5).map(i => ({
            name: i.studentName,
            phone: i.phone,
            grade: i.currentClass ?? '—',
        })),
    };
}

// ─── Send blast ───────────────────────────────────────────────────────────────

export async function sendBlast(
    templateName: string,
    languageCode: string,
    criteria: AudienceCriteria,
    bodyParams: string[]   // ordered template parameter values, e.g. [studentName]
): Promise<BlastResult> {
    const all = await getAllInquiries();
    const cutoff = criteria.daysBack && criteria.daysBack > 0
        ? new Date(Date.now() - criteria.daysBack * 86400_000)
        : null;

    const targets = all.filter(inq => {
        if (!inq.phone) return false;
        if (criteria.statuses?.length && !criteria.statuses.includes(inq.status ?? '')) return false;
        if (criteria.grades?.length && !criteria.grades.includes(inq.currentClass ?? '')) return false;
        if (criteria.sources?.length && !criteria.sources.includes(inq.source ?? '')) return false;
        if (criteria.preference && inq.dayScholarHostel !== criteria.preference) return false;
        if (cutoff && new Date(inq.inquiryDate) < cutoff) return false;
        return true;
    });

    const result: BlastResult = { total: targets.length, sent: 0, failed: 0, errors: [] };

    // Send one by one — Meta allows burst but we keep it simple for now
    for (const inq of targets) {
        // Interpolate {{1}}, {{2}} etc. from bodyParams; replace {{1}} with studentName if param is '$studentName'
        const resolvedParams = bodyParams.map(p =>
            p === '$studentName' ? inq.studentName : p
        );

        const components = resolvedParams.length > 0 ? [{
            type: 'body' as const,
            parameters: resolvedParams.map(t => ({ type: 'text' as const, text: t })),
        }] : undefined;

        const res = await sendTemplateMessage(inq.phone, templateName, languageCode, components);
        if (res.success && !res.skipped) {
            result.sent++;
        } else if (!res.skipped) {
            result.failed++;
            if (res.error) result.errors.push(`${inq.phone}: ${res.error}`);
        }
    }

    return result;
}

// ─── Toggle WhatsApp on/off ───────────────────────────────────────────────────

export async function toggleWhatsAppEnabled(enabled: boolean): Promise<void> {
    await setAppConfigValue('whatsapp_enabled', enabled ? 'true' : 'false');
}

// ─── Connection status ────────────────────────────────────────────────────────

export async function getConnectionStatus(): Promise<{
    connected: boolean;
    phoneNumber?: string;
    wabaName?: string;
    enabled: boolean;
    testMode: boolean;
}> {
    // DB value takes priority over env var (runtime-mutable)
    const dbEnabled = await getAppConfigValue('whatsapp_enabled');
    const enabled   = dbEnabled !== null ? dbEnabled === 'true' : process.env.WHATSAPP_ENABLED === 'true';
    const testMode  = process.env.WHATSAPP_TEST_MODE === 'true';

    if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
        return { connected: false, enabled, testMode };
    }

    try {
        const res = await fetch(
            `https://graph.facebook.com/${WA_API_VERSION}/${PHONE_NUMBER_ID}?fields=display_phone_number,whatsapp_business_account`,
            { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }, cache: 'no-store' }
        );
        const data = await res.json() as {
            display_phone_number?: string;
            whatsapp_business_account?: { name: string };
            error?: { message: string };
        };

        if (data.error) return { connected: false, enabled, testMode };

        return {
            connected: true,
            phoneNumber: data.display_phone_number,
            wabaName: data.whatsapp_business_account?.name,
            enabled,
            testMode,
        };
    } catch {
        return { connected: false, enabled, testMode };
    }
}
