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
            currentSchool: formData.get('currentSchool') as string || '',
            board: formData.get('board') as string || '',
            parentName: formData.get('parentName') as string,
            occupation: formData.get('occupation') as string || '',
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            address: formData.get('address') as string,
            howHeard: formData.get('howHeard') as string,
            assignedTo: formData.get('assignedTo') as string || session.user.name,
            status: 'Interested', // Auto-set to Interested for paper forms
            notes: 'Added via paper form upload',
        };

        // TODO: Handle photo upload to Google Drive or cloud storage
        // const photo = formData.get('formPhoto') as File;

        await createInquiry({
            ...inquiryData,
            createdBy: session.user.name,
            source: 'Paper',
            notes: 'Added via paper form upload',
            status: 'New',
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
