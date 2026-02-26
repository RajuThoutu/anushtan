import { NextResponse } from 'next/server';
import { whatsappConfig } from '@repo/env-config';

/**
 * GET /api/whatsapp/webhook
 *
 * Meta hub verification handshake.
 * Meta sends:  ?hub.mode=subscribe&hub.challenge=XXX&hub.verify_token=YYY
 * We must echo back hub.challenge when hub.verify_token matches.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const mode      = searchParams.get('hub.mode');
    const challenge = searchParams.get('hub.challenge');
    const token     = searchParams.get('hub.verify_token');

    if (mode === 'subscribe' && token === whatsappConfig.webhookVerifyToken) {
        console.log('[WhatsApp Webhook] Verification successful');
        // Return challenge as plain text — Meta requires this exact format
        return new Response(challenge ?? '', { status: 200 });
    }

    console.warn('[WhatsApp Webhook] Verification failed — token mismatch or wrong mode');
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// ─── Inbound message / status types ──────────────────────────────────────────

interface WATextMessage {
    from: string;
    id: string;
    timestamp: string;
    type: 'text';
    text: { body: string };
}

interface WAStatusUpdate {
    id: string;
    status: 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: string;
    recipient_id: string;
}

interface WAWebhookPayload {
    object: string;
    entry: Array<{
        id: string;
        changes: Array<{
            field: string;
            value: {
                messaging_product: string;
                metadata: { display_phone_number: string; phone_number_id: string };
                contacts?: Array<{ profile: { name: string }; wa_id: string }>;
                messages?: WATextMessage[];
                statuses?: WAStatusUpdate[];
            };
        }>;
    }>;
}

/**
 * POST /api/whatsapp/webhook
 *
 * Receives inbound messages and delivery status updates from Meta.
 * Always responds 200 quickly — Meta retries if it doesn't get 200.
 */
export async function POST(request: Request) {
    try {
        const payload = await request.json() as WAWebhookPayload;

        if (payload.object !== 'whatsapp_business_account') {
            return NextResponse.json({ received: true }, { status: 200 });
        }

        for (const entry of payload.entry ?? []) {
            for (const change of entry.changes ?? []) {
                if (change.field !== 'messages') continue;

                const { messages, statuses, contacts } = change.value;

                // ── Inbound messages ──────────────────────────────────────────
                for (const msg of messages ?? []) {
                    const senderName = contacts?.find(c => c.wa_id === msg.from)?.profile.name ?? 'Unknown';

                    if (msg.type === 'text') {
                        console.log(
                            `[WhatsApp Inbound] From: +${msg.from} (${senderName}) | "${msg.text.body}"`
                        );
                        // TODO: hook into inquiry workflow — e.g. match by phone, log reply, update status
                    } else {
                        console.log(`[WhatsApp Inbound] Non-text message (type: ${msg.type}) from +${msg.from}`);
                    }
                }

                // ── Delivery status updates ───────────────────────────────────
                for (const status of statuses ?? []) {
                    console.log(
                        `[WhatsApp Status] Message ${status.id} → ${status.status.toUpperCase()} for +${status.recipient_id}`
                    );
                    // TODO: update message delivery status in DB when inquiry workflow is wired
                }
            }
        }

        // Always return 200 immediately
        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error('[WhatsApp Webhook] Error processing payload:', error);
        // Still return 200 to prevent Meta from retrying a malformed payload
        return NextResponse.json({ received: true }, { status: 200 });
    }
}
