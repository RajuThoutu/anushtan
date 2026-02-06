import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-config';
import { updateCounselorActions } from '@/lib/sheets/client';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { inquiryId } = await request.json();

        if (!inquiryId) {
            return NextResponse.json(
                { success: false, error: 'Inquiry ID is required' },
                { status: 400 }
            );
        }

        // Assign inquiry to current user
        await updateCounselorActions(inquiryId, {
            assignedTo: session.user.name,
            status: 'Open', // Auto-set to Open when assigned
            updatedBy: session.user.name,
        });

        return NextResponse.json({
            success: true,
            message: 'Inquiry assigned successfully',
        });
    } catch (error) {
        console.error('API Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to assign inquiry',
            },
            { status: 500 }
        );
    }
}
