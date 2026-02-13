'use client';

import { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { InquiryTabs, type Tab } from '@/components/dashboard/InquiryTabs';
import { InquiryFilters, type FilterState } from '@/components/dashboard/InquiryFilters';
import { InquiryList } from '@/components/dashboard/InquiryList';
import { InquiryDetailPanel, type CounselorUpdates } from '@/components/dashboard/InquiryDetailPanel';
import type { SheetInquiry as Inquiry } from '@repo/database';
import { useSession } from 'next-auth/react';

export default function DashboardClient() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<Tab>('today');
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        status: '',
        priority: '',
        dateFrom: '',
        dateTo: '',
    });
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

    const userName = session?.user?.name || '';

    // Fetch inquiries
    useEffect(() => {
        fetchInquiries();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchInquiries, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchInquiries = async () => {
        try {
            const response = await fetch('/api/counselor/inquiries');
            const data = await response.json();
            if (data.success) {
                setInquiries(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter inquiries based on tab and filters
    const filteredInquiries = useMemo(() => {
        let result = [...inquiries];

        // If date filters are set, use them instead of tab filter
        const hasDateFilter = filters.dateFrom || filters.dateTo;

        // Tab filter (only if no date filters are active)
        if (!hasDateFilter) {
            if (activeTab === 'today') {
                const today = new Date().toDateString();
                result = result.filter(inq => {
                    const inquiryDate = new Date(inq.inquiryDate || inq.timestamp);
                    return inquiryDate.toDateString() === today;
                });
            } else if (activeTab === 'mywork') {
                result = result.filter(inq => inq.counselorName === userName);
            }
            // 'all' tab shows everything, no filter
        } else {
            // If date filters are active, still apply "My Work" filter if on that tab
            if (activeTab === 'mywork') {
                result = result.filter(inq => inq.counselorName === userName);
            }
        }

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
            const fromDate = new Date(filters.dateFrom);
            result = result.filter(inq => {
                const inquiryDate = new Date(inq.inquiryDate || inq.timestamp);
                return inquiryDate >= fromDate;
            });
        }
        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999);
            result = result.filter(inq => {
                const inquiryDate = new Date(inq.inquiryDate || inq.timestamp);
                return inquiryDate <= toDate;
            });
        }

        return result;
    }, [inquiries, activeTab, filters, userName]);

    // Count for tabs
    const todayCount = useMemo(() => {
        const today = new Date().toDateString();
        return inquiries.filter(inq => {
            const inquiryDate = new Date(inq.inquiryDate || inq.timestamp);
            return inquiryDate.toDateString() === today;
        }).length;
    }, [inquiries]);

    const myWorkCount = useMemo(() => {
        return inquiries.filter(inq => inq.counselorName === userName).length;
    }, [inquiries, userName]);

    const allCount = inquiries.length;

    // Handle save
    const handleSave = async (id: string, updates: CounselorUpdates) => {
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

    return (
        <DashboardLayout>
            <div className="h-screen flex flex-col lg:flex-row relative">
                {/* Main Content Area */}
                <div className={`flex-1 flex flex-col min-w-0 ${selectedInquiry ? 'hidden lg:flex lg:w-1/2' : 'w-full'}`}>
                    {/* Tabs */}
                    <InquiryTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        todayCount={todayCount}
                        myWorkCount={myWorkCount}
                        allCount={allCount}
                    />

                    {/* Filters */}
                    <InquiryFilters
                        filters={filters}
                        onFilterChange={setFilters}
                    />

                    {/* List */}
                    <div className="flex-1 bg-white overflow-hidden">
                        <InquiryList
                            inquiries={filteredInquiries}
                            selectedId={selectedInquiry?.id || null}
                            onSelect={setSelectedInquiry}
                            loading={loading}
                        />
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
                        <div className="hidden lg:block lg:w-1/2 xl:w-2/5 border-l border-anushtan-border h-screen overflow-hidden">
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
