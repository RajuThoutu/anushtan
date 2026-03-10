import { NextResponse } from 'next/server';
import { countAllInquiries } from '@repo/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/** Lightweight endpoint — returns total inquiry count only, no row data. */
export async function GET() {
    try {
        const count = await countAllInquiries();
        return NextResponse.json({ success: true, count });
    } catch (error) {
        console.error('Count API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to count inquiries' },
            { status: 500 }
        );
    }
}
