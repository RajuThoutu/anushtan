'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
    LayoutDashboard,
    ClipboardList,
    BarChart3,
    Users,
    LogOut,
    Menu,
    X,
    QrCode,
    CalendarClock,
    MessageSquare,
    Power,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { AddInquiryButton } from './AddInquiryButton';
import { NotificationBell } from '@/components/inquiry/NotificationBell';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    roles?: string[];
    group?: 'main' | 'admin';
}

const navItems: NavItem[] = [
    // ── Main ─────────────────────────────────────────────────────────────────
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard size={20} />,
        group: 'main',
    },
    {
        label: 'All Inquiries',
        href: '/students',
        icon: <ClipboardList size={20} />,
        group: 'main',
    },
    {
        label: 'Reports',
        href: '/reports',
        icon: <BarChart3 size={20} />,
        roles: ['super_admin', 'admin', 'hr'],
        group: 'main',
    },
    {
        label: 'User Management',
        href: '/users',
        icon: <Users size={20} />,
        roles: ['super_admin'],
        group: 'main',
    },
    {
        label: 'Follow-ups',
        href: '/followups',
        icon: <CalendarClock size={20} />,
        group: 'main',
    },
    {
        label: 'QR Code',
        href: '/qr',
        icon: <QrCode size={20} />,
        group: 'main',
    },
    // ── Admin Tools (super_admin only) ────────────────────────────────────────
    {
        label: 'WhatsApp',
        href: '/admin/whatsapp',
        icon: <MessageSquare size={20} />,
        roles: ['super_admin'],
        group: 'admin',
    },
];

function LogoutButton() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                aria-label="Sign out"
                className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-200 ${
                    open
                        ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/30'
                        : 'bg-white/10 border-white/20 text-white/80 hover:bg-red-500/20 hover:border-red-400/60 hover:text-white'
                }`}
            >
                <Power size={16} />
            </button>

            {open && (
                <div className="absolute right-0 top-11 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 pt-3 pb-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sign out?</p>
                        <p className="text-xs text-gray-400 mt-0.5">You will be logged out.</p>
                    </div>
                    <div className="flex border-t border-gray-100">
                        <button
                            onClick={() => setOpen(false)}
                            className="flex-1 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <div className="w-px bg-gray-100" />
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="flex-1 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                        >
                            <LogOut size={12} /> Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export function DashboardSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const userRole = session?.user?.role || '';
    const userName = session?.user?.name || 'User';

    // Filter nav items based on role
    const filteredNavItems = navItems.filter(item => {
        if (!item.roles) return true;
        return item.roles.includes(userRole);
    });

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    return (
        <>
            {/* Mobile Header Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-admin-blue to-admin-purple shadow-lg z-40 flex items-center px-4">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
                </button>
                <div className="flex items-center gap-2 ml-4">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <h1 className="font-heading text-lg font-bold text-white">
                        Anushtan
                    </h1>
                </div>

                {/* Mobile: Bell + Add */}
                <div className="ml-auto flex items-center gap-1">
                    <NotificationBell />
                    <AddInquiryButton />
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed left-0 top-0 h-screen w-64
                    bg-gradient-to-br from-admin-blue via-admin-purple to-admin-blue-dark
                    flex flex-col z-50 transition-transform duration-300 shadow-2xl
                    lg:translate-x-0
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Logo - Desktop only */}
                <div className="hidden lg:block p-6 border-b border-white/20">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">A</span>
                        </div>
                        <div>
                            <h1 className="font-heading text-xl font-bold text-white">
                                Anushtan
                            </h1>
                            <p className="text-xs text-white/80">Admin Portal</p>
                        </div>
                    </Link>
                </div>

                {/* Mobile: Add padding for header */}
                <div className="lg:hidden h-16" />

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {filteredNavItems.map((item, index) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            const colors = [
                                'from-admin-blue to-admin-blue-light',
                                'from-admin-emerald to-admin-emerald-light',
                                'from-admin-coral to-admin-coral-light',
                                'from-admin-purple to-admin-purple-light',
                                'from-admin-amber to-admin-amber-light',
                            ];
                            const colorClass = colors[index % colors.length];

                            // Show "Admin Tools" divider before first admin-group item
                            const isFirstAdmin = item.group === 'admin' &&
                                (index === 0 || filteredNavItems[index - 1].group !== 'admin');

                            return (
                                <li key={item.href}>
                                    {isFirstAdmin && (
                                        <div className="flex items-center gap-2 px-2 pt-3 pb-1">
                                            <div className="h-px flex-1 bg-white/20" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                                                Admin Tools
                                            </span>
                                            <div className="h-px flex-1 bg-white/20" />
                                        </div>
                                    )}
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                                            ${isActive
                                                ? `bg-gradient-to-r ${colorClass} text-white shadow-lg scale-105`
                                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                                            }
                                        `}
                                    >
                                        <span className={isActive ? 'drop-shadow-md' : ''}>{item.icon}</span>
                                        <span className="font-medium">{item.label}</span>
                                        {isActive && (
                                            <span className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-white/20 bg-black/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-admin-amber to-admin-coral rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">
                                {userName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">
                                {userName}
                            </p>
                            <p className="text-xs text-white/70 uppercase">
                                {userRole.replace('_', ' ')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white/90 hover:bg-white/10 rounded-lg transition-all"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-admin-bg">
            <DashboardSidebar />
            {/* Add top padding on mobile to account for fixed header */}
            <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0 flex flex-col">
                {/* Desktop Header */}
                <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-gradient-to-r from-admin-blue to-admin-purple border-b border-white/10 sticky top-0 z-30">
                    <div className="font-heading text-xl font-bold text-white">
                        Management Console
                    </div>
                    <div className="flex items-center gap-3">
                        <NotificationBell />
                        <AddInquiryButton />
                        <LogoutButton />
                    </div>
                </header>

                <div className="flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
