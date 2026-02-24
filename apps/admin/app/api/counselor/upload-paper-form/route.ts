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

        const inquiryData: any = {
            studentName: formData.get('studentName') as string,
            currentClass: formData.get('currentClass') as string,
            parentName: (formData.get('parentName') as string) || 'Paper Form',
            phone: (formData.get('phone') as string) || '0000000000',
            email: (formData.get('email') as string) || '',
            howHeard: 'Paper Form',
            assignedTo: (formData.get('counselorName') as string) || session.user?.name || '',
            status: (formData.get('status') as string) || 'New',
            followUpDate: (formData.get('followUpDate') as string) || '',
            notes: (formData.get('counselorComments') as string) || 'Added via paper form upload',
        };

        // TODO: Handle photo upload to Google Drive or cloud storage
        // const photo = formData.get('formPhoto') as File;

        await createInquiry({
            ...inquiryData,
            createdBy: session.user?.name ?? 'Admin Portal',
            source: 'PaperForm',
        });

        return NextResponse.json({
            success: true,
            message: 'Paper form inquiry added successfully',
        });
    } catch (error) {
        console.error('API Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to upload paper form',
            },
            { status: 500 }
        );
    }
}
