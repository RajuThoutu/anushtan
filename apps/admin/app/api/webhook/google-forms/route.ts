import { NextResponse } from 'next/server';
import { createInquiry } from '@repo/database';
import { formsWebhookConfig } from '@repo/env-config';

// Define the expected shape of the incoming webhook payload from Google Apps Script
interface GoogleFormPayload {
    studentName: string;
    parentName?: string;
    phone: string;
    email?: string;
    currentClass?: string;
    currentSchool?: string;
    source?: string;
    notes?: string;
}

export async function POST(request: Request) {
    try {
        // 1. Verify Webhook Secret
        const authHeader = request.headers.get('authorization');
        const configuredSecret = formsWebhookConfig.secret;

        if (configuredSecret && authHeader !== `Bearer ${configuredSecret}`) {
            console.warn('[Google Forms Webhook] Rejecting unauthorized request.');
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // 2. Parse Payload
        const payload: GoogleFormPayload = await request.json();

        if (!payload || !payload.studentName || !payload.phone) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields (studentName, phone)' },
                { status: 400 }
            );
        }

        // 3. Format phone number (ensure E.164 if possible, stripping non-digits)
        let formattedPhone = payload.phone.replace(/\D/g, '');
        if (formattedPhone.length === 10) {
            formattedPhone = '+91' + formattedPhone; // Assume India if 10 digits
        } else if (!formattedPhone.startsWith('+') && formattedPhone.length > 10) {
            formattedPhone = '+' + formattedPhone;
        } else if (payload.phone.startsWith('+')) {
            formattedPhone = payload.phone; // Keep original if it already has a plus
        }


        // 4. Save to Database (this automatically triggers the sync to the working Google Sheet)
        const result = await createInquiry({
            studentName: payload.studentName,
            parentName: payload.parentName || 'Google Form Applicant',
            phone: formattedPhone,
            email: payload.email || '',
            currentClass: payload.currentClass || '',
            currentSchool: payload.currentSchool || '',
            source: (payload.source as any) || 'GoogleForm',
            notes: payload.notes || 'Submitted via External Google Form',
            createdBy: 'System (Google Form)', // Appears in activity log
        });

        console.log(`[Google Forms Webhook] Successfully created inquiry ${result.id}`);

        // 5. Respond
        return NextResponse.json({
            success: true,
            message: 'Inquiry successfully saved to production database.',
            inquiryId: result.id,
        });

    } catch (error) {
        console.error('[Google Forms Webhook] Server error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal Server Error',
            },
            { status: 500 }
        );
    }
}
