'use server';

import { createInquiry } from '@repo/database';
import type { InquirySource } from '@repo/database';
import { sendInquiryAck } from '@repo/utils/src/whatsapp';
import { sendInquiryBrochureEmail } from '@repo/utils/src/email';

interface QRInquiryData {
    studentName: string;
    parentName: string;
    phone: string;
    email?: string;
    grade: string;
    dayScholarHostel?: string;
}

export async function submitQRInquiry(data: QRInquiryData): Promise<{ success: boolean; error?: string }> {
    try {
        await createInquiry({
            studentName: data.studentName,
            parentName: data.parentName,
            phone: data.phone,
            email: data.email,
            currentClass: data.grade,
            dayScholarHostel: data.dayScholarHostel,
            source: 'QRScan' as InquirySource,
            howHeard: 'QR Code Scan',
            createdBy: 'QR Form',
            status: 'New',
        });

        // Send WhatsApp acknowledgement — fire-and-forget
        sendInquiryAck(data.phone, data.studentName).catch(err =>
            console.error('[QR Inquiry] WhatsApp ack failed:', err)
        );

        // Send brochure email — fire-and-forget, only if email provided
        if (data.email) {
            sendInquiryBrochureEmail(data.email, data.parentName, data.studentName, data.grade).catch(err =>
                console.error('[QR Inquiry] Brochure email failed:', err)
            );
        }

        return { success: true };
    } catch (error) {
        console.error('[QR Inquiry] Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        };
    }
}
