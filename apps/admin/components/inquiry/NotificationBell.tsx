'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DbNotification {
    id: number;
    inquiryId: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<DbNotification[]>([]);
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const unreadCount = notifications.length; // API only returns unread

    // ── Polling ──────────────────────────────────────────────────────────────
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 8000);
        return () => clearInterval(interval);
    }, []);

    // ── Close on outside click ────────────────────────────────────────────────
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/counselor/notifications');
            const data = await res.json();
            if (data.success) setNotifications(data.data ?? []);
        } catch {
            // silently fail — non-critical
        }
    };

    const handleClick = async (n: DbNotification) => {
        setOpen(false);
        // Optimistically remove from list
        setNotifications(prev => prev.filter(x => x.id !== n.id));
        // Mark as read in DB
        fetch('/api/counselor/notifications', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: n.id }),
        }).catch(() => {});
        // Navigate to inquiry
        router.push(`/inquiry/${n.inquiryId}`);
    };

    const markAllRead = async () => {
        const ids = notifications.map(n => n.id);
        setNotifications([]);
        setOpen(false);
        await Promise.allSettled(
            ids.map(id =>
                fetch('/api/counselor/notifications', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id }),
                })
            )
        );
    };

    return (
        <div className="relative" ref={ref}>
            {/* Bell button */}
            <button
                onClick={() => setOpen(o => !o)}
                className="relative p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
                title="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1 animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-800 text-sm">
                                Notifications
                                {unreadCount > 0 && (
                                    <span className="ml-2 bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                                        {unreadCount} new
                                    </span>
                                )}
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                            {notifications.length === 0 ? (
                                <div className="py-8 text-center text-gray-400 text-sm">
                                    <Bell size={24} className="mx-auto mb-2 opacity-30" />
                                    All caught up!
                                </div>
                            ) : (
                                notifications.map(n => (
                                    <div
                                        key={n.id}
                                        onClick={() => handleClick(n)}
                                        className="flex gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors"
                                    >
                                        <div className="mt-0.5 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-800 leading-snug">{n.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(n.createdAt).toLocaleString('en-IN', {
                                                    month: 'short', day: 'numeric',
                                                    hour: 'numeric', minute: '2-digit', hour12: true,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
