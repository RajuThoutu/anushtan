import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-config';
import { createInquiry } from '@repo/database';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await request.formData();

        // Photo is processed in-memory (OCR) and not persisted — by design.
        // The counselor reviewed & corrected all fields before submitting.

        const inquiryData = {
            studentName: (formData.get('studentName') as string) || '',
            currentClass: (formData.get('currentClass') as string) || '',
            currentSchool: (formData.get('currentSchool') as string) || '',
            board: (formData.get('board') as string) || '',
            parentName: (formData.get('parentName') as string) || 'Paper Form',
            phone: (formData.get('phone') as string) || '0000000000',
            secondaryPhone: (formData.get('secondaryPhone') as string) || '',
            email: (formData.get('email') as string) || '',
            occupation: (formData.get('occupation') as string) || '',
            howHeard: (formData.get('howHeard') as string) || 'Paper Form',
            dayScholarHostel: (formData.get('dayScholarHostel') as string) || '',
            assignedTo: (formData.get('counselorName') as string) || session.user?.name || '',
            status: (formData.get('status') as string) || 'New',
            followUpDate: (formData.get('followUpDate') as string) || '',
            notes: (formData.get('counselorComments') as string) || 'Added via paper form upload',
            source: 'PaperForm' as const,
            createdBy: session.user?.name ?? 'Admin Portal',
            counselorName: (formData.get('counselorName') as string) || session.user?.name || '',
            counselorComments: (formData.get('counselorComments') as string) || '',
        };

        await createInquiry(inquiryData);

        return NextResponse.json({
            success: true,
            message: 'Paper form inquiry added successfully',
        });

    } catch (error) {
        console.error('[upload-paper-form] Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to save inquiry',
            },
            { status: 500 }
        );
    }
}
