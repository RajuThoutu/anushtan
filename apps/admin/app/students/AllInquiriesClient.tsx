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

export default function AllInquiriesClient() {
    const router = useRouter();
    const { data: session } = useSession();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedInquiries, setSelectedInquiries] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);

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
            const response = await fetch('/api/counselor/inquiries', { cache: 'no-store' });
            const data = await response.json();

            if (data.success) {
                // Sort by inquiryDate desc
                const sorted = data.data.sort((a: Inquiry, b: Inquiry) => {
                    return new Date(b.inquiryDate).getTime() - new Date(a.inquiryDate).getTime();
                });
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
            (inq.inquiryId || inq.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.phone.includes(searchTerm);

        const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;

        let matchesDate = true;
        if (dateStart && dateEnd) {
            const inqDateObj = new Date(inq.inquiryDate);
            const inqDateStr = inqDateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
            matchesDate = inqDateStr >= dateStart && inqDateStr <= dateEnd;
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
            case 'Open': return 'bg-indigo-100 text-indigo-800';
            case 'Follow-up': return 'bg-orange-100 text-orange-800';
            case 'Converted': return 'bg-green-100 text-green-800';
            case 'Casual Inquiry': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Summary Stats
    const stats = {
        total: inquiries.length,
        today: inquiries.filter(i => new Date(i.inquiryDate).toDateString() === new Date().toDateString()).length,
        open: inquiries.filter(i => ['New', 'Follow-up'].includes(i.status)).length,
        converted: inquiries.filter(i => i.status === 'Converted').length
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-emerald"></div>
            </div>
        );
    }

    const isSuperAdmin = session?.user?.role === 'super_admin' || session?.user?.email?.toLowerCase() === 'raju';

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
        if (!confirm(`Are you sure you want to permanently delete ${selectedInquiries.size} inquiries? This action cannot be undone.`)) {
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
                fetchInquiries();
            } else {
                alert(data.error || 'Failed to delete inquiries');
            }
        } catch (err) {
            alert('An error occurred during deletion.');
        } finally {
            setIsDeleting(false);
        }
    };

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
                            <option value="Casual Inquiry">Casual Inquiry</option>
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
                                    start = end = today.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                                } else if (val === 'yesterday') {
                                    const y = new Date(today);
                                    y.setDate(today.getDate() - 1);
                                    start = end = y.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                                } else if (val === 'thisWeek') {
                                    const d = new Date(today);
                                    const day = d.getDay();
                                    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
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
                    {/* Export Button */}
                    <div className="flex-shrink-0 ml-auto">
                        <ExportButton data={filteredInquiries} filename="All_Inquiries" />
                    </div>
                </div>
            </div>

            {/* Bulk Actions */}
            {isSuperAdmin && selectedInquiries.size > 0 && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-200 flex items-center justify-between">
                    <span className="text-red-800 font-medium">
                        {selectedInquiries.size} inquiries selected
                    </span>
                    <button
                        onClick={handleBulkDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Selected'}
                    </button>
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
                                            {isSuperAdmin && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedInquiries.has(inq.inquiryId || inq.id)}
                                                    onChange={e => handleSelectOne(inq.inquiryId || inq.id, e.target.checked)}
                                                    className="mr-3 rounded border-gray-300 text-admin-emerald focus:ring-admin-emerald"
                                                />
                                            )}
                                            <div className="inline-block font-semibold text-admin-text">{inq.studentName}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{inq.currentClass}</div>
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

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-admin-bg border-b border-admin-border">
                                    {isSuperAdmin && (
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
                                            {isSuperAdmin && (
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
                                        <td colSpan={isSuperAdmin ? 8 : 7} className="px-6 py-12 text-center text-gray-500">
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
        </div>
    );
}
