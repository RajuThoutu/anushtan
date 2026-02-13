import { NextResponse } from 'next/server';
import { getInquiryById } from '@repo/database';

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        if (!id) {
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
