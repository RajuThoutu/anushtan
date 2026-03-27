import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-config';
import { getFollowUpActivityReport } from '@repo/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
        const allowedRoles = ['super_admin', 'admin', 'hr'];
        if (!allowedRoles.includes(session.user.role)) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = request.nextUrl;
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');

        if (!dateFrom || !dateTo) {
            return NextResponse.json({ success: false, error: 'dateFrom and dateTo are required' }, { status: 400 });
        }

        // Parse YYYY-MM-DD as IST day boundaries
        const from = new Date(`${dateFrom}T00:00:00+05:30`);
        const to = new Date(`${dateTo}T23:59:59.999+05:30`);

        const data = await getFollowUpActivityReport(from, to);

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('[API] followup-activity report error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to fetch report' },
            { status: 500 }
        );
    }
}
