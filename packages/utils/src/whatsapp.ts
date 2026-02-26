/**
 * @repo/utils — Meta WhatsApp Cloud API helper
 *
 * Reads credentials from process.env (server-side only).
 * The master on/off switch is stored in NeonDB (app_config table, key = "whatsapp_enabled")
 * so it can be toggled at runtime from the admin UI without redeploying.
 * Falls back to process.env.WHATSAPP_ENABLED if no DB row exists yet.
 *
 * Import path: '@repo/utils/src/whatsapp'
 */

import { getAppConfigValue } from '@repo/database';

const WA_API_VERSION = 'v22.0';

function getEnvConfig() {
    return {
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ?? '',
        accessToken:   process.env.WHATSAPP_ACCESS_TOKEN ?? '',
        testRecipient: process.env.WHATSAPP_TEST_RECIPIENT ?? '',
        testMode:      process.env.WHATSAPP_TEST_MODE === 'true',
    };
}

/** Resolves the master on/off switch: DB value takes priority over env var. */
async function isWhatsAppEnabled(): Promise<boolean> {
    const dbValue = await getAppConfigValue('whatsapp_enabled');
    if (dbValue !== null) return dbValue === 'true';
    // No DB row yet — fall back to env var
    return process.env.WHATSAPP_ENABLED === 'true';
}

export interface WASendResult {
    success: boolean;
    messageId?: string;
    skipped?: boolean;   // true when whatsapp_enabled is false
    error?: string;
}

export async function sendTemplateMessage(
    to: string,
    templateName: string,
    languageCode: string,
    components?: object[]
): Promise<WASendResult> {
    const enabled = await isWhatsAppEnabled();
    if (!enabled) {
        console.log('[WhatsApp] Skipped — messaging is disabled');
        return { success: true, skipped: true };
    }

    const cfg = getEnvConfig();

    // Test-mode override: ignore real phone, always use test recipient
    const recipient = cfg.testMode ? cfg.testRecipient : to.replace(/^\+/, '');

    if (!recipient) {
        return { success: false, error: 'No recipient — set WHATSAPP_TEST_RECIPIENT when WHATSAPP_TEST_MODE=true' };
    }

    if (cfg.testMode) {
        console.log(`[WhatsApp] TEST MODE — redirecting to ${cfg.testRecipient} (real: ${to})`);
    }

    const url = `https://graph.facebook.com/${WA_API_VERSION}/${cfg.phoneNumberId}/messages`;

    const template: Record<string, unknown> = {
        name: templateName,
        language: { code: languageCode },
    };
    if (components?.length) template.components = components;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${cfg.accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: recipient,
            type: 'template',
            template,
        }),
    });

    const data = await res.json() as {
        messages?: { id: string }[];
        error?: { message: string; code: number };
    };

    if (!res.ok || data.error) {
        const errMsg = data.error?.message ?? `HTTP ${res.status}`;
        console.error('[WhatsApp] API error:', errMsg, data);
        return { success: false, error: errMsg };
    }

    const messageId = data.messages?.[0]?.id;
    console.log(`[WhatsApp] Sent "${templateName}" → ${recipient} | id: ${messageId}`);
    return { success: true, messageId };
}

/**
 * Send the anushtan_inquiry_ack template.
 * {{1}} = studentName
 *
 * @param to          Recipient phone e.g. "+919966435804" or "919966435804"
 * @param studentName Student's name for personalisation
 */
export async function sendInquiryAck(to: string, _studentName: string): Promise<WASendResult> {
    // TODO: switch to 'anushtan_inquiry_ack' with body param {{1}}=studentName once verified
    return sendTemplateMessage(to, 'hello_world', 'en_US');
}
