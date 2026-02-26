'use client';

import { useState, useEffect } from 'react';
import { X, Save, User, Phone, Mail, School, BookOpen, MessageSquare, ArrowLeft } from 'lucide-react';
import type { SheetInquiry as Inquiry } from '@repo/database';

interface InquiryDetailPanelProps {
    inquiry: any;
    onClose: () => void;
    onSave: (id: string, updates: CounselorUpdates) => Promise<void>;
}

export interface CounselorUpdates {
    status: string;
    counselorComments: string;
    followUpDate: string;
    unassign?: boolean;
}

const statusOptions = [
    'New',
    'Open',
    'Follow-up',
    'Converted',
    'Closed',
];

const priorityOptions = ['High', 'Medium', 'Low'];

export function InquiryDetailPanel({ inquiry, onClose, onSave }: InquiryDetailPanelProps) {
    // Calculate T+2 days default in IST
    const getDefaultFollowUpDate = () => {
        const d = new Date();
        d.setDate(d.getDate() + 2);
        return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    };

    const [formData, setFormData] = useState<CounselorUpdates>({
        status: inquiry?.status || 'New',
        counselorComments: '', // Start empty for new notes
        followUpDate: inquiry?.followUpDate ? new Date(inquiry.followUpDate).toISOString().split('T')[0] : getDefaultFollowUpDate(),
    });
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Reset form when inquiry changes
    useEffect(() => {
        if (inquiry) {
            setFormData({
                status: inquiry.status || 'New',
                counselorComments: '', // Always empty when switching inquiry
                followUpDate: inquiry.followUpDate ? new Date(inquiry.followUpDate).toISOString().split('T')[0] : getDefaultFollowUpDate(),
            });
        }
    }, [inquiry]);

    if (!inquiry) {
        return (
            <div className="h-full flex items-center justify-center text-anushtan-charcoal/40">
                <div className="text-center">
                    <div className="text-5xl mb-4">👈</div>
                    <p>Select an inquiry to view details</p>
                </div>
            </div>
        );
    }

    const handleSave = async () => {
        if (formData.status === 'New') {
            alert('Please check "Mark as Open" to assign yourself this inquiry before saving updates.');
            return;
        }

        setSaving(true);
        setSaveSuccess(false);
        try {
            await onSave(inquiry.id, formData);
            setSaveSuccess(true);
            setFormData(prev => ({ ...prev, counselorComments: '' })); // Clear comment box
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error: any) {
            console.error('Failed to save:', error);
            alert(`Failed to save changes: ${error.message || 'Please try again.'}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-white safe-area-inset">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-anushtan-border bg-white sticky top-0 z-10">
                {/* Back Button - More prominent on mobile */}
                <button
                    onClick={onClose}
                    className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-anushtan-parchment transition-all lg:hidden"
                    aria-label="Go back"
                >
                    <ArrowLeft size={24} className="text-anushtan-charcoal" />
                </button>

                <div className="flex-1 min-w-0">
                    <h2 className="font-heading text-lg lg:text-xl font-bold text-anushtan-charcoal truncate">
                        {inquiry.studentName}
                    </h2>
                    <p className="text-sm text-anushtan-charcoal/60">
                        Inquiry {inquiry.inquiryId || inquiry.id}
                    </p>
                </div>

                {/* Close button - Desktop only */}
                <button
                    onClick={onClose}
                    className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full hover:bg-anushtan-parchment transition-all"
                    aria-label="Close panel"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Read-Only Section */}
                <section>
                    <h3 className="text-sm font-semibold text-anushtan-charcoal/60 uppercase tracking-wide mb-3">
                        Inquiry Information
                    </h3>
                    <div className="space-y-3">
                        <InfoRow icon={<User size={16} />} label="Student Name" value={inquiry.studentName} />
                        <InfoRow icon={<School size={16} />} label="Current Class" value={inquiry.currentClass} />
                        <InfoRow icon={<BookOpen size={16} />} label="Current School" value={inquiry.currentSchool} />
                        <InfoRow icon={<BookOpen size={16} />} label="Board" value={inquiry.board} />
                    </div>
                </section>

                <section>
                    <h3 className="text-sm font-semibold text-anushtan-charcoal/60 uppercase tracking-wide mb-3">
                        Parent Information
                    </h3>
                    <div className="space-y-3">
                        <InfoRow icon={<User size={16} />} label="Parent Name" value={inquiry.parentName} />
                        <InfoRow icon={<BookOpen size={16} />} label="Occupation" value={inquiry.occupation} />
                        <InfoRow icon={<Phone size={16} />} label="Phone" value={inquiry.phone} />
                        <InfoRow icon={<Phone size={16} />} label="Secondary Contact" value={inquiry.secondaryContact} />
                        <InfoRow icon={<Mail size={16} />} label="Email" value={inquiry.email} />
                    </div>
                </section>

                <section>
                    <h3 className="text-sm font-semibold text-anushtan-charcoal/60 uppercase tracking-wide mb-3">
                        Preferences
                    </h3>
                    <div className="space-y-3">
                        <InfoRow icon={<MessageSquare size={16} />} label="Day Scholar / Hostel" value={inquiry.dayScholarHostel} />
                        <InfoRow icon={<MessageSquare size={16} />} label="How Heard About Us" value={inquiry.howHeard} />
                    </div>
                </section>

                {/* Educational Philosophy */}
                {(inquiry.educationGuide || inquiry.learningMethod || inquiry.teacherPreference || inquiry.childImportance || inquiry.schoolEnvironment) && (
                    <section>
                        <h3 className="text-sm font-semibold text-anushtan-charcoal/60 uppercase tracking-wide mb-3">
                            Educational Philosophy
                        </h3>
                        <div className="space-y-3 text-sm">
                            {inquiry.educationGuide && <PhilosophyItem label="Who should guide education" value={inquiry.educationGuide} />}
                            {inquiry.learningMethod && <PhilosophyItem label="How children learn" value={inquiry.learningMethod} />}
                            {inquiry.teacherPreference && <PhilosophyItem label="Teacher preference" value={inquiry.teacherPreference} />}
                            {inquiry.childImportance && <PhilosophyItem label="What's important for child" value={inquiry.childImportance} />}
                            {inquiry.schoolEnvironment && <PhilosophyItem label="School environment" value={inquiry.schoolEnvironment} />}
                        </div>
                    </section>
                )}

                {/* Editable Counselor Section */}
                <section className="border-t border-anushtan-border pt-6">
                    <h3 className="text-sm font-semibold text-anushtan-terracotta uppercase tracking-wide mb-3">
                        Counselor Actions
                    </h3>
                    <div className="space-y-4">
                        {/* Open Inquiry Checkbox */}
                        {(inquiry?.status === 'New' || inquiry?.status === 'Open') && (
                            <div
                                className={`mb-4 p-3 border rounded-lg flex items-start gap-3 cursor-pointer transition-colors ${formData.status !== 'New'
                                    ? 'bg-blue-50 border-blue-200'
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                    }`}
                                onClick={async () => {
                                    const isCurrentlyOpen = formData.status !== 'New';
                                    const newStatus = isCurrentlyOpen ? 'New' : 'Open';
                                    const updatedData = { ...formData, status: newStatus };
                                    setFormData(updatedData);

                                    // Make API call instantly when wrapping this action
                                    await onSave(inquiry.id, isCurrentlyOpen ? { ...updatedData, unassign: true } : updatedData);
                                }}
                            >
                                <div className="pt-0.5">
                                    <input
                                        type="checkbox"
                                        checked={formData.status !== 'New'}
                                        readOnly
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer pointer-events-none"
                                    />
                                </div>
                                <div className="pointer-events-none select-none">
                                    <h4 className={`text-sm font-semibold ${formData.status !== 'New' ? 'text-blue-900' : 'text-gray-700'}`}>
                                        {formData.status !== 'New' ? 'Assigned to You (Open)' : 'Mark as Open'}
                                    </h4>
                                    <p className={`text-xs mt-0.5 ${formData.status !== 'New' ? 'text-blue-800' : 'text-gray-500'}`}>
                                        {formData.status !== 'New'
                                            ? 'You are currently working on this inquiry. Uncheck to return it to the queue.'
                                            : 'Assign this inquiry to yourself and update the dashboard status so others know you are working on it.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-anushtan-charcoal mb-1">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 border border-anushtan-border rounded-lg focus:outline-none focus:border-anushtan-terracotta"
                            >
                                {statusOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>



                        {/* Follow-up Date */}
                        <div>
                            <label className="block text-sm font-medium text-anushtan-charcoal mb-1">
                                Follow-up Date
                            </label>
                            <input
                                type="date"
                                value={formData.followUpDate}
                                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                                className="w-full px-3 py-2 border border-anushtan-border rounded-lg focus:outline-none focus:border-anushtan-terracotta"
                            />
                        </div>

                        {/* Comment History (Read-Only) */}
                        {inquiry.counselorComments && (
                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-1">
                                    Comment History
                                </label>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                                    {inquiry.counselorComments}
                                </div>
                            </div>
                        )}

                        {/* New Comment Input */}
                        <div>
                            <label className="block text-sm font-medium text-anushtan-charcoal mb-1">
                                Add New Note
                            </label>
                            <textarea
                                value={formData.counselorComments}
                                onChange={(e) => setFormData({ ...formData, counselorComments: e.target.value })}
                                rows={3}
                                placeholder="Type a new note here..."
                                className="w-full px-3 py-2 border border-anushtan-border rounded-lg focus:outline-none focus:border-anushtan-terracotta resize-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Audit Trail Section */}
                {(inquiry.counselorName || inquiry.caseStatus) && (
                    <section className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-semibold text-admin-text/60 uppercase tracking-wide mb-3">
                            Workflow Information
                        </h3>
                        <div className="space-y-2 text-sm">
                            {inquiry.caseStatus && (
                                <div className="flex justify-between">
                                    <span className="text-admin-text/60">Case Status:</span>
                                    <span className={`font-medium px-2 py-1 rounded ${inquiry.caseStatus === 'Resolved-Completed'
                                        ? 'bg-admin-emerald/10 text-admin-emerald'
                                        : 'bg-admin-blue/10 text-admin-blue'
                                        }`}>
                                        {inquiry.caseStatus}
                                    </span>
                                </div>
                            )}
                            {inquiry.counselorName && (
                                <div className="flex justify-between">
                                    <span className="text-admin-text/60">Last Updated By:</span>
                                    <span className="font-medium text-admin-text">{inquiry.counselorName}</span>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </div>

            {/* Footer with Save */}
            <div className="p-4 border-t border-admin-border bg-white">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`
                        w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all
                        ${saving
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : saveSuccess
                                ? 'bg-gradient-to-r from-admin-emerald to-admin-emerald-light text-white shadow-lg'
                                : 'bg-gradient-to-r from-admin-blue to-admin-purple text-white hover:shadow-lg hover:scale-105'
                        }
                    `}
                >
                    {saving ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : saveSuccess ? (
                        <>
                            ✓ Saved Successfully
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="text-anushtan-charcoal/40 mt-0.5">{icon}</div>
            <div className="flex-1">
                <p className="text-xs text-anushtan-charcoal/60">{label}</p>
                <p className="text-sm text-anushtan-charcoal font-medium">
                    {value || <span className="text-anushtan-charcoal/30">Not provided</span>}
                </p>
            </div>
        </div>
    );
}

function PhilosophyItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-anushtan-parchment/50 p-3 rounded-lg">
            <p className="text-xs text-anushtan-charcoal/60 mb-1">{label}</p>
            <p className="text-sm text-anushtan-charcoal">{value}</p>
        </div>
    );
}
