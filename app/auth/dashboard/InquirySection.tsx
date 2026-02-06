'use client';

import { useEffect, useState } from 'react';
import { InquiryCard } from '@/components/inquiry/InquiryCard';
import type { Inquiry } from '@/lib/sheets/client';

interface InquirySectionProps {
    userName: string;
}

export function InquirySection({ userName }: InquirySectionProps) {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInquiries();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchInquiries, 30000);
        return () => clearInterval(interval);
    }, [userName]);

    const fetchInquiries = async () => {
        try {
            const response = await fetch('/api/counselor/inquiries');
            const data = await response.json();

            if (data.success) {
                // Filter inquiries assigned to this user
                const myInquiries = data.data.filter(
                    (inquiry: Inquiry) => inquiry.counselorName === userName
                );
                setInquiries(myInquiries);
            }
        } catch (error) {
            console.error('Failed to fetch inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-anushtan-border p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-20 bg-gray-200 rounded"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Count by status
    const statusCounts = {
        new: inquiries.filter(i => i.status === 'New').length,
        followUp: inquiries.filter(i => i.status === 'Follow-up').length,
        interested: inquiries.filter(i => i.status === 'Interested').length,
    };

    return (
        <div className="bg-white rounded-xl border border-anushtan-border p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-2xl font-bold text-anushtan-charcoal">
                    📋 My Inquiries ({inquiries.length})
                </h2>
                <div className="flex gap-4 text-sm">
                    <span className="text-orange-600">New: {statusCounts.new}</span>
                    <span className="text-blue-600">Follow-up: {statusCounts.followUp}</span>
                    <span className="text-green-600">Interested: {statusCounts.interested}</span>
                </div>
            </div>

            {inquiries.length === 0 ? (
                <div className="text-center py-8 text-anushtan-charcoal/60">
                    <p>No inquiries assigned to you yet</p>
                    <p className="text-sm mt-2">Check "New Inquiries" below to assign some</p>
                </div>
            ) : (
                <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {inquiries.slice(0, 6).map((inquiry) => (
                            <InquiryCard key={inquiry.id} inquiry={inquiry} />
                        ))}
                    </div>

                    {inquiries.length > 6 && (
                        <div className="text-center">
                            <a
                                href="/auth/students"
                                className="text-anushtan-terracotta hover:underline text-sm"
                            >
                                View all {inquiries.length} inquiries →
                            </a>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
