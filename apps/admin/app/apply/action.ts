'use server';

import { createInquiry, InquirySource } from '@repo/database';
import { sendInquiryAck } from '@repo/utils/src/whatsapp';

interface QRInquiryData {
    studentName: string;
    parentName: string;
    phone: string;
    grade: string;
    dayScholarHostel?: string;
    email?: string;
    board?: string;
    currentSchool?: string;
    howHeard?: string;
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
            board: data.board,
            currentSchool: data.currentSchool,
            source: InquirySource.QRScan,
            howHeard: data.howHeard || 'QR Code Scan',
            createdBy: 'QR Form',
            status: 'New',
        });

        // Send WhatsApp acknowledgement — fire-and-forget, never block the form submission
        sendInquiryAck(data.phone, data.studentName).catch(err =>
            console.error('[QR Inquiry] WhatsApp ack failed:', err)
        );

        return { success: true };
    } catch (error) {
        console.error('[QR Inquiry] Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        };
    }
}
