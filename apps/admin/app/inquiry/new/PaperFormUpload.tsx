'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InquiryTypeToggle } from '@/components/dashboard/InquiryTypeToggle';

interface PaperFormUploadProps {
    userName: string;
}

interface OcrFields {
    studentName: string;
    parentName: string;
    phone: string;
    secondaryPhone: string;
    email: string;
    currentClass: string;
    currentSchool: string;
    board: string;
    dob: string;
    occupation: string;
    howHeard: string;
    dayScholarHostel: string;
}

const EMPTY_FIELDS: OcrFields = {
    studentName: '', parentName: '', phone: '', secondaryPhone: '',
    email: '', currentClass: '', currentSchool: '', board: '', dob: '',
    occupation: '', howHeard: '', dayScholarHostel: '',
};

export function PaperFormUpload({ userName }: PaperFormUploadProps) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [fields, setFields] = useState<OcrFields>(EMPTY_FIELDS);
    const [ocrLoading, setOcrLoading] = useState(false);
    const [ocrDone, setOcrDone] = useState(false);
    const [ocrRawText, setOcrRawText] = useState('');
    const [ocrConfidence, setOcrConfidence] = useState<number | null>(null);
    const [showRawText, setShowRawText] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [eligibilityMessage, setEligibilityMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // ─── Eligibility Check ───────────────────────────────────────────────────

    const checkEligibility = () => {
        if (!fields.dob) {
            setEligibilityMessage({ text: 'Please enter a Date of Birth first.', type: 'error' });
            return;
        }
        const birthDate = new Date(fields.dob);
        const cutoffDate = new Date('2026-04-01');
        const ageInYears = (cutoffDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

        if (ageInYears < 3) {
            setEligibilityMessage({ text: `Age ${ageInYears.toFixed(1)} yrs — Too young for Nursery (Requires 3+).`, type: 'error' });
            return;
        }

        let grade = '';
        if (ageInYears < 4) grade = 'Nursery';
        else if (ageInYears < 5) grade = 'LKG';
        else if (ageInYears < 6) grade = 'UKG';
        else if (ageInYears < 7) grade = 'Class 1';
        else if (ageInYears < 8) grade = 'Class 2';
        else if (ageInYears < 9) grade = 'Class 3';
        else if (ageInYears < 10) grade = 'Class 4';
        else if (ageInYears < 11) grade = 'Class 5';
        else if (ageInYears < 12) grade = 'Class 6';
        else if (ageInYears < 13) grade = 'Class 7';
        else if (ageInYears < 14) grade = 'Class 8';
        else if (ageInYears < 15) grade = 'Class 9';
        else if (ageInYears < 16) grade = 'Class 10';
        else {
            setEligibilityMessage({ text: `Age ${ageInYears.toFixed(1)} yrs — Verify higher classes manually.`, type: 'info' });
            return;
        }

        setFields(f => ({ ...f, currentClass: grade }));
        setEligibilityMessage({ text: `✅ Eligible for ${grade} (Age: ${ageInYears.toFixed(1)} yrs as of April 1, 2026).`, type: 'success' });
    };

    // ─── Image Upload ────────────────────────────────────────────────────────

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setOcrDone(false);
        setOcrRawText('');
        setOcrConfidence(null);
        // Reset fields so counselor doesn't see stale data
        setFields(EMPTY_FIELDS);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    // ─── OCR Extraction ──────────────────────────────────────────────────────

    const handleExtract = async () => {
        if (!imageFile) return;
        setOcrLoading(true);
        setOcrDone(false);

        try {
            const formData = new FormData();
            formData.append('formPhoto', imageFile);

            const res = await fetch('/api/counselor/ocr-form', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!data.success) {
                alert(`OCR failed: ${data.error}`);
                return;
            }

            // Pre-fill all fields; counselor can correct them
            const extracted = data.fields as OcrFields;
            setFields({
                studentName: extracted.studentName || '',
                parentName: extracted.parentName || '',
                phone: extracted.phone || '',
                secondaryPhone: extracted.secondaryPhone || '',
                email: extracted.email || '',
                currentClass: extracted.currentClass || '',
                currentSchool: extracted.currentSchool || '',
                board: extracted.board || '',
                dob: extracted.dob || '',
                occupation: extracted.occupation || '',
                howHeard: extracted.howHeard || '',
                dayScholarHostel: extracted.dayScholarHostel || '',
            });
            setOcrRawText(data.rawText || '');
            setOcrConfidence(data.confidence ?? null);
            setOcrDone(true);
        } catch {
            alert('Failed to run OCR. Please check your connection and try again.');
        } finally {
            setOcrLoading(false);
        }
    };

    // ─── Submit ──────────────────────────────────────────────────────────────

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch('/api/counselor/upload-paper-form', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                // Photo is only in browser memory — no server-side deletion needed
                alert('Paper form inquiry saved successfully!');
                router.push('/auth/dashboard');
            } else {
                alert(`Failed to save inquiry: ${data.error || 'Unknown error'}`);
            }
        } catch {
            alert('Error saving inquiry. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Field Input Helper ─────────────────────────────────────────────────

    const Field = ({
        label, name, type = 'text', required = false, placeholder = '',
        value, onChange,
    }: {
        label: string; name: string; type?: string; required?: boolean;
        placeholder?: string; value: string; onChange: (v: string) => void;
    }) => (
        <div>
            <label className="block text-sm font-medium text-admin-text mb-1.5">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input
                type={type}
                name={name}
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full px-4 py-2 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-emerald focus:border-transparent outline-none transition-all text-sm bg-white"
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-admin-bg">
            <header className="bg-white border-b border-admin-border">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/auth/dashboard" className="text-admin-text hover:text-admin-emerald transition-colors text-sm">
                            ← Back to Dashboard
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-admin-emerald to-admin-emerald-light bg-clip-text text-transparent">
                                New Inquiry — Paper Form
                            </h1>
                            <p className="text-sm text-admin-text-secondary">Upload photo → Extract via OCR → Review & Submit</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                <InquiryTypeToggle />

                {/* ── Step 1: Upload Photo ───────────────────────────────────── */}
                <div className="bg-white rounded-lg border border-admin-border p-6 shadow-sm">
                    <h2 className="text-base font-semibold text-admin-text mb-4 flex items-center gap-2">
                        <span className="bg-admin-emerald text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                        Upload Paper Form Photo
                    </h2>

                    {/* Hidden file input — triggered programmatically via ref */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="block w-full p-6 border-2 border-dashed border-admin-border rounded-lg text-center cursor-pointer hover:border-admin-emerald transition-colors bg-admin-bg/50 hover:bg-admin-bg select-none"
                    >
                        {imagePreview ? (
                            <img src={imagePreview} alt="Form preview" className="max-h-64 mx-auto rounded shadow" />
                        ) : (
                            <div>
                                <svg className="mx-auto h-12 w-12 text-admin-text-secondary/40" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="mt-2 text-sm text-admin-text-secondary">Click to upload paper form photo</p>
                                <p className="text-xs text-admin-text-secondary/60 mt-1">PNG, JPG up to 10MB</p>
                            </div>
                        )}
                    </div>

                    {imageFile && (
                        <div className="mt-4 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleExtract}
                                disabled={ocrLoading}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-admin-emerald to-admin-emerald-light text-white rounded-lg font-medium text-sm hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {ocrLoading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Reading form…
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-3z" clipRule="evenodd" />
                                        </svg>
                                        Extract with OCR
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2.5 border border-admin-border text-admin-text-secondary rounded-lg text-sm hover:bg-admin-bg transition-colors"
                            >
                                Change Photo
                            </button>
                            {ocrDone && ocrConfidence !== null && (
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${ocrConfidence >= 70 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    OCR confidence: {ocrConfidence.toFixed(0)}%
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* ── OCR Confirmation Banner ────────────────────────────────── */}
                {ocrDone && (
                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                        <svg className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-amber-800">OCR Complete — Please review all fields carefully</p>
                            <p className="text-xs text-amber-700 mt-0.5">
                                Handwriting recognition can make mistakes. Verify every field before submitting, especially names and phone numbers.
                            </p>
                            <button
                                type="button"
                                onClick={() => setShowRawText(v => !v)}
                                className="text-xs text-amber-700 underline mt-1 hover:text-amber-900"
                            >
                                {showRawText ? 'Hide' : 'Show'} raw OCR text
                            </button>
                            {showRawText && (
                                <pre className="mt-2 p-2 bg-amber-100 rounded text-xs text-amber-900 whitespace-pre-wrap max-h-40 overflow-y-auto font-mono">
                                    {ocrRawText || '(no text extracted)'}
                                </pre>
                            )}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ── Step 2: Inquiry Details ──────────────────────────── */}
                    <div className="bg-white rounded-lg border border-admin-border p-6 shadow-sm">
                        <h2 className="text-base font-semibold text-admin-text mb-4 flex items-center gap-2">
                            <span className="bg-admin-emerald text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                            Student & Parent Details
                            {ocrDone && <span className="text-xs text-admin-emerald font-normal">(pre-filled by OCR — please verify)</span>}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Student Name" name="studentName" required
                                value={fields.studentName}
                                onChange={v => setFields(f => ({ ...f, studentName: v }))} />

                            <Field label="Parent / Guardian Name" name="parentName"
                                value={fields.parentName}
                                onChange={v => setFields(f => ({ ...f, parentName: v }))} />

                            <Field label="Primary Phone" name="phone" type="tel" required
                                placeholder="10-digit mobile number"
                                value={fields.phone}
                                onChange={v => setFields(f => ({ ...f, phone: v }))} />

                            <Field label="Secondary Phone" name="secondaryPhone" type="tel"
                                placeholder="Optional"
                                value={fields.secondaryPhone}
                                onChange={v => setFields(f => ({ ...f, secondaryPhone: v }))} />

                            <Field label="Email" name="email" type="email"
                                value={fields.email}
                                onChange={v => setFields(f => ({ ...f, email: v }))} />

                            <Field label="Occupation" name="occupation"
                                placeholder="Parent's occupation"
                                value={fields.occupation}
                                onChange={v => setFields(f => ({ ...f, occupation: v }))} />

                            {/* DOB + Eligibility */}
                            <div>
                                <label className="block text-sm font-medium text-admin-text mb-1.5">
                                    Date of Birth
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        name="dob"
                                        value={fields.dob}
                                        onChange={e => setFields(f => ({ ...f, dob: e.target.value }))}
                                        className="w-full px-4 py-2 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-emerald focus:border-transparent outline-none transition-all text-sm bg-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={checkEligibility}
                                        className="whitespace-nowrap px-3 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 font-medium transition-colors text-xs"
                                    >
                                        Check Age
                                    </button>
                                </div>
                                {eligibilityMessage && (
                                    <p className={`text-xs mt-1.5 font-medium ${eligibilityMessage.type === 'success' ? 'text-green-700' : eligibilityMessage.type === 'error' ? 'text-red-600' : 'text-blue-700'}`}>
                                        {eligibilityMessage.text}
                                    </p>
                                )}
                            </div>

                            <Field label="Applying for Class" name="currentClass" required
                                placeholder="e.g. Nursery, Class 1"
                                value={fields.currentClass}
                                onChange={v => setFields(f => ({ ...f, currentClass: v }))} />

                            <Field label="Current School" name="currentSchool"
                                placeholder="School currently attending"
                                value={fields.currentSchool}
                                onChange={v => setFields(f => ({ ...f, currentSchool: v }))} />

                            <Field label="Board" name="board"
                                placeholder="CBSE / ICSE / SSC / State"
                                value={fields.board}
                                onChange={v => setFields(f => ({ ...f, board: v }))} />

                            <Field label="How Did They Hear About Us?" name="howHeard"
                                placeholder="e.g. Friend, Banner, Social Media"
                                value={fields.howHeard}
                                onChange={v => setFields(f => ({ ...f, howHeard: v }))} />

                            <div>
                                <label className="block text-sm font-medium text-admin-text mb-1.5">Day Scholar / Hostel</label>
                                <select
                                    name="dayScholarHostel"
                                    value={fields.dayScholarHostel}
                                    onChange={e => setFields(f => ({ ...f, dayScholarHostel: e.target.value }))}
                                    className="w-full px-4 py-2 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-emerald focus:border-transparent outline-none bg-white text-sm transition-all"
                                >
                                    <option value="">-- Select --</option>
                                    <option value="Day Scholar">Day Scholar</option>
                                    <option value="Hostel">Hostel</option>
                                    <option value="Not Decided">Not Decided</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ── Step 3: Counselor Assessment ─────────────────────── */}
                    <div className="bg-admin-bg rounded-lg border border-admin-border p-6 shadow-inner">
                        <h2 className="text-base font-semibold text-admin-text mb-4 flex items-center gap-2">
                            <span className="bg-admin-emerald text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                            Counselor Assessment
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-admin-text mb-1.5">Status</label>
                                <select
                                    name="status"
                                    defaultValue="New"
                                    className="w-full px-4 py-2 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-emerald focus:border-transparent outline-none bg-white text-sm transition-all"
                                >
                                    <option value="New">New</option>
                                    <option value="Follow-up">Follow-up</option>
                                    <option value="Converted">Converted</option>
                                    <option value="Casual Inquiry">Casual Inquiry</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-admin-text mb-1.5">Follow-up Date</label>
                                <input
                                    type="date"
                                    name="followUpDate"
                                    defaultValue={(() => {
                                        const d = new Date();
                                        d.setDate(d.getDate() + 2);
                                        return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                                    })()}
                                    className="w-full px-4 py-2 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-emerald focus:border-transparent outline-none bg-white text-sm transition-all"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-admin-text mb-1.5">Counselor Comments</label>
                                <textarea
                                    name="counselorComments"
                                    rows={3}
                                    placeholder="Enter initial assessment or notes…"
                                    className="w-full px-4 py-2 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-emerald focus:border-transparent outline-none resize-none bg-white text-sm transition-all"
                                />
                            </div>
                        </div>

                        {/* Hidden: counselor identity, source */}
                        <input type="hidden" name="counselorName" value={userName} />
                        <input type="hidden" name="source" value="PaperForm" />
                    </div>

                    {/* ── Submit ───────────────────────────────────────────── */}
                    <div className="flex gap-4">
                        <Link
                            href="/auth/dashboard"
                            className="flex-1 px-6 py-3 border border-admin-border text-admin-text rounded-lg hover:bg-white hover:shadow-sm transition text-center shadow-sm bg-white text-sm font-medium"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-admin-emerald to-admin-emerald-light text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                        >
                            {submitting ? 'Saving…' : 'Save Inquiry'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
