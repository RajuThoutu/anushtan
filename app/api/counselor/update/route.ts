import { NextResponse } from 'next/server';
import { updateCounselorActions } from '@/lib/sheets/client';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, status, assignedTo, notes, followUpDate } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Inquiry ID is required' },
                { status: 400 }
            );
        }

        await updateCounselorActions(id, {
            status,
            assignedTo,
            notes,
            followUpDate,
        });

        return NextResponse.json({
            success: true,
            message: 'Counselor actions updated successfully',
        });
    } catch (error) {
        console.error('API Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update counselor actions',
            },
            { status: 500 }
        );
    }
}
