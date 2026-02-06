import { NextResponse } from 'next/server';
import { getInquiryById } from '@/lib/sheets/client';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid inquiry ID' },
                { status: 400 }
            );
        }

        const inquiry = await getInquiryById(id);

        return NextResponse.json({
            success: true,
            data: inquiry,
        });
    } catch (error) {
        console.error('API Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch inquiry',
            },
            { status: 500 }
        );
    }
}
