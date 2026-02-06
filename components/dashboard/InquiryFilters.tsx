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
    const [showDateFilters, setShowDateFilters] = useState(false);

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

                {/* Date Filter Toggle */}
                <button
                    onClick={() => setShowDateFilters(!showDateFilters)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${showDateFilters || filters.dateFrom || filters.dateTo
                            ? 'border-anushtan-terracotta text-anushtan-terracotta bg-anushtan-terracotta/5'
                            : 'border-anushtan-border text-anushtan-charcoal/60 hover:border-anushtan-charcoal/30'
                        }`}
                >
                    <Calendar size={18} />
                    <span className="hidden sm:inline">Date Range</span>
                </button>

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

            {/* Date Range Inputs */}
            {showDateFilters && (
                <div className="flex gap-3 mt-3 pt-3 border-t border-anushtan-border/50">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-anushtan-charcoal/60">From:</label>
                        <input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => handleChange('dateFrom', e.target.value)}
                            className="px-3 py-1.5 border border-anushtan-border rounded-lg focus:outline-none focus:border-anushtan-terracotta"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-anushtan-charcoal/60">To:</label>
                        <input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => handleChange('dateTo', e.target.value)}
                            className="px-3 py-1.5 border border-anushtan-border rounded-lg focus:outline-none focus:border-anushtan-terracotta"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
