import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-config';
import { bulkSetFollowUpDate } from '@repo/database';

const ALLOWED_ROLES = ['super_admin', 'admin', 'hr'];

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const role = session.user.role ?? '';
        if (!ALLOWED_ROLES.includes(role)) {
            return NextResponse.json({ success: false, error: 'Forbidden: HR or above required' }, { status: 403 });
        }

        const body = await request.json();
        const { inquiryIds, followUpDate } = body;

        if (!Array.isArray(inquiryIds) || inquiryIds.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Missing or invalid array of inquiryIds' },
                { status: 400 }
            );
        }

        if (!followUpDate || typeof followUpDate !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Missing followUpDate (YYYY-MM-DD)' },
                { status: 400 }
            );
        }

        const updatedBy = session.user.name ?? session.user.email ?? 'Unknown';
        const result = await bulkSetFollowUpDate(inquiryIds, followUpDate, updatedBy);

        return NextResponse.json({
            success: true,
            message: `Follow-up date set for ${result.count} inquiries`,
            count: result.count
        });

    } catch (error) {
        console.error('Bulk Follow-up Error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to set follow-up date' },
            { status: 500 }
        );
    }
}
