'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
    LayoutDashboard,
    UserPlus,
    ClipboardList,
    BarChart3,
    Users,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    roles?: string[];
}

const navItems: NavItem[] = [
    {
        label: 'Dashboard',
        href: '/auth/dashboard',
        icon: <LayoutDashboard size={20} />,
    },
    {
        label: 'Add Inquiry',
        href: '/auth/students/add',
        icon: <UserPlus size={20} />,
    },
    {
        label: 'All Inquiries',
        href: '/auth/students',
        icon: <ClipboardList size={20} />,
    },
    {
        label: 'Reports',
        href: '/auth/reports',
        icon: <BarChart3 size={20} />,
        roles: ['super_admin', 'admin', 'hr'],
    },
    {
        label: 'User Management',
        href: '/auth/users',
        icon: <Users size={20} />,
        roles: ['super_admin'],
    },
];

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
        signOut({ callbackUrl: '/auth' });
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-anushtan-border"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

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
                {/* Logo */}
                <div className="p-6 border-b border-white/20">
                    <Link href="/auth/dashboard" className="flex items-center gap-3">
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

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {filteredNavItems.map((item, index) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            // Assign different colors to each nav item
                            const colors = [
                                'from-admin-blue to-admin-blue-light',
                                'from-admin-emerald to-admin-emerald-light',
                                'from-admin-coral to-admin-coral-light',
                                'from-admin-purple to-admin-purple-light',
                                'from-admin-amber to-admin-amber-light',
                            ];
                            const colorClass = colors[index % colors.length];

                            return (
                                <li key={item.href}>
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
            <main className="lg:ml-64 min-h-screen">
                {children}
            </main>
        </div>
    );
}
