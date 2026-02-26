'use client';

import { useEffect, useState } from 'react';
import { InquiryCard } from '@/components/inquiry/InquiryCard';
import type { SheetInquiry as Inquiry } from '@repo/database';

export function NewInquiriesSection() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInquiries();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchInquiries, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchInquiries = async () => {
        try {
            const response = await fetch('/api/counselor/inquiries', { cache: 'no-store' });
            const data = await response.json();

            if (data.success) {
                // Filter unassigned inquiries
                const newInquiries = data.data.filter(
                    (inquiry: any) => inquiry.status === 'New' && !inquiry.counselorName
                );
                setInquiries(newInquiries);
            }
        } catch (error) {
            console.error('Failed to fetch inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (inquiryId: string) => {
        try {
            const response = await fetch('/api/counselor/assign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inquiryId }),
            });

            const data = await response.json();

            if (data.success) {
                // Refresh inquiries
                fetchInquiries();
                // Reload page to update "My Inquiries" section
                window.location.reload();
            } else {
                alert('Failed to assign inquiry. Please try again.');
            }
        } catch (error) {
            alert('Error assigning inquiry. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-anushtan-border p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-anushtan-border p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-2xl font-bold text-anushtan-charcoal">
                    🆕 New Inquiries ({inquiries.length})
                </h2>
                <a
                    href="/inquiry/new"
                    className="px-4 py-2 bg-anushtan-terracotta text-white rounded-lg hover:bg-anushtan-terracotta/90 transition text-sm"
                >
                    + New Inquiry (Paper Form)
                </a>
            </div>

            {inquiries.length === 0 ? (
                <div className="text-center py-8 text-anushtan-charcoal/60">
                    <p>No new unassigned inquiries</p>
                    <p className="text-sm mt-2">All inquiries have been assigned</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inquiries.slice(0, 3).map((inquiry) => (
                        <InquiryCard
                            key={inquiry.id}
                            inquiry={inquiry}
                            showAssignButton
                            onAssign={handleAssign}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
