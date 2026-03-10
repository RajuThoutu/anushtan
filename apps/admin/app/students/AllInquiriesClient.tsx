'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    Search,
    Filter,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Eye,
    MoreHorizontal,
    Download,
    User
} from 'lucide-react';
import { ExportButton } from '@/components/reports/ExportButton';

interface Inquiry {
    id: string;
    inquiryDate: string;
    studentName: string;
    currentClass: string;
    parentName: string;
    phone: string;
    status: string;
    counselorName: string;
    caseStatus: string;
    followUpDate?: string;
    lastUpdated?: string;
    // Extra fields for ExportButton
    inquiryId?: string;
    currentSchool?: string;
    board?: string;
    secondaryPhone?: string;
    email?: string;
    occupation?: string;
    educationGuide?: string;
    learningMethod?: string;
    teacherPreference?: string;
    childImportance?: string;
    schoolEnvironment?: string;
    dayScholarHostel?: string;
    howHeard?: string;
    source?: string;
    assignedTo?: string;
    priority?: string;
    notes?: string;
}

// Date helpers (IST-aware)
function getLast7DaysStart() {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}
function getTodayIST() {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

export default function AllInquiriesClient() {
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();
    const userRole = session?.user?.role ?? '';
    const isCounselor = userRole === 'counselor';

    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [totalCount, setTotalCount] = useState<number | null>(null); // all-time total
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState('');
    const [selectedInquiries, setSelectedInquiries] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [followUpDate, setFollowUpDate] = useState('');
    const [isSettingFollowUp, setIsSettingFollowUp] = useState(false);

    // Filters (date filters only for HR+)
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sourceFilter, setSourceFilter] = useState('All');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    /** Fast total count — single COUNT(*), no row data */
    const fetchTotalCount = async () => {
        try {
            const res = await fetch('/api/counselor/inquiries/count', { cache: 'no-store' });
            const data = await res.json();
            if (data.success) setTotalCount(data.count);
        } catch {}
    };

    /**
     * HR+: load last 7 days by default; pass explicit dateFrom/dateTo to override.
     * Counselors: pass { search } to run a text search.
     */
    const fetchInquiries = async (opts: { search?: string; dateFrom?: string; dateTo?: string } = {}) => {
        const { search, dateFrom, dateTo } = opts;
        const isSearch = !!search;
        if (isSearch) setSearching(true);
        try {
            let url: string;
            if (search) {
                url = `/api/counselor/inquiries?search=${encodeURIComponent(search)}`;
            } else {
                const from = dateFrom ?? getLast7DaysStart();
                const to   = dateTo   ?? getTodayIST();
                url = `/api/counselor/inquiries?dateFrom=${from}&dateTo=${to}`;
            }
            const response = await fetch(url, { cache: 'no-store' });
            const data = await response.json();
            if (data.success) {
                const sorted = [...data.data].sort((a: Inquiry, b: Inquiry) =>
                    new Date(b.inquiryDate).getTime() - new Date(a.inquiryDate).getTime()
                );
                setInquiries(sorted);
                if (isSearch) setHasSearched(true);
            } else {
                setError('Failed to load inquiries');
            }
        } catch {
            setError('An error occurred while fetching data');
        } finally {
            setLoading(false);
            setSearching(false);
        }
    };

    // On session resolve: fetch total count for everyone; load 7-day records for HR+
    useEffect(() => {
        if (sessionStatus === 'loading') return;
        fetchTotalCount();
        if (isCounselor) {
            setLoading(false); // counselors: search-first UI, no auto-load
        } else {
            fetchInquiries(); // HR+: last 7 days
        }
    }, [isCounselor, sessionStatus]);

    // HR+: re-fetch when custom date filters change
    useEffect(() => {
        if (sessionStatus === 'loading' || isCounselor) return;
        fetchInquiries({ dateFrom: dateStart || undefined, dateTo: dateEnd || undefined });
        setCurrentPage(1);
    }, [dateStart, dateEnd]);

    // Counselor: debounced search as they type
    useEffect(() => {
        if (!isCounselor || sessionStatus === 'loading') return;
        if (searchTerm.trim().length < 2) {
            if (hasSearched) { setInquiries([]); setHasSearched(false); }
            return;
        }
        const timer = setTimeout(() => {
            fetchInquiries({ search: searchTerm.trim() });
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm, isCounselor, sessionStatus]);

    // Source badge config
    const getSourceBadge = (source?: string) => {
        switch (source) {
            case 'Website':
                return { label: '🌐 Anushtan Website', className: 'bg-blue-50 text-blue-700 border-blue-200' };
            case 'WhatsApp':
                return { label: '💬 WhatsApp', className: 'bg-green-50 text-green-700 border-green-200' };
            case 'PhoneCall':
                return { label: '📞 Phone Call', className: 'bg-gray-100 text-gray-600 border-gray-200' };
            case 'PaperForm':
                return { label: '📄 Paper Form', className: 'bg-orange-50 text-orange-700 border-orange-200' };
            case 'Referral':
                return { label: '🤝 Referral', className: 'bg-purple-50 text-purple-700 border-purple-200' };
            case 'QRScan':
                return { label: '📷 QR Scan', className: 'bg-teal-50 text-teal-700 border-teal-200' };
            default:
                return { label: '➕ Other', className: 'bg-gray-100 text-gray-500 border-gray-200' };
        }
    };

    // Filter Logic
    const filteredInquiries = inquiries.filter(inq => {
        const matchesSearch =
            inq.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (inq.inquiryId || inq.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.phone.includes(searchTerm);

        const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;

        const matchesSource = sourceFilter === 'All' || (inq.source || 'Other') === sourceFilter;

        let matchesDate = true;
        if (dateStart && dateEnd) {
            const inqDateObj = new Date(inq.inquiryDate);
            const inqDateStr = inqDateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
            matchesDate = inqDateStr >= dateStart && inqDateStr <= dateEnd;
        }

        return matchesSearch && matchesStatus && matchesSource && matchesDate;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
    const paginatedInquiries = filteredInquiries.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800';
            case 'Open': return 'bg-indigo-100 text-indigo-800';
            case 'Follow-up': return 'bg-orange-100 text-orange-800';
            case 'Converted': return 'bg-green-100 text-green-800';
            case 'Casual Inquiry': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Summary Stats — Total uses all-time count; others computed from loaded 7-day window
    const stats = {
        total: totalCount ?? inquiries.length,
        today: inquiries.filter(i => new Date(i.inquiryDate).toDateString() === new Date().toDateString()).length,
        open: inquiries.filter(i => ['New', 'Follow-up'].includes(i.status)).length,
        converted: inquiries.filter(i => i.status === 'Converted').length,
        website: inquiries.filter(i => i.source === 'Website').length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-emerald"></div>
            </div>
        );
    }

    // Counselor: show search-only prompt before they've typed anything
    if (isCounselor && !hasSearched && searchTerm.trim().length < 2) {
        return (
            <div className="space-y-4">
                {/* Search bar */}
                <div className="bg-white rounded-xl border border-admin-border shadow-sm p-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by student name, phone, or ID..."
                            className="w-full pl-10 pr-3 py-2.5 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-emerald text-sm"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            autoFocus
                        />
                    </div>
                </div>
                {/* Empty prompt */}
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    {/* Total count badge */}
                    {totalCount !== null && (
                        <div className="mb-6 bg-admin-blue/5 border border-admin-blue/20 rounded-2xl px-6 py-3 flex items-center gap-3">
                            <span className="text-3xl font-bold text-admin-blue">{totalCount.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 leading-tight">total<br/>records</span>
                        </div>
                    )}
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="text-base font-semibold text-gray-700">Search to find a student</p>
                    <p className="text-sm text-gray-400 mt-1 max-w-xs">
                        Enter a name, phone number, or inquiry ID to cross-check existing records.
                    </p>
                    <p className="text-xs text-gray-400 mt-4">
                        To add a new inquiry, tap the <span className="font-semibold">+</span> button above.
                    </p>
                </div>
            </div>
        );
    }

    // HR, admin, and super_admin can bulk-select, delete, and set follow-up
    const canBulkAction = ['super_admin', 'admin', 'hr'].includes(session?.user?.role ?? '');

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedInquiries(new Set(paginatedInquiries.map(inq => inq.inquiryId || inq.id)));
        } else {
            setSelectedInquiries(new Set());
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        const next = new Set(selectedInquiries);
        if (checked) {
            next.add(id);
        } else {
            next.delete(id);
        }
        setSelectedInquiries(next);
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedInquiries.size} selected inquiries? They will be archived and can be restored by the super admin if needed.`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch('/api/counselor/inquiries/bulk-delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inquiryIds: Array.from(selectedInquiries) })
            });

            const data = await res.json();
            if (data.success) {
                alert(`Successfully deleted ${data.count} inquiries.`);
                setSelectedInquiries(new Set());
                fetchTotalCount();
                fetchInquiries({ dateFrom: dateStart || undefined, dateTo: dateEnd || undefined });
            } else {
                alert(data.error || 'Failed to delete inquiries');
            }
        } catch {
            alert('An error occurred during deletion.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleBulkFollowUp = async () => {
        if (!followUpDate) return;

        setIsSettingFollowUp(true);
        try {
            const res = await fetch('/api/counselor/inquiries/bulk-followup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inquiryIds: Array.from(selectedInquiries), followUpDate })
            });

            const data = await res.json();
            if (data.success) {
                alert(`Follow-up date set for ${data.count} inquiries.`);
                setSelectedInquiries(new Set());
                setShowFollowUpModal(false);
                setFollowUpDate('');
                fetchInquiries({ dateFrom: dateStart || undefined, dateTo: dateEnd || undefined });
            } else {
                alert(data.error || 'Failed to set follow-up date');
            }
        } catch {
            alert('An error occurred.');
        } finally {
            setIsSettingFollowUp(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Counselor: search results header */}
            {isCounselor && (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { setSearchTerm(''); setInquiries([]); setHasSearched(false); }}
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                        ← New search
                    </button>
                    <span className="text-sm text-gray-400">
                        {searching ? 'Searching...' : `${inquiries.length} result${inquiries.length !== 1 ? 's' : ''} for "${searchTerm}"`}
                    </span>
                </div>
            )}

            {/* Quick View Stats — hidden for counselors (search mode shows only results) */}
            {!isCounselor && (
                <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 md:mx-0 md:px-0 md:grid md:grid-cols-5 md:gap-4 scrollbar-hide">
                    <div className="bg-white p-4 rounded-xl border border-admin-border shadow-sm shrink-0 min-w-[130px] md:min-w-0">
                        <div className="text-xs text-gray-500 font-medium">Total</div>
                        <div className="text-2xl font-bold text-admin-text mt-1">{stats.total}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-admin-border shadow-sm shrink-0 min-w-[130px] md:min-w-0">
                        <div className="text-xs text-gray-500 font-medium">Today</div>
                        <div className="text-2xl font-bold text-admin-emerald mt-1">+{stats.today}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-admin-border shadow-sm shrink-0 min-w-[130px] md:min-w-0">
                        <div className="text-xs text-gray-500 font-medium">Open / Active</div>
                        <div className="text-2xl font-bold text-yellow-600 mt-1">{stats.open}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-admin-border shadow-sm shrink-0 min-w-[130px] md:min-w-0">
                        <div className="text-xs text-gray-500 font-medium">Converted</div>
                        <div className="text-2xl font-bold text-admin-blue mt-1">{stats.converted}</div>
                    </div>
                    <div
                        className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm cursor-pointer hover:bg-blue-100 transition-colors shrink-0 min-w-[130px] md:min-w-0"
                        onClick={() => setSourceFilter(sourceFilter === 'Website' ? 'All' : 'Website')}
                        title="Click to filter website inquiries"
                    >
                        <div className="text-xs text-blue-600 font-medium">🌐 Website</div>
                        <div className="text-2xl font-bold text-blue-700 mt-1">{stats.website}</div>
                    </div>
                </div>
            )}

            {/* Filters Bar */}
            <div className="bg-white rounded-xl border border-admin-border shadow-sm overflow-hidden">
                {/* Row 1: Search + Filter toggle (mobile) + Export */}
                <div className="flex gap-2 items-center p-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Name, ID, Phone..."
                            className="w-full pl-9 pr-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-emerald text-sm"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    {/* Mobile: Filter toggle button — HR+ only */}
                    {!isCounselor && (
                        <button
                            onClick={() => setShowMobileFilters(f => !f)}
                            className={`md:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors shrink-0 ${
                                (statusFilter !== 'All' || sourceFilter !== 'All' || dateStart)
                                    ? 'bg-admin-emerald/10 border-admin-emerald text-admin-emerald'
                                    : 'border-admin-border text-gray-500'
                            }`}
                        >
                            <Filter size={14} />
                            {(statusFilter !== 'All' || sourceFilter !== 'All' || dateStart) && (
                                <span className="w-1.5 h-1.5 rounded-full bg-admin-emerald" />
                            )}
                        </button>
                    )}
                    {!isCounselor && (
                        <div className="flex-shrink-0">
                            <ExportButton data={filteredInquiries} filename="All_Inquiries" />
                        </div>
                    )}
                </div>

                {/* Mobile: expandable filter panel — HR+ only */}
                {!isCounselor && showMobileFilters && (
                    <div className="md:hidden border-t border-admin-border p-3 space-y-2.5 bg-admin-bg/40">
                        <div className="grid grid-cols-2 gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="border border-admin-border rounded-lg px-2.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-admin-emerald"
                            >
                                <option value="All">All Statuses</option>
                                <option value="New">New</option>
                                <option value="Open">Open</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Converted">Converted</option>
                                <option value="Casual Inquiry">Casual</option>
                            </select>
                            <select
                                value={sourceFilter}
                                onChange={(e) => setSourceFilter(e.target.value)}
                                className="border border-admin-border rounded-lg px-2.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-admin-emerald"
                            >
                                <option value="All">All Sources</option>
                                <option value="Website">🌐 Website</option>
                                <option value="WhatsApp">💬 WhatsApp</option>
                                <option value="PhoneCall">📞 Phone</option>
                                <option value="PaperForm">📄 Paper</option>
                                <option value="Referral">🤝 Referral</option>
                                <option value="QRScan">📷 QR</option>
                                <option value="Other">➕ Other</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="date"
                                className="border border-admin-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-admin-emerald w-full"
                                value={dateStart}
                                onChange={(e) => setDateStart(e.target.value)}
                                placeholder="From"
                            />
                            <input
                                type="date"
                                className="border border-admin-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-admin-emerald w-full"
                                value={dateEnd}
                                onChange={(e) => setDateEnd(e.target.value)}
                                placeholder="To"
                            />
                        </div>
                        {(statusFilter !== 'All' || sourceFilter !== 'All' || dateStart) && (
                            <button
                                onClick={() => { setStatusFilter('All'); setSourceFilter('All'); setDateStart(''); setDateEnd(''); }}
                                className="text-xs text-red-500 font-medium"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}

                {/* Desktop: always-visible filter row — HR+ only */}
                <div className={`flex-wrap gap-2 items-center px-3 pb-3 ${isCounselor ? 'hidden' : 'hidden md:flex'}`}>
                    <div className="flex items-center gap-1.5">
                        <Filter size={15} className="text-gray-400 shrink-0" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-admin-border rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-admin-emerald"
                        >
                            <option value="All">All Statuses</option>
                            <option value="New">New</option>
                            <option value="Open">Open</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Converted">Converted</option>
                            <option value="Casual Inquiry">Casual Inquiry</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <select
                            value={sourceFilter}
                            onChange={(e) => setSourceFilter(e.target.value)}
                            className="border border-admin-border rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-admin-emerald"
                        >
                            <option value="All">All Sources</option>
                            <option value="Website">🌐 Website</option>
                            <option value="WhatsApp">💬 WhatsApp</option>
                            <option value="PhoneCall">📞 Phone Call</option>
                            <option value="PaperForm">📄 Paper Form</option>
                            <option value="Referral">🤝 Referral</option>
                            <option value="QRScan">📷 QR Scan</option>
                            <option value="Other">➕ Other</option>
                        </select>
                    </div>

                    <select
                        className="border border-admin-border rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-admin-emerald"
                        onChange={(e) => {
                            const val = e.target.value;
                            const today = new Date();
                            let start = '';
                            let end = '';
                            if (val === 'today') {
                                start = end = today.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                            } else if (val === 'yesterday') {
                                const y = new Date(today);
                                y.setDate(today.getDate() - 1);
                                start = end = y.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                            } else if (val === 'thisWeek') {
                                const d = new Date(today);
                                const day = d.getDay();
                                const diff = d.getDate() - day + (day === 0 ? -6 : 1);
                                const monday = new Date(d.setDate(diff));
                                const sunday = new Date(d.setDate(monday.getDate() + 6));
                                start = monday.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                                end = sunday.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                            } else if (val === 'lastWeek') {
                                const d = new Date(today);
                                const day = d.getDay();
                                const diff = d.getDate() - day + (day === 0 ? -6 : 1) - 7;
                                const monday = new Date(d.setDate(diff));
                                const sunday = new Date(d.setDate(monday.getDate() + 6));
                                start = monday.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                                end = sunday.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                            } else if (val === 'thisMonth') {
                                start = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                                end = new Date(today.getFullYear(), today.getMonth() + 1, 0).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                            } else if (val === 'lastMonth') {
                                start = new Date(today.getFullYear(), today.getMonth() - 1, 1).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                                end = new Date(today.getFullYear(), today.getMonth(), 0).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                            }
                            if (val !== 'custom') { setDateStart(start); setDateEnd(end); }
                        }}
                    >
                        <option value="custom">Quick Date...</option>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="thisWeek">This Week</option>
                        <option value="lastWeek">Last Week</option>
                        <option value="thisMonth">This Month</option>
                        <option value="lastMonth">Last Month</option>
                    </select>

                    <div className="flex items-center gap-1.5">
                        <Calendar size={15} className="text-gray-400 shrink-0" />
                        <input
                            type="date"
                            className="border border-admin-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-admin-emerald w-[130px]"
                            value={dateStart}
                            onChange={(e) => setDateStart(e.target.value)}
                        />
                        <span className="text-gray-400 text-sm">–</span>
                        <input
                            type="date"
                            className="border border-admin-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-admin-emerald w-[130px]"
                            value={dateEnd}
                            onChange={(e) => setDateEnd(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Bulk Actions */}
            {canBulkAction && selectedInquiries.size > 0 && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center justify-between gap-4 flex-wrap">
                    <span className="text-amber-800 font-medium">
                        {selectedInquiries.size} {selectedInquiries.size === 1 ? 'inquiry' : 'inquiries'} selected
                    </span>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowFollowUpModal(true)}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                        >
                            Send to Follow-up
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            disabled={isDeleting}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            )}

            {/* Follow-up Date Modal */}
            {showFollowUpModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Set Follow-up Date</h3>
                        <p className="text-sm text-gray-500 mb-5">
                            Choose a date for all {selectedInquiries.size} selected {selectedInquiries.size === 1 ? 'inquiry' : 'inquiries'}.
                            Status will be updated to <span className="font-medium text-orange-600">Follow-up</span>.
                        </p>
                        <input
                            type="date"
                            value={followUpDate}
                            onChange={e => setFollowUpDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400 mb-5"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowFollowUpModal(false); setFollowUpDate(''); }}
                                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBulkFollowUp}
                                disabled={!followUpDate || isSettingFollowUp}
                                className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
                            >
                                {isSettingFollowUp ? 'Saving...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl border border-admin-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4 p-4">
                        {paginatedInquiries.length > 0 ? (
                            paginatedInquiries.map((inq) => (
                                <div key={inq.id} className="bg-white p-4 rounded-xl border border-admin-border shadow-sm flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            {canBulkAction && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedInquiries.has(inq.inquiryId || inq.id)}
                                                    onChange={e => handleSelectOne(inq.inquiryId || inq.id, e.target.checked)}
                                                    className="mr-3 rounded border-gray-300 text-admin-emerald focus:ring-admin-emerald"
                                                />
                                            )}
                                            <div className="inline-block font-semibold text-admin-text">{inq.studentName}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{inq.currentClass}</div>
                                            {inq.source && (
                                                <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getSourceBadge(inq.source).className}`}>
                                                    {getSourceBadge(inq.source).label}
                                                </span>
                                            )}
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inq.status)}`}>
                                            {inq.status}
                                        </span>
                                    </div>

                                    {(inq.status === 'Open' || inq.status === 'Follow-up') && (inq.assignedTo || inq.counselorName) && (
                                        <div className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-0.5 w-fit mb-1">
                                            <User size={12} className="text-indigo-500" />
                                            <span className="font-medium">{inq.assignedTo || inq.counselorName}</span>
                                        </div>
                                    )}

                                    <div className="text-sm text-gray-600 flex items-center gap-2">
                                        <span>📞 {inq.phone}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                                        <div className="text-xs text-gray-400">
                                            ID: {inq.inquiryId || inq.id} • {new Date(inq.inquiryDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                                        </div>
                                        <button
                                            onClick={() => router.push(`/inquiry/${inq.inquiryId || inq.id}`)}
                                            className="text-admin-emerald text-sm font-medium hover:underline"
                                        >
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No inquiries found matching your filters.
                            </div>
                        )}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-admin-bg border-b border-admin-border">
                                    {canBulkAction && (
                                        <th className="px-6 py-4 w-12 text-center">
                                            <input
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={paginatedInquiries.length > 0 && selectedInquiries.size === paginatedInquiries.length}
                                                className="rounded border-gray-300 text-admin-emerald focus:ring-admin-emerald"
                                            />
                                        </th>
                                    )}
                                    <th className="px-6 py-4 font-semibold text-admin-text text-sm">ID / Date</th>
                                    <th className="px-6 py-4 font-semibold text-admin-text text-sm">Student / Grade</th>
                                    <th className="px-6 py-4 font-semibold text-admin-text text-sm">Contact</th>
                                    <th className="px-6 py-4 font-semibold text-admin-text text-sm">Status</th>
                                    <th className="px-6 py-4 font-semibold text-admin-text text-sm">Counselor</th>
                                    <th className="px-6 py-4 font-semibold text-admin-text text-sm">Assessment</th>
                                    <th className="px-6 py-4 font-semibold text-admin-text text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-admin-border">
                                {paginatedInquiries.length > 0 ? (
                                    paginatedInquiries.map((inq) => (
                                        <tr key={inq.id} className="hover:bg-gray-50 transition-colors">
                                            {canBulkAction && (
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedInquiries.has(inq.inquiryId || inq.id)}
                                                        onChange={e => handleSelectOne(inq.inquiryId || inq.id, e.target.checked)}
                                                        className="rounded border-gray-300 text-admin-emerald focus:ring-admin-emerald"
                                                    />
                                                </td>
                                            )}
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-admin-text">{inq.inquiryId || inq.id}</div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(inq.inquiryDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'short', day: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-admin-text">{inq.studentName}</div>
                                                <div className="text-xs text-gray-500">{inq.currentClass}</div>
                                                {inq.source && (
                                                    <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getSourceBadge(inq.source).className}`}>
                                                        {getSourceBadge(inq.source).label}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <div>{inq.phone}</div>
                                                <div className="text-xs text-gray-400">{inq.parentName}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inq.status)}`}>
                                                    {inq.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {inq.assignedTo || inq.counselorName || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {inq.followUpDate ? (
                                                    <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100 w-fit">
                                                        <Calendar size={12} />
                                                        {new Date(inq.followUpDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => router.push(`/inquiry/${inq.inquiryId || inq.id}`)}
                                                    className="p-2 text-gray-400 hover:text-admin-emerald hover:bg-admin-emerald/10 rounded-full transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={canBulkAction ? 8 : 7} className="px-6 py-12 text-center text-gray-500">
                                            No inquiries found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>

                {/* Pagination — outside overflow-x-auto so it's always fully visible */}
                {filteredInquiries.length > itemsPerPage && (
                    <div className="px-4 sm:px-6 py-4 border-t border-admin-border bg-gray-50 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm text-gray-500">
                            Showing{' '}
                            <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                            {' '}–{' '}
                            <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredInquiries.length)}</span>
                            {' '}of{' '}
                            <span className="font-medium">{filteredInquiries.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-admin-border rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-sm font-medium text-gray-600 min-w-[52px] text-center">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-admin-border rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
