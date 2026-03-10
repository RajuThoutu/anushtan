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
    MoreHorizontal,
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
    {
        label: 'WhatsApp',
        href: '/admin/whatsapp',
        icon: <MessageSquare size={20} />,
        roles: ['super_admin'],
        group: 'admin',
    },
];

// Bottom nav items — counselors skip Inquiries, get QR Code instead
const hrBottomNavItems = [
    { label: 'Home', href: '/dashboard', Icon: LayoutDashboard },
    { label: 'Inquiries', href: '/students', Icon: ClipboardList },
    { label: 'Follow-ups', href: '/followups', Icon: CalendarClock },
];
const counselorBottomNavItems = [
    { label: 'Home', href: '/dashboard', Icon: LayoutDashboard },
    { label: 'Follow-ups', href: '/followups', Icon: CalendarClock },
    { label: 'QR Code', href: '/qr', Icon: QrCode },
];

function LogoutButton() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

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
    const isCounselor = userRole === 'counselor';

    const filteredNavItems = navItems.filter(item => {
        // Counselors don't see All Inquiries in sidebar (they use search via the page directly)
        if (isCounselor && item.href === '/students') return false;
        if (!item.roles) return true;
        return item.roles.includes(userRole);
    });

    const bottomNavItems = isCounselor ? counselorBottomNavItems : hrBottomNavItems;

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    return (
        <>
            {/* ── Mobile Top Header ───────────────────────────────────────────── */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-100 shadow-sm z-40 flex items-center px-4">
                {/* Brand */}
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-admin-blue to-admin-purple rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <span className="font-heading text-base font-bold text-gray-900">Anushtan</span>
                </div>

                {/* Right: Bell + Add */}
                <div className="ml-auto flex items-center gap-1">
                    <NotificationBell />
                    <AddInquiryButton />
                </div>
            </div>

            {/* ── Mobile Bottom Navigation Bar ────────────────────────────────── */}
            <nav
                className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
                <div className="flex items-stretch h-16">
                    {bottomNavItems.map(({ label, href, Icon }) => {
                        const isActive = pathname === href || pathname.startsWith(href + '/');
                        return (
                            <Link
                                key={href}
                                href={href}
                                className="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors"
                            >
                                {/* Active indicator pill at top */}
                                {isActive && (
                                    <span className="absolute top-0 left-1/4 right-1/4 h-[3px] bg-admin-blue rounded-b-full" />
                                )}
                                <Icon
                                    size={22}
                                    strokeWidth={isActive ? 2.5 : 1.5}
                                    className={isActive ? 'text-admin-blue' : 'text-gray-400'}
                                />
                                <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-admin-blue' : 'text-gray-400'}`}>
                                    {label}
                                </span>
                            </Link>
                        );
                    })}

                    {/* More → opens sidebar drawer */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
                        aria-label="More options"
                    >
                        <MoreHorizontal size={22} strokeWidth={1.5} className="text-gray-400" />
                        <span className="text-[10px] font-semibold tracking-wide text-gray-400">More</span>
                    </button>
                </div>
            </nav>

            {/* ── Sidebar Overlay (mobile) ─────────────────────────────────────── */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* ── Sidebar Drawer ───────────────────────────────────────────────── */}
            <aside
                className={`
                    fixed left-0 top-0 h-screen w-72
                    bg-gradient-to-br from-admin-blue via-admin-purple to-admin-blue-dark
                    flex flex-col z-50 transition-transform duration-300 ease-out shadow-2xl
                    lg:translate-x-0 lg:w-64
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Logo — shown on both mobile and desktop */}
                <div className="p-5 border-b border-white/20 flex items-center gap-3 shrink-0">
                    {/* Mobile close button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors -ml-1"
                        aria-label="Close menu"
                    >
                        <X size={18} className="text-white/70" />
                    </button>
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <div>
                        <h1 className="font-heading text-lg font-bold text-white leading-tight">Anushtan</h1>
                        <p className="text-xs text-white/60">Admin Portal</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 overflow-y-auto">
                    <ul className="space-y-1">
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
                                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                            ${isActive
                                                ? `bg-gradient-to-r ${colorClass} text-white shadow-lg`
                                                : 'text-white/75 hover:bg-white/10 hover:text-white'
                                            }
                                        `}
                                    >
                                        <span>{item.icon}</span>
                                        <span className="font-medium text-sm">{item.label}</span>
                                        {isActive && (
                                            <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User Info + Logout */}
                <div className="p-4 border-t border-white/20 bg-black/10 shrink-0">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-admin-amber to-admin-coral rounded-full flex items-center justify-center shadow-md shrink-0">
                            <span className="text-white font-bold text-sm">
                                {userName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white text-sm truncate">{userName}</p>
                            <p className="text-xs text-white/60 uppercase tracking-wider">{userRole.replace('_', ' ')}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg transition-all"
                    >
                        <LogOut size={15} />
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
            {/* Mobile: pt-14 (top bar) + pb-16 (bottom nav). Desktop: ml-64 (sidebar) */}
            <main className="lg:ml-64 h-screen pt-14 pb-16 lg:pt-0 lg:pb-0 flex flex-col overflow-hidden">
                {/* Desktop Header */}
                <header className="hidden lg:flex shrink-0 items-center justify-between px-8 py-4 bg-gradient-to-r from-admin-blue to-admin-purple border-b border-white/10 z-30">
                    <div className="font-heading text-xl font-bold text-white">
                        Management Console
                    </div>
                    <div className="flex items-center gap-3">
                        <NotificationBell />
                        <AddInquiryButton />
                        <LogoutButton />
                    </div>
                </header>

                <div className="flex-1 min-h-0 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
