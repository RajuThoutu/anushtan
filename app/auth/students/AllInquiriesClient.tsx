'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    Filter,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Eye,
    MoreHorizontal,
    Download
} from 'lucide-react';

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
}

export default function AllInquiriesClient() {
    const router = useRouter();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const response = await fetch('/api/counselor/inquiries');
            const data = await response.json();

            if (data.success) {
                // Sort by date desc (newest first)
                const sorted = data.data.sort((a: Inquiry, b: Inquiry) =>
                    new Date(b.inquiryDate).getTime() - new Date(a.inquiryDate).getTime()
                );
                setInquiries(sorted);
            } else {
                setError('Failed to load inquiries');
            }
        } catch (err) {
            setError('An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredInquiries = inquiries.filter(inq => {
        const matchesSearch =
            inq.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.phone.includes(searchTerm);

        const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;

        let matchesDate = true;
        if (dateStart && dateEnd) {
            const inqDate = new Date(inq.inquiryDate);
            const start = new Date(dateStart);
            const end = new Date(dateEnd);
            // Set end date to end of day
            end.setHours(23, 59, 59, 999);
            matchesDate = inqDate >= start && inqDate <= end;
        }

        return matchesSearch && matchesStatus && matchesDate;
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
            case 'Open': return 'bg-yellow-100 text-yellow-800';
            case 'Follow-up': return 'bg-orange-100 text-orange-800';
            case 'Converted': return 'bg-green-100 text-green-800';
            case 'Closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Summary Stats
    const stats = {
        total: inquiries.length,
        today: inquiries.filter(i => new Date(i.inquiryDate).toDateString() === new Date().toDateString()).length,
        open: inquiries.filter(i => ['Open', 'New', 'In Progress'].includes(i.status)).length,
        converted: inquiries.filter(i => i.status === 'Converted').length
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-emerald"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Quick View Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-admin-border shadow-sm">
                    <div className="text-sm text-gray-500 font-medium">Total Inquiries</div>
                    <div className="text-2xl font-bold text-admin-text mt-1">{stats.total}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-admin-border shadow-sm">
                    <div className="text-sm text-gray-500 font-medium">Today's Inquiries</div>
                    <div className="text-2xl font-bold text-admin-emerald mt-1">+{stats.today}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-admin-border shadow-sm">
                    <div className="text-sm text-gray-500 font-medium">Open / Active</div>
                    <div className="text-2xl font-bold text-yellow-600 mt-1">{stats.open}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-admin-border shadow-sm">
                    <div className="text-sm text-gray-500 font-medium">Converted</div>
                    <div className="text-2xl font-bold text-admin-blue mt-1">{stats.converted}</div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-admin-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">

                {/* Search */}
                <div className="relative flex-1 w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Name, ID, Phone..."
                        className="w-full pl-10 pr-4 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-emerald"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filters Group */}
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-admin-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-admin-emerald"
                        >
                            <option value="All">All Statuses</option>
                            <option value="New">New</option>
                            <option value="Open">Open</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Converted">Converted</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2">
                        <select
                            className="border border-admin-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-admin-emerald"
                            onChange={(e) => {
                                const val = e.target.value;
                                const today = new Date();
                                let start = '';
                                let end = '';

                                if (val === 'today') {
                                    start = end = today.toISOString().split('T')[0];
                                } else if (val === 'yesterday') {
                                    const y = new Date(today);
                                    y.setDate(today.getDate() - 1);
                                    start = end = y.toISOString().split('T')[0];
                                } else if (val === 'thisWeek') {
                                    const d = new Date(today);
                                    const day = d.getDay();
                                    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
                                    const monday = new Date(d.setDate(diff));
                                    const sunday = new Date(d.setDate(monday.getDate() + 6));
                                    start = monday.toISOString().split('T')[0];
                                    end = sunday.toISOString().split('T')[0];
                                } else if (val === 'lastWeek') {
                                    const d = new Date(today);
                                    const day = d.getDay();
                                    const diff = d.getDate() - day + (day === 0 ? -6 : 1) - 7;
                                    const monday = new Date(d.setDate(diff));
                                    const sunday = new Date(d.setDate(monday.getDate() + 6));
                                    start = monday.toISOString().split('T')[0];
                                    end = sunday.toISOString().split('T')[0];
                                } else if (val === 'thisMonth') {
                                    start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                                    end = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
                                } else if (val === 'lastMonth') {
                                    start = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
                                    end = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
                                }

                                if (val !== 'custom') {
                                    setDateStart(start);
                                    setDateEnd(end);
                                }
                            }}
                        >
                            <option value="custom">Quick Select...</option>
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="thisWeek">This Week</option>
                            <option value="lastWeek">Last Week</option>
                            <option value="thisMonth">This Month</option>
                            <option value="lastMonth">Last Month</option>
                        </select>
                        <Calendar size={18} className="text-gray-500" />
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                className="border border-admin-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-admin-emerald"
                                value={dateStart}
                                onChange={(e) => setDateStart(e.target.value)}
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="date"
                                className="border border-admin-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-admin-emerald"
                                value={dateEnd}
                                onChange={(e) => setDateEnd(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-admin-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-admin-bg border-b border-admin-border">
                                <th className="px-6 py-4 font-semibold text-admin-text text-sm">ID / Date</th>
                                <th className="px-6 py-4 font-semibold text-admin-text text-sm">Student</th>
                                <th className="px-6 py-4 font-semibold text-admin-text text-sm">Class</th>
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
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-admin-text">{inq.id}</div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(inq.inquiryDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-admin-text">{inq.studentName}</div>
                                            <div className="text-xs text-gray-500">{inq.parentName}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {inq.currentClass}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div>{inq.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inq.status)}`}>
                                                {inq.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {inq.counselorName || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {inq.followUpDate ? (
                                                <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100 w-fit">
                                                    <Calendar size={12} />
                                                    {new Date(inq.followUpDate).toLocaleDateString()}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => router.push(`/auth/inquiry/${inq.id}`)}
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
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                        No inquiries found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredInquiries.length > itemsPerPage && (
                    <div className="px-6 py-4 border-t border-admin-border flex items-center justify-between bg-gray-50">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredInquiries.length)}</span> of <span className="font-medium">{filteredInquiries.length}</span> results
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-admin-border rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                            >
                                <ChevronLeft size={16} />
                            </button>
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
