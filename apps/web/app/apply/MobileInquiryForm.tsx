'use client';

import { useState } from 'react';
import { submitQRInquiry } from './action';

const GRADES = [
    'Pre-KG', 'LKG', 'UKG',
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
];

export function MobileInquiryForm() {
    const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        studentName: '',
        parentName: '',
        phone: '',
        grade: '',
        dayScholarHostel: '',
    });

    const set = (field: string, value: string) =>
        setForm(prev => ({ ...prev, [field]: value }));

    const handlePhone = (val: string) => {
        // strip non-digits then cap at 10
        const digits = val.replace(/\D/g, '').slice(0, 10);
        set('phone', digits);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (state === 'submitting') return;

        if (form.phone.length !== 10) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }

        setState('submitting');
        setError('');

        const result = await submitQRInquiry({
            studentName: form.studentName.trim(),
            parentName: form.parentName.trim(),
            phone: `+91${form.phone}`,
            grade: form.grade,
            dayScholarHostel: form.dayScholarHostel,
        });

        if (result.success) {
            setState('success');
        } else {
            setError(result.error ?? 'Something went wrong. Please try again.');
            setState('error');
        }
    };

    // ── Success screen ──────────────────────────────────────────────────────
    if (state === 'success') {
        return (
            <div className="flex flex-col items-center justify-center text-center px-6 py-16 gap-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
                    <p className="text-gray-600 text-base leading-relaxed">
                        We've received your inquiry. A counselor will call you shortly.
                    </p>
                </div>
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 text-left w-full max-w-sm">
                    <p className="font-semibold mb-1">What happens next?</p>
                    <ul className="space-y-1 list-disc list-inside text-amber-700">
                        <li>Counselor call within 24 hours</li>
                        <li>Campus visit scheduling</li>
                        <li>Admission process guidance</li>
                    </ul>
                </div>
            </div>
        );
    }

    // ── Form ─────────────────────────────────────────────────────────────────
    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Student Name */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Student's Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    required
                    value={form.studentName}
                    onChange={e => set('studentName', e.target.value)}
                    placeholder="Enter student's full name"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
            </div>

            {/* Parent Name */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Parent / Guardian Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    required
                    value={form.parentName}
                    onChange={e => set('parentName', e.target.value)}
                    placeholder="Enter parent's full name"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
            </div>

            {/* Phone */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                    <span className="flex items-center px-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium text-base">
                        +91
                    </span>
                    <input
                        type="tel"
                        required
                        inputMode="numeric"
                        maxLength={10}
                        value={form.phone}
                        onChange={e => handlePhone(e.target.value)}
                        placeholder="10-digit number"
                        className="flex-1 px-4 py-3.5 rounded-r-xl border border-gray-200 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Grade */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Grade Interested In <span className="text-red-500">*</span>
                </label>
                <select
                    required
                    value={form.grade}
                    onChange={e => set('grade', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent appearance-none"
                >
                    <option value="">Select grade</option>
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>

            {/* Day Scholar / Hostel */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preference
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {['Day Scholar', 'Hostel'].map(opt => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => set('dayScholarHostel', opt)}
                            className={`py-3.5 rounded-xl border text-sm font-semibold transition-all ${
                                form.dayScholarHostel === opt
                                    ? 'bg-amber-500 border-amber-500 text-white shadow-md'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300'
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error */}
            {(state === 'error' || error) && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={state === 'submitting'}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-base rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {state === 'submitting' ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Submitting…
                    </span>
                ) : 'Submit Inquiry'}
            </button>

            <p className="text-center text-xs text-gray-400 pb-2">
                Your information is safe and will only be used to contact you about admissions.
            </p>
        </form>
    );
}
