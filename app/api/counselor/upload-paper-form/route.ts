import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-config';
import { createInquiry } from '@/lib/sheets/client';

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

        const inquiryData = {
            studentName: formData.get('studentName') as string,
            currentClass: formData.get('currentClass') as string,
            // Defaults for removed fields
            parentName: 'Paper Form',
            phone: '0000000000',
            email: 'paper@example.com',
            howHeard: 'Paper Form',
            address: 'See Photo',

            counselorName: formData.get('counselorName') as string || session.user.name,
            status: formData.get('status') as string || 'New',
            counselorComments: formData.get('counselorComments') as string || '',
            followUpDate: formData.get('followUpDate') as string || '',
            notes: 'Added via paper form upload',
        };

        // TODO: Handle photo upload to Google Drive or cloud storage
        // const photo = formData.get('formPhoto') as File;

        await createInquiry({
            ...inquiryData,
            createdBy: session.user.name,
            source: 'Paper',
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
