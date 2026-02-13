import { NextRequest, NextResponse } from 'next/server';
import { createInquiry } from '@repo/database';
import {
    QUESTIONS,
    GREETING_MESSAGE,
    FORM_INTRO_MESSAGE,
    COMPLETION_MESSAGE,
    COUNSELOR_MESSAGE,
    WEBSITE_MESSAGE,
    resolveAnswer,
} from '../questionnaire';

// ─── Conversation State ──────────────────────────────────────────

type ConversationPhase = 'greeting' | 'form';

interface ConversationState {
    phase: ConversationPhase;
    step: number;                      // Current question index (only used in 'form' phase)
    answers: Record<string, string>;
    startedAt: number;
}

/**
 * In-memory conversation store.
 * Key = WhatsApp number (e.g., "whatsapp:+919876543210")
 *
 * Note: Resets on server restart. For production, use Redis or DB.
 */
const conversations = new Map<string, ConversationState>();
const CONVERSATION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function cleanExpired() {
    const now = Date.now();
    for (const [key, state] of conversations.entries()) {
        if (now - state.startedAt > CONVERSATION_TTL_MS) {
            conversations.delete(key);
        }
    }
}

// ─── TwiML Helpers ───────────────────────────────────────────────

function twiml(message: string): NextResponse {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${escapeXml(message)}</Message>
</Response>`;
    return new NextResponse(xml, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
    });
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// ─── Build Question Message ──────────────────────────────────────

function buildQuestionMessage(questionIndex: number): string {
    const q = QUESTIONS[questionIndex];
    const progress = `📊 Question ${questionIndex + 1} of ${QUESTIONS.length}`;
    const parts: string[] = [];

    // Add section header if this question starts a new section
    if (q.section) {
        parts.push(q.section);
        parts.push(''); // blank line
    }

    parts.push(progress);
    parts.push(q.text);

    return parts.join('\n');
}

// ─── POST Handler ────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        cleanExpired();

        const formData = await request.formData();
        const from = formData.get('From') as string;
        const body = (formData.get('Body') as string || '').trim();

        if (!from) {
            return twiml('Error: Could not identify sender.');
        }

        const phoneNumber = from.replace('whatsapp:', '');
        const lowerBody = body.toLowerCase();

        // ── Global reset commands ──
        if (['hi', 'hello', 'menu', 'start', 'reset', 'restart'].includes(lowerBody)) {
            conversations.delete(from);
            const state: ConversationState = {
                phase: 'greeting',
                step: 0,
                answers: {},
                startedAt: Date.now(),
            };
            conversations.set(from, state);
            return twiml(GREETING_MESSAGE);
        }

        // ── Get or create conversation ──
        let state = conversations.get(from);

        if (!state) {
            state = {
                phase: 'greeting',
                step: 0,
                answers: {},
                startedAt: Date.now(),
            };
            conversations.set(from, state);
            return twiml(GREETING_MESSAGE);
        }

        // ── PHASE: Greeting (Menu Selection) ──
        if (state.phase === 'greeting') {
            if (body === '1') {
                // Start inquiry form
                state.phase = 'form';
                state.step = 0;
                state.answers = {};
                const intro = FORM_INTRO_MESSAGE + '\n\n' + buildQuestionMessage(0);
                return twiml(intro);
            } else if (body === '2') {
                return twiml(COUNSELOR_MESSAGE);
            } else if (body === '3') {
                return twiml(WEBSITE_MESSAGE);
            } else {
                return twiml('Please reply with *1*, *2*, or *3* to select an option.\n\n' + GREETING_MESSAGE);
            }
        }

        // ── PHASE: Form (Question Flow) ──
        if (state.phase === 'form') {
            const currentQ = QUESTIONS[state.step];
            const resolved = resolveAnswer(currentQ.id, body);

            // Validate required fields
            if (currentQ.required && !resolved) {
                return twiml(
                    `⚠️ This field is required. Please provide your answer.\n\n${currentQ.text}`
                );
            }

            // Store answer
            state.answers[currentQ.id] = resolved;
            state.step += 1;

            // ── All questions answered → Save ──
            if (state.step >= QUESTIONS.length) {
                try {
                    const a = state.answers;
                    await createInquiry({
                        studentName: a.studentName || '',
                        currentClass: a.currentClass || '',
                        currentSchool: a.currentSchool || '',
                        board: a.board || '',
                        parentName: a.parentName || 'Not Provided',
                        occupation: a.occupation || '',
                        phone: phoneNumber,
                        email: a.email || '',
                        educationGuide: a.q1_education_guide || '',
                        learningMethod: a.q2_learning_approach || '',
                        teacherPreference: a.q3_teacher_preference || '',
                        childImportance: a.q4_child_priority || '',
                        schoolEnvironment: a.q5_school_environment || '',
                        dayScholarHostel: a.dayScholarHostel || '',
                        howHeard: 'WhatsApp',
                        createdBy: 'WhatsApp Bot',
                        source: 'WhatsApp',
                        status: 'New',
                        notes: 'Submitted via WhatsApp Chatbot',
                    });

                    conversations.delete(from);
                    return twiml(COMPLETION_MESSAGE);
                } catch (error) {
                    console.error('Error saving WhatsApp inquiry:', error);
                    conversations.delete(from);
                    return twiml(
                        '❌ Sorry, there was an error saving your inquiry. Please type *hi* to try again.'
                    );
                }
            }

            // ── Send next question ──
            return twiml(buildQuestionMessage(state.step));
        }

        // Fallback
        return twiml('Something went wrong. Type *hi* to start over.');

    } catch (error) {
        console.error('WhatsApp webhook error:', error);
        return twiml('❌ An unexpected error occurred. Please try again later.');
    }
}

// ─── GET Handler (Health Check) ──────────────────────────────────

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Anushtan WhatsApp Webhook is active',
        activeConversations: conversations.size,
    });
}
