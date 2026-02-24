import { NextResponse } from 'next/server';
import { getUnreadNotifications, markNotificationRead } from '@repo/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const notifications = await getUnreadNotifications();
        return NextResponse.json({ success: true, data: notifications });
    } catch (error) {
        console.error('[Notifications] GET error:', error);
        return NextResponse.json({ success: false, data: [] }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { id } = await request.json();
        if (!id || typeof id !== 'number') {
            return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
        }
        await markNotificationRead(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Notifications] PATCH error:', error);
        return NextResponse.json({ success: false, error: 'Failed to mark as read' }, { status: 500 });
    }
}
