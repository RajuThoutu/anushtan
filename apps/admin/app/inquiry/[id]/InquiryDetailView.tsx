'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { SheetInquiry as Inquiry } from '@repo/database';

interface InquiryDetailViewProps {
    inquiry: any;
    userName: string;
}

export function InquiryDetailView({ inquiry, userName }: InquiryDetailViewProps) {
    const [saving, setSaving] = useState(false);
    const t2IST = () => {
        const d = new Date();
        d.setDate(d.getDate() + 2);
        return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    };

    const fmtFollowUpDate = (d?: Date | string | null) => {
        if (!d) return null;
        return new Date(d).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    };

    const [formData, setFormData] = useState({
        status: inquiry.status || 'New',
        counselorComments: '', // always blank — new note per save; history shown below
        followUpDate: fmtFollowUpDate(inquiry.followUpDate) || t2IST(),
    });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch('/api/counselor/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: inquiry.id,
                    ...formData,
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert('Counselor actions saved successfully!');
                router.back();
            } else {
                alert('Failed to save. Please try again.');
            }
        } catch (error) {
            alert('Error saving data. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-anushtan-parchment">
            {/* Header */}
            <header className="bg-white border-b border-anushtan-border">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="text-anushtan-charcoal hover:text-anushtan-terracotta"
                        >
                            ← Go Back
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-anushtan-charcoal">{inquiry.studentName}</h1>
                            <p className="text-sm text-anushtan-charcoal/60">{inquiry.currentClass}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Student Information */}
                <div className="bg-white rounded-lg border border-anushtan-border p-6">
                    <h2 className="text-lg font-semibold text-anushtan-charcoal mb-4">Student Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-anushtan-charcoal/60">Student Name</p>
                            <p className="font-medium">{inquiry.studentName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-anushtan-charcoal/60">Current Class</p>
                            <p className="font-medium">{inquiry.currentClass}</p>
                        </div>
                        <div>
                            <p className="text-sm text-anushtan-charcoal/60">Current School</p>
                            <p className="font-medium">{inquiry.currentSchool || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-anushtan-charcoal/60">Board</p>
                            <p className="font-medium">{inquiry.board || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                {/* Parent Information */}
                <div className="bg-white rounded-lg border border-anushtan-border p-6">
                    <h2 className="text-lg font-semibold text-anushtan-charcoal mb-4">Parent Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-anushtan-charcoal/60">Parent Name</p>
                            <p className="font-medium">{inquiry.parentName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-anushtan-charcoal/60">Occupation</p>
                            <p className="font-medium">{inquiry.occupation || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-anushtan-charcoal/60">Phone</p>
                            <p className="font-medium">
                                <a href={`tel:${inquiry.phone}`} className="text-anushtan-terracotta hover:underline">
                                    {inquiry.phone}
                                </a>
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-anushtan-charcoal/60">Email</p>
                            <p className="font-medium">
                                <a href={`mailto:${inquiry.email}`} className="text-anushtan-terracotta hover:underline">
                                    {inquiry.email}
                                </a>
                            </p>
                        </div>
                        <div className="sm:col-span-2">
                            <p className="text-sm text-anushtan-charcoal/60">Address</p>
                            <p className="font-medium">{inquiry.address}</p>
                        </div>
                    </div>
                </div>

                {/* Additional Details */}
                <div className="bg-white rounded-lg border border-anushtan-border p-6">
                    <h2 className="text-lg font-semibold text-anushtan-charcoal mb-4">Additional Details</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-anushtan-charcoal/60">How did they hear about us?</p>
                            <p className="font-medium">{inquiry.howHeard}</p>
                        </div>
                        <div>
                            <p className="text-sm text-anushtan-charcoal/60">Submitted</p>
                            <p className="font-medium">{new Date(inquiry.timestamp).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-anushtan-charcoal/60">Source</p>
                            <p className="font-medium">{inquiry.source}</p>
                        </div>
                        {inquiry.counselorName && (
                            <div>
                                <p className="text-sm text-anushtan-charcoal/60">Last Updated By (Counselor)</p>
                                <p className="font-medium">{inquiry.counselorName}</p>
                            </div>
                        )}
                        {inquiry.caseStatus && (
                            <div>
                                <p className="text-sm text-anushtan-charcoal/60">Case Status</p>
                                <p className="font-medium">{inquiry.caseStatus}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg border border-anushtan-border p-6">
                    <h2 className="text-lg font-semibold text-anushtan-charcoal mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href={`tel:${inquiry.phone}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            📞 Call Parent
                        </a>
                        <a
                            href={`mailto:${inquiry.email}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            ✉️ Email Parent
                        </a>
                        <a
                            href={`https://wa.me/91${inquiry.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                            💬 WhatsApp
                        </a>
                    </div>
                </div>

                {/* Counselor Actions Form */}
                <form onSubmit={handleSubmit} className="bg-anushtan-gold/10 border-2 border-anushtan-gold/30 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-anushtan-charcoal mb-4">Counselor Actions</h2>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                Status *
                            </label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-2 border border-anushtan-border rounded-lg focus:ring-2 focus:ring-anushtan-terracotta focus:border-transparent outline-none"
                                required
                            >
                                <option value="New">New</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Converted">Converted</option>
                                <option value="Casual Inquiry">Casual Inquiry</option>
                            </select>
                        </div>



                        {/* Comment History — all past notes, newest first */}
                        {inquiry.activityLog?.filter((e: any) => e.comments).length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                    Comment History
                                </label>
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                    {inquiry.activityLog
                                        .filter((e: any) => e.comments)
                                        .map((entry: any, i: number) => (
                                            <div key={i} className="bg-white border border-anushtan-border rounded-lg p-3 text-sm">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <span className="font-semibold text-anushtan-charcoal text-xs">{entry.counselorName}</span>
                                                    <span className="text-[10px] text-gray-400 shrink-0">
                                                        {new Date(entry.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true })}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 whitespace-pre-wrap">{entry.comments}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="counselorComments" className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                Add New Note
                            </label>
                            <textarea
                                id="counselorComments"
                                value={formData.counselorComments}
                                onChange={(e) => setFormData({ ...formData, counselorComments: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border border-anushtan-border rounded-lg focus:ring-2 focus:ring-anushtan-terracotta focus:border-transparent outline-none resize-none"
                                placeholder="Type a new note here..."
                            />
                        </div>

                        <div>
                            <label htmlFor="followUpDate" className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                Follow-up Date
                            </label>
                            <input
                                type="date"
                                id="followUpDate"
                                value={formData.followUpDate}
                                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                                className="w-full px-4 py-2 border border-anushtan-border rounded-lg focus:ring-2 focus:ring-anushtan-terracotta focus:border-transparent outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-anushtan-terracotta hover:bg-anushtan-terracotta/90 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Saving...' : '💾 Save Actions'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
