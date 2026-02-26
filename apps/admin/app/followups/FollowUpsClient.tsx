'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarClock, Phone, AlertCircle, CheckCircle2, Clock, RefreshCw } from 'lucide-react';

interface Inquiry {
    id: string;
    inquiryId: string;
    studentName: string;
    parentName?: string;
    phone?: string;
    currentClass?: string;
    status: string;
    assignedTo?: string;
    counselorName?: string;
    followUpDate?: string | null;
    updatedAt?: string;
    inquiryDate: string;
}

/** Today's date string in IST (YYYY-MM-DD) */
function todayIST(): string {
    const now = new Date();
    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    return ist.toISOString().split('T')[0];
}

const STATUS_STYLE: Record<string, string> = {
    'New':       'bg-blue-100 text-blue-700',
    'Open':      'bg-amber-100 text-amber-700',
    'Follow-up': 'bg-purple-100 text-purple-700',
    'Converted': 'bg-emerald-100 text-emerald-700',
    'Closed':    'bg-gray-100 text-gray-600',
};

export function FollowUpsClient() {
    const router = useRouter();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

    const today = todayIST();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/counselor/inquiries');
            const data = await res.json();
            if (data.success) setInquiries(data.data ?? []);
        } catch (e) {
            console.error('Failed to fetch inquiries', e);
        } finally {
            setLoading(false);
            setLastRefreshed(new Date());
        }
    };

    useEffect(() => { fetchData(); }, []);

    // ── Filter: updated today ──────────────────────────────────────────────
    const todayItems = inquiries.filter(i => {
        const updated = i.updatedAt ?? i.inquiryDate;
        return updated?.split('T')[0] === today;
    });

    // ── Breakdown counts ───────────────────────────────────────────────────
    const counts = {
        total:     todayItems.length,
        active:    todayItems.filter(i => ['New', 'Open', 'Follow-up'].includes(i.status)).length,
        converted: todayItems.filter(i => i.status === 'Converted').length,
        overdue:   todayItems.filter(i => {
            if (!i.followUpDate || !['New', 'Open', 'Follow-up'].includes(i.status)) return false;
            return new Date(i.followUpDate).toISOString().split('T')[0] < today;
        }).length,
    };

    // ── Format helpers ─────────────────────────────────────────────────────
    const fmtTime = (iso?: string) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleTimeString('en-IN', {
            hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
        });
    };

    const fmtDate = (iso?: string | null) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
        });
    };

    const todayFmt = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
    });

    // ── Loading ────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-purple" />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <CalendarClock className="text-admin-purple" size={24} />
                        <h1 className="font-heading text-2xl font-bold text-admin-charcoal">
                            Today's Follow-ups
                        </h1>
                    </div>
                    <p className="text-sm text-admin-text-secondary">{todayFmt}</p>
                </div>
                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-admin-text-secondary bg-white border border-admin-border rounded-xl hover:bg-gray-50 transition"
                >
                    <RefreshCw size={14} />
                    Refresh
                </button>
            </div>

            {/* ── Stat chips ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-white rounded-xl border border-admin-border p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-admin-charcoal">{counts.total}</p>
                    <p className="text-xs text-admin-text-secondary mt-0.5">Updated Today</p>
                </div>
                <div className="bg-white rounded-xl border border-admin-border p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-amber-600">{counts.active}</p>
                    <p className="text-xs text-admin-text-secondary mt-0.5">Still Active</p>
                </div>
                <div className="bg-white rounded-xl border border-admin-border p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-emerald-600">{counts.converted}</p>
                    <p className="text-xs text-admin-text-secondary mt-0.5">Converted</p>
                </div>
                <div className="bg-white rounded-xl border border-admin-border p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-red-500">{counts.overdue}</p>
                    <p className="text-xs text-admin-text-secondary mt-0.5">Overdue Follow-up</p>
                </div>
            </div>

            {/* ── Table ───────────────────────────────────────────────────── */}
            {todayItems.length === 0 ? (
                <div className="bg-white rounded-2xl border border-admin-border p-16 text-center">
                    <CalendarClock size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-admin-text font-medium">No inquiries updated today</p>
                    <p className="text-sm text-admin-text-secondary mt-1">
                        Inquiries that counselors act on today will appear here.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-admin-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-admin-border text-left">
                                    <th className="px-4 py-3 font-semibold text-admin-text-secondary text-xs uppercase tracking-wide">#</th>
                                    <th className="px-4 py-3 font-semibold text-admin-text-secondary text-xs uppercase tracking-wide">Student</th>
                                    <th className="px-4 py-3 font-semibold text-admin-text-secondary text-xs uppercase tracking-wide">Phone</th>
                                    <th className="px-4 py-3 font-semibold text-admin-text-secondary text-xs uppercase tracking-wide">Grade</th>
                                    <th className="px-4 py-3 font-semibold text-admin-text-secondary text-xs uppercase tracking-wide">Status</th>
                                    <th className="px-4 py-3 font-semibold text-admin-text-secondary text-xs uppercase tracking-wide">Assigned To</th>
                                    <th className="px-4 py-3 font-semibold text-admin-text-secondary text-xs uppercase tracking-wide">Follow-up Date</th>
                                    <th className="px-4 py-3 font-semibold text-admin-text-secondary text-xs uppercase tracking-wide">Updated At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {todayItems.map((item, idx) => {
                                    const isOverdue = item.followUpDate &&
                                        ['New', 'Open', 'Follow-up'].includes(item.status) &&
                                        new Date(item.followUpDate).toISOString().split('T')[0] < today;

                                    return (
                                        <tr
                                            key={item.id}
                                            onClick={() => router.push(`/inquiry/${item.inquiryId}`)}
                                            className="hover:bg-amber-50/50 cursor-pointer transition-colors"
                                        >
                                            <td className="px-4 py-3 text-admin-text-secondary font-mono text-xs">
                                                {item.inquiryId}
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-admin-charcoal">{item.studentName}</p>
                                                {item.parentName && (
                                                    <p className="text-xs text-admin-text-secondary">{item.parentName}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.phone ? (
                                                    <a
                                                        href={`tel:${item.phone}`}
                                                        onClick={e => e.stopPropagation()}
                                                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        <Phone size={13} />
                                                        {item.phone}
                                                    </a>
                                                ) : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-admin-text">
                                                {item.currentClass || '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[item.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-admin-text">
                                                {item.assignedTo || item.counselorName || (
                                                    <span className="text-gray-400 italic text-xs">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.followUpDate ? (
                                                    <span className={`flex items-center gap-1 text-xs font-medium ${
                                                        isOverdue ? 'text-red-600' : 'text-admin-text'
                                                    }`}>
                                                        {isOverdue
                                                            ? <AlertCircle size={13} />
                                                            : item.status === 'Converted'
                                                                ? <CheckCircle2 size={13} className="text-emerald-500" />
                                                                : <Clock size={13} className="text-amber-500" />
                                                        }
                                                        {fmtDate(item.followUpDate)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-admin-text-secondary text-xs">
                                                {fmtTime(item.updatedAt ?? item.inquiryDate)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 py-3 border-t border-admin-border bg-gray-50 text-xs text-admin-text-secondary">
                        {todayItems.length} {todayItems.length === 1 ? 'inquiry' : 'inquiries'} updated today
                        · Last refreshed {lastRefreshed.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </div>
                </div>
            )}
        </div>
    );
}
