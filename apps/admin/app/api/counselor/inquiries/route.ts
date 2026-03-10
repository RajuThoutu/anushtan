import { NextRequest, NextResponse } from 'next/server';
import { getAllInquiries, searchInquiries } from '@repo/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const search = searchParams.get('search')?.trim() ?? '';

        const inquiries = search.length >= 2
            ? await searchInquiries(search)
            : await getAllInquiries();

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
