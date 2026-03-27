'use client';

import { useState } from 'react';
import { Phone, ChevronDown, ChevronRight, AlertCircle, Clock, CheckCircle2, RefreshCw } from 'lucide-react';

/** YYYY-MM-DD in IST */
function todayIST(): string {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

function fmtDateTime(iso: string) {
    return new Date(iso).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric', month: 'short',
        hour: 'numeric', minute: '2-digit', hour12: true,
    });
}

function fmtStatus(s: string | null) {
    if (!s) return '—';
    if (s === 'FollowUp') return 'Follow-up';
    if (s === 'CasualInquiry') return 'Casual Inquiry';
    return s;
}

interface CallEntry {
    inquiryId: string;
    studentName: string;
    loggedAt: string;
    comments: string | null;
    wasOverdue: boolean;
    newStatus: string | null;
}

interface CounselorRow {
    counselorName: string;
    totalCalls: number;
    uniqueInquiries: number;
    overdueHandled: number;
    calls: CallEntry[];
}

export function FollowUpActivityClient() {
    const today = todayIST();
    const [dateFrom, setDateFrom] = useState(today);
    const [dateTo, setDateTo] = useState(today);
    const [data, setData] = useState<CounselorRow[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    const fetchReport = async () => {
        setLoading(true);
        setError('');
        setExpanded(new Set());
        try {
            const res = await fetch(`/api/reports/followup-activity?dateFrom=${dateFrom}&dateTo=${dateTo}`);
            const json = await res.json();
            if (json.success) {
                setData(json.data);
            } else {
                setError(json.error || 'Failed to load report');
            }
        } catch {
            setError('Network error — please try again');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (name: string) => {
        setExpanded(prev => {
            const next = new Set(prev);
            next.has(name) ? next.delete(name) : next.add(name);
            return next;
        });
    };

    const totalCalls = data?.reduce((s, r) => s + r.totalCalls, 0) ?? 0;
    const totalInquiries = data?.reduce((s, r) => s + r.uniqueInquiries, 0) ?? 0;
    const totalOverdue = data?.reduce((s, r) => s + r.overdueHandled, 0) ?? 0;

    return (
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <Phone className="text-admin-purple" size={22} />
                    <h1 className="font-heading text-2xl font-bold text-admin-charcoal">Follow-up Call Activity</h1>
                </div>
                <p className="text-sm text-admin-text-secondary">
                    Tracks calls logged from the Follow-ups tab only — shows who attended, how many, and overdue follow-ups handled.
                </p>
            </div>

            {/* Date range + run */}
            <div className="bg-white border border-admin-border rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-end">
                <div>
                    <label className="block text-xs font-semibold text-admin-text-secondary mb-1">From</label>
                    <input
                        type="date"
                        value={dateFrom}
                        max={dateTo}
                        onChange={e => setDateFrom(e.target.value)}
                        className="px-3 py-2 border border-admin-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-admin-purple/30"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-admin-text-secondary mb-1">To</label>
                    <input
                        type="date"
                        value={dateTo}
                        min={dateFrom}
                        max={today}
                        onChange={e => setDateTo(e.target.value)}
                        className="px-3 py-2 border border-admin-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-admin-purple/30"
                    />
                </div>
                <button
                    onClick={fetchReport}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2 bg-admin-purple text-white rounded-lg text-sm font-semibold hover:bg-admin-purple-dark transition disabled:opacity-50"
                >
                    {loading ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    Run Report
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">{error}</div>
            )}

            {/* Results */}
            {data !== null && (
                <>
                    {/* Summary chips */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-white border border-admin-border rounded-xl p-4 text-center shadow-sm">
                            <p className="text-2xl font-bold text-admin-charcoal">{totalCalls}</p>
                            <p className="text-xs text-admin-text-secondary mt-0.5">Total Calls Logged</p>
                        </div>
                        <div className="bg-white border border-admin-border rounded-xl p-4 text-center shadow-sm">
                            <p className="text-2xl font-bold text-indigo-600">{totalInquiries}</p>
                            <p className="text-xs text-admin-text-secondary mt-0.5">Unique Inquiries Attended</p>
                        </div>
                        <div className="bg-white border border-admin-border rounded-xl p-4 text-center shadow-sm">
                            <p className="text-2xl font-bold text-red-500">{totalOverdue}</p>
                            <p className="text-xs text-admin-text-secondary mt-0.5">Overdue Follow-ups Handled</p>
                        </div>
                    </div>

                    {data.length === 0 ? (
                        <div className="bg-white border border-admin-border rounded-2xl p-16 text-center">
                            <Phone size={36} className="mx-auto text-gray-300 mb-3" />
                            <p className="font-medium text-admin-text">No follow-up calls found</p>
                            <p className="text-sm text-admin-text-secondary mt-1">
                                No calls were logged from the Follow-ups tab in this date range.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white border border-admin-border rounded-2xl shadow-sm overflow-hidden">
                            {/* Summary table */}
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-admin-border text-left">
                                        <th className="px-4 py-3 w-8" />
                                        <th className="px-4 py-3 font-semibold text-admin-text-secondary text-xs uppercase tracking-wide">Counselor</th>
                                        <th className="px-4 py-3 font-semibold text-admin-text-secondary text-xs uppercase tracking-wide text-center">Calls Logged</th>
                                        <th className="px-4 py-3 font-semibold text-admin-text-secondary text-xs uppercase tracking-wide text-center">Unique Inquiries</th>
                                        <th className="px-4 py-3 font-semibold text-admin-text-secondary text-xs uppercase tracking-wide text-center">Overdue Handled</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {data.map(row => (
                                        <>
                                            <tr
                                                key={row.counselorName}
                                                onClick={() => toggleExpand(row.counselorName)}
                                                className="hover:bg-purple-50/40 cursor-pointer transition-colors"
                                            >
                                                <td className="px-4 py-3 text-gray-400">
                                                    {expanded.has(row.counselorName)
                                                        ? <ChevronDown size={16} />
                                                        : <ChevronRight size={16} />
                                                    }
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-admin-charcoal">{row.counselorName}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                                                        <Phone size={11} />
                                                        {row.totalCalls}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center text-indigo-700 font-semibold">{row.uniqueInquiries}</td>
                                                <td className="px-4 py-3 text-center">
                                                    {row.overdueHandled > 0 ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-bold">
                                                            <AlertCircle size={11} />
                                                            {row.overdueHandled}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                            {expanded.has(row.counselorName) && (
                                                <tr key={`${row.counselorName}-detail`}>
                                                    <td colSpan={5} className="p-0">
                                                        <div className="bg-gray-50 border-t border-admin-border">
                                                            <table className="w-full text-xs">
                                                                <thead>
                                                                    <tr className="border-b border-gray-200 text-left">
                                                                        <th className="pl-12 pr-4 py-2 font-semibold text-gray-500 uppercase tracking-wide">Inquiry</th>
                                                                        <th className="px-4 py-2 font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                                                                        <th className="px-4 py-2 font-semibold text-gray-500 uppercase tracking-wide">Logged At</th>
                                                                        <th className="px-4 py-2 font-semibold text-gray-500 uppercase tracking-wide">Status Set</th>
                                                                        <th className="px-4 py-2 font-semibold text-gray-500 uppercase tracking-wide">Note</th>
                                                                        <th className="px-4 py-2 font-semibold text-gray-500 uppercase tracking-wide">Overdue?</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-gray-100">
                                                                    {row.calls.map((call, i) => (
                                                                        <tr key={i} className="hover:bg-white transition-colors">
                                                                            <td className="pl-12 pr-4 py-2 font-mono text-gray-500">{call.inquiryId}</td>
                                                                            <td className="px-4 py-2 font-medium text-admin-charcoal">{call.studentName}</td>
                                                                            <td className="px-4 py-2 text-gray-500">{fmtDateTime(call.loggedAt)}</td>
                                                                            <td className="px-4 py-2 text-gray-600">{fmtStatus(call.newStatus)}</td>
                                                                            <td className="px-4 py-2 text-gray-600 max-w-xs truncate">
                                                                                {call.comments || <span className="italic text-gray-400">—</span>}
                                                                            </td>
                                                                            <td className="px-4 py-2">
                                                                                {call.wasOverdue ? (
                                                                                    <span className="flex items-center gap-1 text-red-600 font-semibold">
                                                                                        <AlertCircle size={12} /> Yes
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="flex items-center gap-1 text-emerald-600">
                                                                                        <CheckCircle2 size={12} /> On time
                                                                                    </span>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
