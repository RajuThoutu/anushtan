'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    CalendarClock, Phone, AlertCircle, CheckCircle2, Clock, RefreshCw,
    Search, Filter, Calendar, X, MessageSquare, Edit3
} from 'lucide-react';

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

/** YYYY-MM-DD in IST */
function todayIST(): string {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

/** YYYY-MM-DD in IST for any Date object */
function toISTDate(d: Date): string {
    return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

const STATUS_STYLE: Record<string, string> = {
    'New': 'bg-blue-100 text-blue-700',
    'Follow-up': 'bg-purple-100 text-purple-700',
    'Converted': 'bg-emerald-100 text-emerald-700',
    'Casual Inquiry': 'bg-gray-100 text-gray-600',
};

export function FollowUpsClient() {
    const router = useRouter();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

    // Filters — default to today
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateStart, setDateStart] = useState(todayIST());
    const [dateEnd, setDateEnd] = useState(todayIST());
    const [quickSelect, setQuickSelect] = useState('today');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/counselor/inquiries', { cache: 'no-store' });
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

    // ── Quick Action Modal State ───────────────────────────────────────────
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState('Follow-up');
    const [modalDate, setModalDate] = useState('');
    const [modalComment, setModalComment] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const openModal = (inquiry: Inquiry, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedInquiry(inquiry);
        setModalStatus(inquiry.status);
        setModalDate(inquiry.followUpDate ? toISTDate(new Date(inquiry.followUpDate)) : todayIST());
        setModalComment('');
        setIsModalOpen(true);
    };

    const handleQuickUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInquiry || isUpdating) return;

        setIsUpdating(true);
        try {
            const res = await fetch('/api/counselor/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedInquiry.inquiryId,
                    status: modalStatus,
                    followUpDate: modalDate ? new Date(modalDate).toISOString() : null,
                    counselorComments: modalComment,
                })
            });

            const data = await res.json();
            if (data.success) {
                // Optimistic UI Update so the user feels it instantly
                setInquiries(prev => prev.map(inv => {
                    if (inv.inquiryId === selectedInquiry.inquiryId) {
                        return {
                            ...inv,
                            status: modalStatus,
                            followUpDate: modalDate ? new Date(modalDate).toISOString() : null,
                            // Notice: We don't know the exact new assignedTo name without the response payload,
                            // but fetching data again in the background will fix it momentarily.
                        };
                    }
                    return inv;
                }));
                // Real data sync
                fetchData();
                setIsModalOpen(false);
            } else {
                alert(data.error || 'Update failed');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to update inquiry');
        } finally {
            setIsUpdating(false);
        }
    };

    // ── Quick-select handler ───────────────────────────────────────────────
    const handleQuickSelect = (val: string) => {
        setQuickSelect(val);
        const now = new Date();
        let start = '';
        let end = '';

        if (val === 'today') {
            start = end = toISTDate(now);
        } else if (val === 'yesterday') {
            const d = new Date(now);
            d.setDate(now.getDate() - 1);
            start = end = toISTDate(d);
        } else if (val === 'thisWeek') {
            const d = new Date(now);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            const monday = new Date(d.setDate(diff));
            const sunday = new Date(new Date(monday).setDate(monday.getDate() + 6));
            start = toISTDate(monday);
            end = toISTDate(sunday);
        } else if (val === 'lastWeek') {
            const d = new Date(now);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1) - 7;
            const monday = new Date(d.setDate(diff));
            const sunday = new Date(new Date(monday).setDate(monday.getDate() + 6));
            start = toISTDate(monday);
            end = toISTDate(sunday);
        } else if (val === 'thisMonth') {
            start = toISTDate(new Date(now.getFullYear(), now.getMonth(), 1));
            end = toISTDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
        } else if (val === 'lastMonth') {
            start = toISTDate(new Date(now.getFullYear(), now.getMonth() - 1, 1));
            end = toISTDate(new Date(now.getFullYear(), now.getMonth(), 0));
        }

        if (val !== 'custom') {
            setDateStart(start);
            setDateEnd(end);
        }
    };

    const resetToToday = () => {
        setSearchTerm('');
        setStatusFilter('All');
        setDateStart(todayIST());
        setDateEnd(todayIST());
        setQuickSelect('today');
    };

    const isFiltered = searchTerm !== '' || statusFilter !== 'All' || quickSelect !== 'today';

    // ── Filter ─────────────────────────────────────────────────────────────
    const today = todayIST();

    const filteredItems = inquiries.filter(i => {
        const updated = i.updatedAt ?? i.inquiryDate;
        const updatedStr = new Date(updated).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        const matchesDate = updatedStr >= dateStart && updatedStr <= dateEnd;

        const q = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm ||
            i.studentName.toLowerCase().includes(q) ||
            i.inquiryId.toLowerCase().includes(q) ||
            (i.phone || '').includes(searchTerm) ||
            (i.parentName || '').toLowerCase().includes(q);

        const matchesStatus = statusFilter === 'All' || i.status === statusFilter;

        return matchesDate && matchesSearch && matchesStatus;
    });

    // ── Breakdown counts ───────────────────────────────────────────────────
    const counts = {
        total: filteredItems.length,
        active: filteredItems.filter(i => ['New', 'Follow-up'].includes(i.status)).length,
        converted: filteredItems.filter(i => i.status === 'Converted').length,
        overdue: filteredItems.filter(i => {
            if (!i.followUpDate || !['New', 'Follow-up'].includes(i.status)) return false;
            return new Date(i.followUpDate).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) < today;
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
                            Follow-ups
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

            {/* ── Filter bar ──────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-admin-border shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-3 items-start md:items-center flex-wrap">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search name, ID, phone…"
                        className="w-full pl-9 pr-4 py-2 text-sm border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-purple/30"
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setQuickSelect('custom'); }}
                    />
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                    <Filter size={15} className="text-gray-400 shrink-0" />
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="text-sm border border-admin-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-admin-purple/30"
                    >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Converted">Converted</option>
                        <option value="Casual Inquiry">Casual Inquiry</option>
                    </select>
                </div>

                {/* Quick date select + manual range */}
                <div className="flex items-center gap-2 flex-wrap">
                    <select
                        value={quickSelect}
                        onChange={e => handleQuickSelect(e.target.value)}
                        className="text-sm border border-admin-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-admin-purple/30"
                    >
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="thisWeek">This Week</option>
                        <option value="lastWeek">Last Week</option>
                        <option value="thisMonth">This Month</option>
                        <option value="lastMonth">Last Month</option>
                        <option value="custom">Custom…</option>
                    </select>

                    <Calendar size={15} className="text-gray-400 shrink-0" />

                    <input
                        type="date"
                        className="text-sm border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-purple/30"
                        value={dateStart}
                        onChange={e => { setDateStart(e.target.value); setQuickSelect('custom'); }}
                    />
                    <span className="text-gray-400 text-sm">–</span>
                    <input
                        type="date"
                        className="text-sm border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-purple/30"
                        value={dateEnd}
                        onChange={e => { setDateEnd(e.target.value); setQuickSelect('custom'); }}
                    />
                </div>

                {/* Reset to today */}
                {isFiltered && (
                    <button
                        onClick={resetToToday}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-admin-purple bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition shrink-0"
                    >
                        <X size={12} />
                        Reset to Today
                    </button>
                )}
            </div>

            {/* ── Stat chips ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-white rounded-xl border border-admin-border p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-admin-charcoal">{counts.total}</p>
                    <p className="text-xs text-admin-text-secondary mt-0.5">Matching</p>
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
            {filteredItems.length === 0 ? (
                <div className="bg-white rounded-2xl border border-admin-border p-16 text-center">
                    <CalendarClock size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-admin-text font-medium">No inquiries found</p>
                    <p className="text-sm text-admin-text-secondary mt-1">
                        Try adjusting your filters or date range.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-admin-border shadow-sm overflow-hidden flex flex-col">

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
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
                                    <th className="px-4 py-3 font-semibold text-admin-text-secondary text-xs uppercase tracking-wide text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredItems.map((item) => {
                                    const isOverdue = item.followUpDate &&
                                        ['New', 'Follow-up'].includes(item.status) &&
                                        new Date(item.followUpDate).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) < today;

                                    return (
                                        <tr
                                            key={`desktop-${item.id}`}
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
                                                    <span className={`flex items-center gap-1 text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-admin-text'
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
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={(e) => openModal(item, e)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-admin-purple text-white hover:bg-admin-purple-dark text-xs font-medium rounded-lg transition-colors shadow-sm"
                                                >
                                                    <Edit3 size={12} />
                                                    Log Call
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block md:hidden bg-gray-50 p-3 overflow-y-auto">
                        <div className="space-y-3">
                            {filteredItems.map((item) => {
                                const isOverdue = item.followUpDate &&
                                    ['New', 'Follow-up'].includes(item.status) &&
                                    new Date(item.followUpDate).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) < today;

                                return (
                                    <div
                                        key={`mobile-${item.id}`}
                                        onClick={() => router.push(`/inquiry/${item.inquiryId}`)}
                                        className="bg-white p-4 rounded-xl border border-admin-border shadow-sm active:scale-[0.99] transition-transform space-y-3"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-xs font-mono text-admin-text-secondary bg-gray-100 px-1.5 py-0.5 rounded mr-2">
                                                    {item.inquiryId}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[item.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            {item.followUpDate && (
                                                <div className={`flex items-center gap-1 text-xs font-medium ${isOverdue ? 'text-red-600 bg-red-50' : 'text-admin-text bg-gray-50'} px-2 py-1 rounded-md`}>
                                                    {isOverdue ? <AlertCircle size={12} /> : <Clock size={12} className={item.status === 'Converted' ? 'hidden' : 'text-amber-500'} />}
                                                    {fmtDate(item.followUpDate)}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-admin-charcoal text-[15px]">{item.studentName}</h3>
                                            <p className="text-sm text-admin-text-secondary">Class: {item.currentClass || '—'}</p>
                                        </div>

                                        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                                            <div className="flex items-center gap-1.5 text-admin-text-secondary truncate pr-3">
                                                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                                                    {(item.assignedTo || item.counselorName || '?').charAt(0).toUpperCase()}
                                                </span>
                                                <span className="truncate text-xs">
                                                    {item.assignedTo || item.counselorName || 'Unassigned'}
                                                </span>
                                            </div>

                                            {item.phone && (
                                                <a
                                                    href={`tel:${item.phone}`}
                                                    onClick={e => e.stopPropagation()}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-medium transition-colors shrink-0"
                                                >
                                                    <Phone size={12} />
                                                    Call
                                                </a>
                                            )}
                                        </div>

                                        <button
                                            onClick={(e) => openModal(item, e)}
                                            className="w-full flex items-center justify-center gap-2 py-2 mt-2 bg-admin-purple text-white hover:bg-admin-purple-dark text-sm font-medium rounded-lg transition-colors shadow-sm"
                                        >
                                            <Edit3 size={14} />
                                            Update Status & Log Call
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="px-4 py-3 border-t border-admin-border bg-gray-50 text-xs text-admin-text-secondary">
                        {filteredItems.length} {filteredItems.length === 1 ? 'inquiry' : 'inquiries'} found
                        · Last refreshed {lastRefreshed.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </div>
                </div>
            )}

            {/* ── Quick Action Modal ──────────────────────────────────────────────── */}
            {isModalOpen && selectedInquiry && (
                <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Update Inquiry</h3>
                                <p className="text-xs text-gray-500 font-mono mt-0.5">{selectedInquiry.inquiryId} • {selectedInquiry.studentName}</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleQuickUpdate} className="p-5 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Set Status</label>
                                <select
                                    value={modalStatus}
                                    onChange={(e) => setModalStatus(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-admin-border rounded-xl focus:ring-2 focus:ring-admin-purple outline-none appearance-none bg-white text-sm"
                                >
                                    <option value="New">New</option>
                                    <option value="Open">Open</option>
                                    <option value="Follow-up">Follow-up</option>
                                    <option value="Converted">Converted</option>
                                    <option value="Dropped">Dropped</option>
                                    <option value="Casual Inquiry">Casual Inquiry</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Next Follow-up Date</label>
                                <input
                                    type="date"
                                    value={modalDate}
                                    onChange={(e) => setModalDate(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-admin-border rounded-xl focus:ring-2 focus:ring-admin-purple outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Log Call / Comments</label>
                                <textarea
                                    value={modalComment}
                                    onChange={e => setModalComment(e.target.value)}
                                    placeholder="Briefly describe the call or interaction..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-admin-border rounded-xl focus:ring-2 focus:ring-admin-purple outline-none text-sm resize-none"
                                />
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 py-2.5 text-white bg-admin-purple hover:bg-admin-purple-dark rounded-xl font-medium text-sm transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {isUpdating ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
