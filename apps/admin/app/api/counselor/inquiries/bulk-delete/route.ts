import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-config';
import { deleteInquiries } from '@repo/database';

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // Only Raju (email='raju') or explicitly super_admin role can delete
        const isSuperAdmin = session.user.role === 'super_admin' || session.user.email?.toLowerCase() === 'raju';

        if (!isSuperAdmin) {
            return NextResponse.json({ success: false, error: 'Forbidden: Super Admins only' }, { status: 403 });
        }

        const body = await request.json();
        const { inquiryIds } = body;

        if (!Array.isArray(inquiryIds) || inquiryIds.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Missing or invalid array of inquiryIds' },
                { status: 400 }
            );
        }

        const result = await deleteInquiries(inquiryIds);

        return NextResponse.json({
            success: true,
            message: `Successfully deleted ${result.count} inquiries`,
            count: result.count
        });

    } catch (error) {
        console.error('Bulk Delete Error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to delete inquiries' },
            { status: 500 }
        );
    }
}
