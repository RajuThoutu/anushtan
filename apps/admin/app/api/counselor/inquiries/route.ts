import { NextRequest, NextResponse } from 'next/server';
import { getAllInquiries, searchInquiries, getInquiriesByDateRange } from '@repo/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const search   = searchParams.get('search')?.trim() ?? '';
        // YYYY-MM-DD strings in IST — e.g. "2026-03-10"
        const dateFrom = searchParams.get('dateFrom')?.trim() ?? '';
        const dateTo   = searchParams.get('dateTo')?.trim() ?? '';

        let inquiries;

        if (search.length >= 2) {
            // Full-text search (counselor cross-check)
            inquiries = await searchInquiries(search);
        } else if (dateFrom || dateTo) {
            // Date-range fetch — convert IST date strings to UTC Date objects
            // IST = UTC+05:30, so midnight IST = 18:30 UTC previous day
            const from = dateFrom ? new Date(`${dateFrom}T00:00:00+05:30`) : new Date(0);
            const to   = dateTo   ? new Date(`${dateTo}T23:59:59.999+05:30`) : new Date();
            inquiries = await getInquiriesByDateRange(from, to);
        } else {
            // Full load (All Inquiries page, HR+)
            inquiries = await getAllInquiries();
        }

        return NextResponse.json({
            success: true,
            data: inquiries,
            count: inquiries.length,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to fetch inquiries' },
            { status: 500 }
        );
    }
}
