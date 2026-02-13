import { NextResponse } from 'next/server';
import { getAllInquiries } from '@repo/database';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const inquiries = await getAllInquiries();
        const unassigned = inquiries.filter(inq => !inq.counselorName || inq.counselorName.trim() === '');

        const counts: Record<string, number> = {};
        inquiries.forEach(inq => {
            const name = inq.counselorName || 'Unassigned';
            counts[name] = (counts[name] || 0) + 1;
        });

        return NextResponse.json({
            success: true,
            total: inquiries.length,
            unassigned: unassigned.length,
            distribution: counts
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
