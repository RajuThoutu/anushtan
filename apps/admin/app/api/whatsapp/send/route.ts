import { NextResponse } from 'next/server';
import { sendTextMessage, sendTemplateMessage, sendTestMessage } from '@/lib/whatsapp';

/**
 * POST /api/whatsapp/send
 *
 * Body (JSON):
 *  { "to": "919966435804", "type": "text", "text": "Hello!" }
 *  { "to": "919966435804", "type": "template", "templateName": "anushtan_inquiry_ack", "languageCode": "en", "components": [...] }
 *  { "type": "test" }   ← sends hello_world to WHATSAPP_TEST_RECIPIENT
 */
export async function POST(request: Request) {
    try {
        const body = await request.json() as {
            type?: string;
            to?: string;
            text?: string;
            templateName?: string;
            languageCode?: string;
            components?: unknown[];
        };

        const { type = 'text', to, text, templateName, languageCode, components } = body;

        // ── Test mode ────────────────────────────────────────────────────────
        if (type === 'test') {
            const result = await sendTestMessage();
            return NextResponse.json(result, { status: result.success ? 200 : 502 });
        }

        // ── Validate recipient ────────────────────────────────────────────────
        if (!to) {
            return NextResponse.json(
                { success: false, error: 'Missing required field: to' },
                { status: 400 }
            );
        }

        // ── Text message ──────────────────────────────────────────────────────
        if (type === 'text') {
            if (!text) {
                return NextResponse.json(
                    { success: false, error: 'Missing required field: text' },
                    { status: 400 }
                );
            }
            const result = await sendTextMessage(to, text);
            return NextResponse.json(result, { status: result.success ? 200 : 502 });
        }

        // ── Template message ──────────────────────────────────────────────────
        if (type === 'template') {
            if (!templateName) {
                return NextResponse.json(
                    { success: false, error: 'Missing required field: templateName' },
                    { status: 400 }
                );
            }
            const result = await sendTemplateMessage(
                to,
                templateName,
                languageCode ?? 'en_US',
                components as Parameters<typeof sendTemplateMessage>[3]
            );
            return NextResponse.json(result, { status: result.success ? 200 : 502 });
        }

        return NextResponse.json(
            { success: false, error: `Unknown type "${type}". Use "text", "template", or "test".` },
            { status: 400 }
        );

    } catch (error) {
        console.error('[WhatsApp /send] Unexpected error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
