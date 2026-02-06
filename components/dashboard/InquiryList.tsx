'use client';

import { User, Phone, Calendar, Tag } from 'lucide-react';
import type { Inquiry } from '@/lib/sheets/client';

interface InquiryListProps {
    inquiries: Inquiry[];
    selectedId: string | null;
    onSelect: (inquiry: Inquiry) => void;
    loading?: boolean;
}

export function InquiryList({ inquiries, selectedId, onSelect, loading }: InquiryListProps) {
    if (loading) {
        return (
            <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg" />
                    </div>
                ))}
            </div>
        );
    }

    if (inquiries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-anushtan-charcoal/60">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-lg font-medium">No inquiries found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-anushtan-border overflow-y-auto max-h-[calc(100vh-280px)]">
            {inquiries.map((inquiry) => (
                <InquiryListItem
                    key={inquiry.id}
                    inquiry={inquiry}
                    isSelected={selectedId === inquiry.id}
                    onClick={() => onSelect(inquiry)}
                />
            ))}
        </div>
    );
}

interface InquiryListItemProps {
    inquiry: Inquiry;
    isSelected: boolean;
    onClick: () => void;
}

function InquiryListItem({ inquiry, isSelected, onClick }: InquiryListItemProps) {
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'new': return 'bg-gradient-to-r from-admin-coral to-admin-coral-light text-white shadow-sm';
            case 'interested': return 'bg-gradient-to-r from-admin-emerald to-admin-emerald-light text-white shadow-sm';
            case 'follow-up': return 'bg-gradient-to-r from-admin-blue to-admin-blue-light text-white shadow-sm';
            case 'in progress': return 'bg-gradient-to-r from-admin-amber to-admin-amber-light text-white shadow-sm';
            case 'converted': return 'bg-gradient-to-r from-admin-purple to-admin-purple-light text-white shadow-sm';
            case 'closed': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'text-admin-coral';
            case 'medium': return 'text-admin-amber';
            case 'low': return 'text-admin-emerald';
            default: return 'text-gray-400';
        }
    };

    // Format date for display
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    return (
        <button
            onClick={onClick}
            className={`
                w-full text-left p-4 transition-all hover:bg-gradient-to-r hover:from-admin-bg hover:to-white
                border-l-4 transition-all
                ${isSelected
                    ? 'bg-gradient-to-r from-admin-blue/5 to-admin-purple/5 border-l-admin-blue shadow-md'
                    : 'border-l-transparent hover:border-l-admin-purple/30'
                }
            `}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    {/* Student Name & ID */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-anushtan-charcoal truncate">
                            {inquiry.studentName || 'Unnamed'}
                        </span>
                        <span className="text-xs text-anushtan-charcoal/40">
                            {inquiry.id}
                        </span>
                    </div>

                    {/* Parent & Phone */}
                    <div className="flex items-center gap-4 text-sm text-anushtan-charcoal/60 mb-2">
                        <span className="flex items-center gap-1">
                            <User size={14} />
                            {inquiry.parentName || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Phone size={14} />
                            {inquiry.phone || 'N/A'}
                        </span>
                    </div>

                    {/* Tags Row */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Status */}
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(inquiry.status || 'New')}`}>
                            {inquiry.status || 'New'}
                        </span>

                        {/* Class */}
                        <span className="px-2 py-0.5 text-xs bg-anushtan-parchment text-anushtan-charcoal/70 rounded-full">
                            {inquiry.currentClass || 'N/A'}
                        </span>

                        {/* Priority */}
                        {inquiry.priority && (
                            <span className={`text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                                ● {inquiry.priority}
                            </span>
                        )}
                    </div>
                </div>

                {/* Date */}
                <div className="text-xs text-anushtan-charcoal/40 flex items-center gap-1 shrink-0">
                    <Calendar size={12} />
                    {formatDate(inquiry.inquiryDate || inquiry.timestamp)}
                </div>
            </div>
        </button>
    );
}
