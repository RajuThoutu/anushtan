'use client';

import { useState, useEffect } from 'react';
import { Search, X, Calendar, Filter } from 'lucide-react';

export interface FilterState {
    search: string;
    status: string;
    priority: string;
    dateFrom: string;
    dateTo: string;
}

interface InquiryFiltersProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'New', label: 'New' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Interested', label: 'Interested' },
    { value: 'Follow-up', label: 'Follow-up' },
    { value: 'Converted', label: 'Converted' },
    { value: 'Closed', label: 'Closed' },
];

const priorityOptions = [
    { value: '', label: 'All Priority' },
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
];

export function InquiryFilters({ filters, onFilterChange }: InquiryFiltersProps) {
    const [localSearch, setLocalSearch] = useState(filters.search);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== filters.search) {
                onFilterChange({ ...filters, search: localSearch });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [localSearch]);

    const handleChange = (key: keyof FilterState, value: string) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const clearFilters = () => {
        setLocalSearch('');
        onFilterChange({
            search: '',
            status: '',
            priority: '',
            dateFrom: '',
            dateTo: '',
        });
    };

    const hasActiveFilters = filters.search || filters.status || filters.priority || filters.dateFrom || filters.dateTo;

    return (
        <div className="bg-white border-b border-anushtan-border p-4">
            <div className="flex flex-wrap gap-3 items-center">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-anushtan-charcoal/40" />
                    <input
                        type="text"
                        placeholder="Search by name, phone..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-anushtan-border rounded-lg focus:outline-none focus:border-anushtan-terracotta"
                    />
                </div>

                {/* Status */}
                <select
                    value={filters.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="px-4 py-2 border border-anushtan-border rounded-lg focus:outline-none focus:border-anushtan-terracotta bg-white"
                >
                    {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                {/* Priority */}
                <select
                    value={filters.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    className="px-4 py-2 border border-anushtan-border rounded-lg focus:outline-none focus:border-anushtan-terracotta bg-white"
                >
                    {priorityOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                {/* Date Quick Select - Inline */}
                <select
                    className="px-4 py-2 border border-anushtan-border rounded-lg focus:outline-none focus:border-anushtan-terracotta bg-white"
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
                            handleChange('dateFrom', start);
                            handleChange('dateTo', end);
                        }
                    }}
                >
                    <option value="">Date Range...</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="thisWeek">This Week</option>
                    <option value="lastWeek">Last Week</option>
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                </select>

                {/* Display Selected Dates (Small, Inline) */}
                {(filters.dateFrom || filters.dateTo) && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                        <Calendar size={14} />
                        <span>{filters.dateFrom || '...'}</span>
                        <span>-</span>
                        <span>{filters.dateTo || '...'}</span>
                    </div>
                )}

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-anushtan-terracotta hover:bg-anushtan-parchment rounded-lg transition-all"
                    >
                        <X size={16} />
                        <span>Clear</span>
                    </button>
                )}
            </div>
        </div>
    );
}
