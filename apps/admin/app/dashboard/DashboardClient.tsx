'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { InquiryTabs, type Tab } from '@/components/dashboard/InquiryTabs';
import { InquiryFilters, type FilterState } from '@/components/dashboard/InquiryFilters';
import { InquiryList } from '@/components/dashboard/InquiryList';
import { InquiryDetailPanel, type CounselorUpdates } from '@/components/dashboard/InquiryDetailPanel';
import type { SheetInquiry as Inquiry } from '@repo/database';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/** Build date params for the API based on which tab is active.
 *  Filters all happen server-side — only relevant records come over the wire. */
function getTabDateRange(tab: Tab, filters: FilterState): { dateFrom: string; dateTo: string } {
    // If the user manually set a date range, honour it
    if (filters.dateFrom || filters.dateTo) {
        return { dateFrom: filters.dateFrom, dateTo: filters.dateTo };
    }
    const today = new Date();
    const todayIST = today.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    if (tab === 'today') {
        return { dateFrom: todayIST, dateTo: todayIST };
    }
    if (tab === 'all') {
        // This week Mon–Sun in IST
        const day = today.getDay();
        const diffToMonday = day === 0 ? -6 : 1 - day;
        const monday = new Date(today);
        monday.setDate(today.getDate() + diffToMonday);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        return {
            dateFrom: monday.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }),
            dateTo:   sunday.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }),
        };
    }
    // 'mywork' — last 30 days (covers realistic counselor caseload)
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return {
        dateFrom: thirtyDaysAgo.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }),
        dateTo: todayIST,
    };
}

