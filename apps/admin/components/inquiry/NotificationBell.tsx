'use client';

import { useState, useEffect } from 'react';

interface NotificationBellProps {
    userEmail: string;
}

interface Notification {
    id: string;
    message: string;
    timestamp: string;
    inquiryId?: number;
    read: boolean;
}

export function NotificationBell({ userEmail }: NotificationBellProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Fetch notifications on mount
        fetchNotifications();

        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);

        return () => clearInterval(interval);
    }, [userEmail]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/counselor/notifications');
            const data = await response.json();

            if (data.success) {
                setNotifications(data.notifications || []);
                setUnreadCount(data.notifications?.filter((n: Notification) => !n.read).length || 0);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            await fetch('/api/counselor/notifications/mark-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId }),
            });

            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-anushtan-charcoal hover:bg-anushtan-parchment rounded-lg transition"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-anushtan-border z-20 max-h-96 overflow-y-auto">
                        <div className="p-4 border-b border-anushtan-border">
                            <h3 className="font-semibold text-anushtan-charcoal">Notifications</h3>
                        </div>

                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-anushtan-charcoal/60">
                                No notifications
                            </div>
                        ) : (
                            <div className="divide-y divide-anushtan-border">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-anushtan-parchment cursor-pointer ${!notification.read ? 'bg-blue-50' : ''
                                            }`}
                                        onClick={() => {
                                            markAsRead(notification.id);
                                            if (notification.inquiryId) {
                                                window.location.href = `/inquiry/${notification.inquiryId}`;
                                            }
                                        }}
                                    >
                                        <p className="text-sm text-anushtan-charcoal">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-anushtan-charcoal/50 mt-1">
                                            {new Date(notification.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
