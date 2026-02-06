import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-config';
import { updateCounselorActions } from '@/lib/sheets/client';

export async function POST(request: Request) {
    try {
        // Get counselor name from session
        const session = await getServerSession(authOptions);
        if (!session?.user?.name) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized - session required' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id, status, followUpDate, counselorComments } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Inquiry ID is required' },
                { status: 400 }
            );
        }

        await updateCounselorActions(id, {
            status,
            followUpDate,
            counselorComments,
            updatedBy: session.user.name, // Pass counselor name for audit trail
        });

        return NextResponse.json({
            success: true,
            message: 'Counselor actions updated successfully',
        });
    } catch (error) {
        console.error('API Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update counselor actions',
            },
            { status: 500 }
        );
    }
}