export default function DashboardClient() {
    const { data: session } = useSession();
    const router = useRouter();
    const userRole = session?.user?.role ?? '';
    const isCounselor = userRole === 'counselor';
    const [activeTab, setActiveTab] = useState<Tab>('today');
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        status: '',
        priority: '',
        dateFrom: '',
        dateTo: '',
    });
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [totalDbCount, setTotalDbCount] = useState<number | null>(null); // all-time total from DB
    const [loading, setLoading] = useState(true);       // initial full-page spinner
    const [tabLoading, setTabLoading] = useState(false); // subtle per-tab refresh indicator
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const userName = session?.user?.name || '';

    // Fetch total count once for the "All Inquiries" tab badge
    useEffect(() => {
        fetch('/api/counselor/inquiries/count', { cache: 'no-store' })
            .then(r => r.json())
            .then(d => { if (d.success) setTotalDbCount(d.count); })
            .catch(() => {});
    }, []);

    const fetchInquiries = async (tab: Tab = activeTab, searchOverride?: string) => {
        setTabLoading(true);
        try {
            const searchTerm = searchOverride !== undefined ? searchOverride : filters.search;
            let url: string;
            if (searchTerm.trim().length >= 2) {
                // Search mode: query ALL records server-side (no date cap)
                url = `/api/counselor/inquiries?search=${encodeURIComponent(searchTerm.trim())}`;
            } else {
                const { dateFrom, dateTo } = getTabDateRange(tab, filters);
                const params = new URLSearchParams();
                if (dateFrom) params.set('dateFrom', dateFrom);
                if (dateTo)   params.set('dateTo',   dateTo);
                const qs = params.toString();
                url = `/api/counselor/inquiries${qs ? '?' + qs : ''}`;
            }
            const response = await fetch(url, { cache: 'no-store' });
            const data = await response.json();
            if (data.success) setInquiries(data.data || []);
        } catch (error) {
            console.error('Failed to fetch inquiries:', error);
        } finally {
            setLoading(false);
            setTabLoading(false);
        }
    };

    // Re-fetch when tab changes or on mount; auto-refresh every 90 s
    useEffect(() => {
        if (isCounselor) { setLoading(false); return; }
        fetchInquiries(activeTab);
        const interval = setInterval(() => fetchInquiries(activeTab), 90000);
        return () => clearInterval(interval);
    }, [isCounselor, activeTab]);

    // Re-fetch when custom date filters change (server needs to widen/narrow the window)
    useEffect(() => {
        if (isCounselor) return;
        fetchInquiries(activeTab);
    }, [filters.dateFrom, filters.dateTo]);

    // Re-fetch when search term changes — debounced; clears to normal tab data when empty
    useEffect(() => {
        if (isCounselor) return;
        const term = filters.search.trim();
        if (term.length === 0) {
            // Search cleared: reload normal date-range data for current tab
            fetchInquiries(activeTab, '');
            return;
        }
        if (term.length < 2) return; // wait for ≥2 chars
        const timer = setTimeout(() => fetchInquiries(activeTab, term), 400);
        return () => clearTimeout(timer);
    }, [filters.search, isCounselor]);

    // Filter inquiries based on tab and filters
    const filteredInquiries = useMemo(() => {
        const isSearchActive = filters.search.trim().length >= 2;

        // If active tab is "Today", strictly ignore all other user filters
        if (activeTab === 'today') {
            const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
            return inquiries.filter(inq => {
                const inqDateObj = new Date(inq.inquiryDate || inq.createdAt);
                const dayString = inqDateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                return dayString === todayStr;
            });
        }

        let result = [...inquiries];

        // If date filters are set, use them instead of tab filter
        const hasDateFilter = filters.dateFrom || filters.dateTo;

        if (!hasDateFilter && !isSearchActive) {
            // No search, no custom date — apply tab-level date filter
            if (activeTab === 'mywork') {
                result = result.filter(inq => inq.assignedTo === userName || inq.activityLog?.[0]?.counselorName === userName);
            } else if (activeTab === 'all') {
                // Default to this week for the All tab
                const today = new Date();
                const day = today.getDay();
                const diffToMonday = day === 0 ? -6 : 1 - day;
                const monday = new Date(today);
                monday.setDate(today.getDate() + diffToMonday);
                const sunday = new Date(monday);
                sunday.setDate(monday.getDate() + 6);
                const weekStart = monday.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                const weekEnd = sunday.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                result = result.filter(inq => {
                    const dayString = new Date(inq.inquiryDate || inq.createdAt).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                    return dayString >= weekStart && dayString <= weekEnd;
                });
            }
        } else if (!isSearchActive) {
            // Custom date active but no search — still apply "My Work" filter if on that tab
            if (activeTab === 'mywork') {
                result = result.filter(inq => inq.assignedTo === userName || inq.activityLog?.[0]?.counselorName === userName);
            }
        }
        // isSearchActive: skip all date filters — server already returned all-time matches

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(inq =>
                inq.studentName?.toLowerCase().includes(searchLower) ||
                inq.parentName?.toLowerCase().includes(searchLower) ||
                inq.phone?.includes(filters.search) ||
                inq.id?.toLowerCase().includes(searchLower)
            );
        }

        // Status filter
        if (filters.status) {
            result = result.filter(inq => inq.status === filters.status);
        }

        // Priority filter
        if (filters.priority) {
            result = result.filter(inq => inq.priority === filters.priority);
        }

        // Date range filter
        if (filters.dateFrom) {
            result = result.filter(inq => {
                const inqDateObj = new Date(inq.inquiryDate || inq.createdAt);
                const dayString = inqDateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                return dayString >= filters.dateFrom;
            });
        }
        if (filters.dateTo) {
            result = result.filter(inq => {
                const inqDateObj = new Date(inq.inquiryDate || inq.createdAt);
                const dayString = inqDateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                return dayString <= filters.dateTo;
            });
        }

        return result;
    }, [inquiries, activeTab, filters, userName]);

    // Reset to page 1 whenever filters/tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, filters]);

    const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / itemsPerPage));
    const paginatedInquiries = filteredInquiries.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Count for tabs
    const todayCount = useMemo(() => {
        const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        return inquiries.filter(inq => {
            const inqDateObj = new Date(inq.inquiryDate || inq.createdAt);
            const dayString = inqDateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
            return dayString === todayStr;
        }).length;
    }, [inquiries]);

    const myWorkCount = useMemo(() => {
        return inquiries.filter(inq => inq.assignedTo === userName || inq.activityLog?.[0]?.counselorName === userName).length;
    }, [inquiries, userName]);

    // "All Inquiries" tab shows total DB count so users can see 250+ even when only 7-day records are loaded
    const allCount = totalDbCount ?? inquiries.length;

    // Handle save
    const handleSave = async (id: string, updates: CounselorUpdates) => {
        try {
            const response = await fetch('/api/counselor/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    ...updates,
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to save');
            }
        } catch (error) {
            console.error('DashboardClient: Error in handleSave:', error);
            throw error;
        }

        // Refresh inquiries
        await fetchInquiries();

        // Update selected inquiry if it's the same
        if (selectedInquiry?.id === id) {
            const updated = inquiries.find(inq => inq.id === id);
            if (updated) {
                setSelectedInquiry(updated);
            }
        }
    };

    // Counselor: search state
    const [counselorSearch, setCounselorSearch] = useState('');
    const [counselorResults, setCounselorResults] = useState<Inquiry[]>([]);
    const [counselorSearching, setCounselorSearching] = useState(false);
    const [counselorHasSearched, setCounselorHasSearched] = useState(false);

    useEffect(() => {
        if (!isCounselor) return;
        if (counselorSearch.trim().length < 2) {
            setCounselorResults([]);
            setCounselorHasSearched(false);
            return;
        }
        const timer = setTimeout(async () => {
            setCounselorSearching(true);
            try {
                const res = await fetch(`/api/counselor/inquiries?search=${encodeURIComponent(counselorSearch.trim())}`, { cache: 'no-store' });
                const data = await res.json();
                if (data.success) {
                    setCounselorResults(data.data);
                    setCounselorHasSearched(true);
                }
            } finally {
                setCounselorSearching(false);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [counselorSearch, isCounselor]);

    if (isCounselor) {
        return (
            <DashboardLayout>
                <div className="h-full flex flex-col overflow-hidden">
                    {/* Counselor: search-first view */}
                    {!counselorHasSearched ? (
                        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center gap-6">
                            <div>
                                <p className="text-xl font-bold text-gray-800">Welcome back!</p>
                                <p className="text-sm text-gray-500 mt-1">Use the <span className="font-semibold">+</span> button to capture a new lead.</p>
                            </div>
                            <div className="w-full max-w-sm">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Search student name, phone, ID..."
                                        className="w-full pl-10 pr-4 py-3 border border-admin-border rounded-xl focus:outline-none focus:ring-2 focus:ring-admin-emerald text-sm shadow-sm"
                                        value={counselorSearch}
                                        onChange={(e) => setCounselorSearch(e.target.value)}
                                    />
                                </div>
                                {counselorSearching && (
                                    <p className="text-xs text-gray-400 mt-2">Searching...</p>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 max-w-xs">
                                Cross-check existing records by entering a student name, phone number, or inquiry ID.
                            </p>
                        </div>
                    ) : (
                        <div className="flex-1 min-h-0 flex flex-col">
                            {/* Search bar + back */}
                            <div className="px-4 pt-4 pb-2 flex items-center gap-3 bg-white border-b border-admin-border">
                                <button
                                    onClick={() => { setCounselorSearch(''); setCounselorResults([]); setCounselorHasSearched(false); }}
                                    className="text-sm text-gray-500 hover:text-gray-700 shrink-0"
                                >
                                    ← Back
                                </button>
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full pl-9 pr-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-emerald text-sm"
                                        value={counselorSearch}
                                        onChange={(e) => setCounselorSearch(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <span className="text-xs text-gray-400 shrink-0">
                                    {counselorSearching ? 'Searching...' : `${counselorResults.length} found`}
                                </span>
                            </div>
                            {/* Results */}
                            <div className="flex-1 overflow-auto">
                                <InquiryList
                                    inquiries={counselorResults}
                                    selectedId={selectedInquiry?.id ?? null}
                                    onSelect={setSelectedInquiry}
                                    loading={counselorSearching}
                                />
                            </div>
                        </div>
                    )}

                    {/* Detail panel for counselor */}
                    {selectedInquiry && (
                        <div className="lg:hidden fixed inset-0 z-50 bg-white">
                            <InquiryDetailPanel
                                inquiry={selectedInquiry}
                                onClose={() => setSelectedInquiry(null)}
                                onSave={handleSave}
                            />
                        </div>
                    )}
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="h-full flex flex-col lg:flex-row relative overflow-hidden">
                {/* Main Content Area */}
                <div className={`flex-1 min-h-0 flex flex-col min-w-0 ${selectedInquiry ? 'hidden lg:flex lg:w-1/2' : 'w-full'}`}>
                    {/* Tabs */}
                    <InquiryTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        todayCount={todayCount}
                        myWorkCount={myWorkCount}
                        allCount={allCount}
                    />

                    {/* Filters - Hidden on Today tab as it intrinsically filters by date */}
                    {activeTab !== 'today' && (
                        <InquiryFilters
                            filters={filters}
                            onFilterChange={setFilters}
                        />
                    )}

                    {/* List */}
                    <div className="flex-1 min-h-0 bg-white overflow-hidden flex flex-col">
                        <InquiryList
                            inquiries={paginatedInquiries}
                            selectedId={selectedInquiry?.id || null}
                            onSelect={setSelectedInquiry}
                            loading={loading || tabLoading}
                        />

                        {/* Pagination */}
                        {!loading && filteredInquiries.length > itemsPerPage && (
                            <div className="shrink-0 border-t border-anushtan-border bg-gray-50 px-4 py-3 flex items-center justify-between gap-3">
                                <span className="text-xs text-gray-500">
                                    {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredInquiries.length)} of {filteredInquiries.length}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <span className="text-xs font-medium text-gray-600 min-w-[40px] text-center">
                                        {currentPage}/{totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail Panel - Full screen on mobile, side panel on desktop */}
                {selectedInquiry && (
                    <>
                        {/* Mobile: Full screen overlay */}
                        <div className="lg:hidden fixed inset-0 z-50 bg-white">
                            <InquiryDetailPanel
                                inquiry={selectedInquiry}
                                onClose={() => setSelectedInquiry(null)}
                                onSave={handleSave}
                            />
                        </div>

                        {/* Desktop: Side panel */}
                        <div className="hidden lg:block lg:w-1/2 xl:w-2/5 border-l border-anushtan-border h-full overflow-hidden">
                            <InquiryDetailPanel
                                inquiry={selectedInquiry}
                                onClose={() => setSelectedInquiry(null)}
                                onSave={handleSave}
                            />
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
