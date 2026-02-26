/**
 * Meta WhatsApp Cloud API — service module
 *
 * Provides helpers for:
 *  - sendTextMessage        — free-form text (within 24h window)
 *  - sendTemplateMessage    — approved HSM templates (any time)
 *  - sendInquiryAck         — convenience wrapper for anushtan_inquiry_ack template
 */

import { whatsappConfig } from '@repo/env-config';

const WA_API_VERSION = 'v22.0';
const WA_BASE_URL = `https://graph.facebook.com/${WA_API_VERSION}`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WASendResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

interface TemplateComponent {
    type: 'header' | 'body' | 'button';
    parameters: Array<
        | { type: 'text'; text: string }
        | { type: 'image'; image: { link: string } }
        | { type: 'document'; document: { link: string; filename: string } }
    >;
    sub_type?: string; // for button components
    index?: number;    // for button components
}

// ─── Core fetch helper ────────────────────────────────────────────────────────

async function callWhatsAppAPI(payload: object): Promise<WASendResult> {
    const { phoneNumberId, accessToken } = whatsappConfig;

    if (!phoneNumberId || !accessToken) {
        return {
            success: false,
            error: 'WhatsApp not configured — WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN is missing',
        };
    }

    const url = `${WA_BASE_URL}/${phoneNumberId}/messages`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messaging_product: 'whatsapp',
            ...payload,
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
    console.log(`[WhatsApp] Message sent — id: ${messageId}`);
    return { success: true, messageId };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Send a plain text message.
 * Only works within the 24-hour customer service window.
 *
 * @param to  Recipient phone in E.164 without '+', e.g. "919966435804"
 * @param text  Message body
 */
export async function sendTextMessage(to: string, text: string): Promise<WASendResult> {
    const recipient = to.replace(/^\+/, ''); // Meta expects no leading +
    return callWhatsAppAPI({
        to: recipient,
        type: 'text',
        text: { body: text },
    });
}

/**
 * Send an approved HSM template message.
 *
 * @param to          Recipient phone in E.164 or without '+', e.g. "919966435804"
 * @param templateName  Name of the approved template
 * @param languageCode  e.g. "en_US", "en", "hi"
 * @param components    Optional template parameter components
 */
export async function sendTemplateMessage(
    to: string,
    templateName: string,
    languageCode = 'en_US',
    components?: TemplateComponent[]
): Promise<WASendResult> {
    const recipient = to.replace(/^\+/, '');

    const template: Record<string, unknown> = {
        name: templateName,
        language: { code: languageCode },
    };
    if (components?.length) {
        template.components = components;
    }

    return callWhatsAppAPI({
        to: recipient,
        type: 'template',
        template,
    });
}

/**
 * Send the "anushtan_inquiry_ack" acknowledgement template.
 *
 * Update `components` below once you confirm the approved template's
 * parameter placeholders from the Meta Business Manager.
 *
 * @param to           Recipient phone e.g. "919966435804"
 * @param studentName  Student's name to personalise the message
 */
export async function sendInquiryAck(to: string, studentName: string): Promise<WASendResult> {
    return sendTemplateMessage(
        to,
        'anushtan_inquiry_ack',
        'en',
        [
            {
                type: 'body',
                parameters: [
                    { type: 'text', text: studentName },
                ],
            },
        ]
    );
}

/**
 * Send a template message to the configured test recipient.
 * Useful for smoke-testing the integration without touching real inquiry data.
 */
export async function sendTestMessage(): Promise<WASendResult> {
    const { testRecipient } = whatsappConfig;
    if (!testRecipient) {
        return { success: false, error: 'WHATSAPP_TEST_RECIPIENT is not set in env' };
    }
    return sendTemplateMessage(testRecipient, 'hello_world', 'en_US');
}
