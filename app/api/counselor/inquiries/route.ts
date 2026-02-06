import { NextResponse } from 'next/server';
import { getAllInquiries } from '@/lib/sheets/client';

export async function GET() {
    try {
        const inquiries = await getAllInquiries();

        return NextResponse.json({
            success: true,
            data: inquiries,
            count: inquiries.length,
        });
    } catch (error) {
        console.error('API Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch inquiries',
            },
            { status: 500 }
        );
    }
}
