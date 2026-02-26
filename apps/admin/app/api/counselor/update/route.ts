import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-config';
import { updateCounselorActions } from '@repo/database';

export async function POST(request: Request) {
    console.log('[API] /api/counselor/update called');
    try {
        // Get counselor name from session
        const session = await getServerSession(authOptions);
        console.log('[API] Session user:', session?.user?.name);

        if (!session?.user?.name) {
            console.warn('[API] Unauthorized: No session user');
            return NextResponse.json(
                { success: false, error: 'Unauthorized - session required' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id, status, followUpDate, counselorComments, unassign } = body;
        console.log('[API] Request body:', JSON.stringify(body));

        if (!id) {
            console.error('[API] Missing ID');
            return NextResponse.json(
                { success: false, error: 'Inquiry ID is required' },
                { status: 400 }
            );
        }

        await updateCounselorActions(id, {
            status,
            followUpDate,
            counselorComments,
            unassign,
            updatedBy: session.user.name, // Pass counselor name for audit trail
        });

        console.log('[API] Update successful for:', id);

        return NextResponse.json({
            success: true,
            message: 'Counselor actions updated successfully',
        });
    } catch (error) {
        console.error('[API] Error details:', (error as Error)?.stack || error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update counselor actions',
            },
            { status: 500 }
        );
    }
}
