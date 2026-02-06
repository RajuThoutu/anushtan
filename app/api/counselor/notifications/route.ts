import { NextResponse } from 'next/server';

// Mock notifications for now - will integrate with Google Sheets later
export async function GET() {
    try {
        // TODO: Fetch from Google Sheets "Notifications" sheet
        // For now, return empty array
        const notifications = [];

        return NextResponse.json({
            success: true,
            notifications,
        });
    } catch (error) {
        console.error('API Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch notifications',
            },
            { status: 500 }
        );
    }
}
