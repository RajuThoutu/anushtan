// Force Node.js runtime — Tesseract.js requires Node APIs (fs, child_process, etc.)
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-config';
import { createWorker } from 'tesseract.js';

// ─── Field Extraction Helpers ─────────────────────────────────────────────────

function extract(text: string, patterns: RegExp[]): string {
    for (const p of patterns) {
        const m = text.match(p);
        // Some patterns have 2 capture groups; try both
        if (m?.[2]) return m[2].trim();
        if (m?.[1]) return m[1].trim();
    }
    return '';
}

/**
 * Parse the raw OCR text and return structured inquiry fields.
 * Patterns are intentionally broad to handle messy handwriting transcriptions.
 */
function parseOcrText(raw: string): Record<string, string> {
    const t = raw.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ');

    const studentName = extract(t, [
        /student[\s_\-]*name\s*[:\-]?\s*([A-Za-z .]+)/i,
        /name\s+of\s+(student|child|ward)\s*[:\-]?\s*([A-Za-z .]+)/i,
        /child'?s?\s+name\s*[:\-]?\s*([A-Za-z .]+)/i,
    ]);

    const parentName = extract(t, [
        /(?:father|mother|parent|guardian)'?s?\s*name\s*[:\-]?\s*([A-Za-z .]+)/i,
        /parent[\s_\-]*name\s*[:\-]?\s*([A-Za-z .]+)/i,
    ]);

    // Collect all 10-digit mobile numbers starting with 6-9
    const allPhones = [...t.matchAll(/\b([6-9]\d{9})\b/g)].map(m => m[1]);

    const phone = extract(t, [
        /(?:mobile|phone|contact|cell)[^\d]*(\d{10})/i,
        /(?:ph|mob)[.\s]*[:\-]?\s*(\d{10})/i,
    ]) || allPhones[0] || '';

    const secondaryPhone = (() => {
        // Return the second distinct mobile number
        const primary = phone;
        return allPhones.find(p => p !== primary) ?? '';
    })();

    const email = extract(t, [/([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/]);

    const currentClass = extract(t, [
        /(?:class|grade|std|standard)\s*[:\-]?\s*([A-Za-z0-9 ]+?)(?:\n|,|$)/i,
        /applying\s+for\s*[:\-]?\s*([A-Za-z0-9 ]+?)(?:\n|,|$)/i,
        /admission\s+(?:to|for)\s*[:\-]?\s*([A-Za-z0-9 ]+?)(?:\n|,|$)/i,
    ]);

    const currentSchool = extract(t, [
        /(?:current|previous|present)\s+school\s*[:\-]?\s*(.+?)(?:\n|,)/i,
        /school\s+name\s*[:\-]?\s*(.+?)(?:\n|,)/i,
        /(?:studying|studied)\s+(?:at|in)\s+(.+?)(?:\n|,)/i,
    ]);

    const board = extract(t, [
        /(?:board|curriculum)\s*[:\-]?\s*([A-Za-z ]+?)(?:\n|,|$)/i,
        /\b(CBSE|ICSE|SSC|State|IB|IGCSE|Cambridge)\b/i,
    ]);

    const dob = extract(t, [
        /(?:d\.?o\.?b|date\s+of\s+birth)\s*[:\-]?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
        /born\s+on\s*[:\-]?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
    ]);

    const occupation = extract(t, [
        /(?:occupation|profession|job|work)\s*[:\-]?\s*(.+?)(?:\n|,)/i,
        /(?:father|mother|parent)\s+(?:is\s+a|works?\s+as)\s+(.+?)(?:\n|,)/i,
    ]);

    const howHeard = extract(t, [
        /(?:how\s+(?:did\s+you|you)\s+(?:hear|know)|source|reference)\s*[:\-]?\s*(.+?)(?:\n|,)/i,
        /(?:referred by|reference)\s*[:\-]?\s*(.+?)(?:\n|,)/i,
    ]);

    const dayScholarHostel = extract(t, [
        /(?:day\s+scholar|hostler?|boarding|residential)\s*[:\-]?\s*(.+?)(?:\n|,|$)/i,
        /\b(Day Scholar|Hostel|Boarder)\b/i,
    ]);

    return { studentName, parentName, phone, secondaryPhone, email, currentClass, currentSchool, board, dob, occupation, howHeard, dayScholarHostel };
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
    const worker = await createWorker('eng');
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('formPhoto') as File | null;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
        }

        // Convert File → Buffer for Tesseract
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log(`[OCR] Starting on ${file.name} (${(buffer.byteLength / 1024).toFixed(1)} KB)`);

        const result = await worker.recognize(buffer);
        const rawText = result.data.text;
        const confidence = result.data.confidence;

        console.log(`[OCR] Done — ${rawText.length} chars, confidence: ${confidence.toFixed(0)}%`);

        const fields = parseOcrText(rawText);

        return NextResponse.json({ success: true, fields, rawText, confidence });

    } catch (error) {
        console.error('[OCR] Error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'OCR processing failed' },
            { status: 500 }
        );
    } finally {
        await worker.terminate();
    }
}
