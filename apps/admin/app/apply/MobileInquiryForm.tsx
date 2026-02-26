'use client';

import { useState, useEffect } from 'react';
import { submitQRInquiry } from './action';

const GRADES = [
    'Pre-KG', 'LKG', 'UKG',
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
];

const BOARDS = ['CBSE', 'ICSE', 'Telangana State Board', 'AP State Board', 'IB', 'IGCSE', 'Other'];

const LEAD_SOURCES = [
    'Word of Mouth',
    'Social Media',
    'Newspaper / Print Ad',
    'Hoarding / Banner',
    'School Event',
    'Online Search',
    'Other',
];

/** Today's access code: ddmm in IST */
function todayCode(): string {
    const now = new Date();
    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const dd = String(ist.getUTCDate()).padStart(2, '0');
    const mm = String(ist.getUTCMonth() + 1).padStart(2, '0');
    return `${dd}${mm}`;
}

export function MobileInquiryForm() {
    const [unlocked, setUnlocked] = useState(false);
    const [codeInput, setCodeInput] = useState('');
    const [codeError, setCodeError] = useState(false);

    const [dob, setDob] = useState('');
    const [eligibilityMessage, setEligibilityMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

    const [schoolsList, setSchoolsList] = useState<string[]>([]);

    const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        studentName: '',
        parentName: '',
        phone: '',
        email: '',
        grade: '',
        dayScholarHostel: '',
        board: '',
        currentSchool: '',
        howHeard: '',
    });

    const set = (field: string, value: string) =>
        setForm(prev => ({ ...prev, [field]: value }));

    const handlePhone = (val: string) => {
        const digits = val.replace(/\D/g, '').slice(0, 10);
        set('phone', digits);
    };

    useEffect(() => {
        fetch('/api/schools')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSchoolsList(data);
                }
            })
            .catch(err => console.error('Failed to load schools:', err));
    }, []);

    const checkEligibility = () => {
        if (!dob) {
            setEligibilityMessage({ text: 'Please enter a Date of Birth first.', type: 'error' });
            return;
        }

        const birthDate = new Date(dob);
        const cutoffDate = new Date('2026-04-01');

        let ageInMilliseconds = cutoffDate.getTime() - birthDate.getTime();
        let ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

        if (ageInYears < 3) {
            setEligibilityMessage({ text: `Age ${ageInYears.toFixed(1)} yrs as of Apr 1, 2026. Too young for Pre-KG (Requires 3+).`, type: 'error' });
            set('grade', '');
            return;
        }

        let eligibleGrade = '';
        if (ageInYears >= 3 && ageInYears < 4) eligibleGrade = 'Pre-KG';
        else if (ageInYears >= 4 && ageInYears < 5) eligibleGrade = 'LKG';
        else if (ageInYears >= 5 && ageInYears < 6) eligibleGrade = 'UKG';
        else if (ageInYears >= 6 && ageInYears < 7) eligibleGrade = 'Grade 1';
        else if (ageInYears >= 7 && ageInYears < 8) eligibleGrade = 'Grade 2';
        else if (ageInYears >= 8 && ageInYears < 9) eligibleGrade = 'Grade 3';
        else if (ageInYears >= 9 && ageInYears < 10) eligibleGrade = 'Grade 4';
        else if (ageInYears >= 10 && ageInYears < 11) eligibleGrade = 'Grade 5';
        else if (ageInYears >= 11 && ageInYears < 12) eligibleGrade = 'Grade 6';
        else if (ageInYears >= 12 && ageInYears < 13) eligibleGrade = 'Grade 7';
        else if (ageInYears >= 13 && ageInYears < 14) eligibleGrade = 'Grade 8';
        else if (ageInYears >= 14 && ageInYears < 15) eligibleGrade = 'Grade 9';
        else if (ageInYears >= 15 && ageInYears < 16) eligibleGrade = 'Grade 10';
        else {
            setEligibilityMessage({ text: `Age ${ageInYears.toFixed(1)} yrs as of Apr 1, 2026. Please verify higher classes manually.`, type: 'info' });
            return;
        }

        set('grade', eligibleGrade);
        setEligibilityMessage({
            text: `✅ Eligible for ${eligibleGrade} (Age: ${ageInYears.toFixed(1)} yrs as of April 1, 2026).`,
            type: 'success'
        });
    };

    const handleCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (codeInput.trim() === todayCode()) {
            setUnlocked(true);
            setCodeError(false);
        } else {
            setCodeError(true);
            setCodeInput('');
        }
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
            email: form.email.trim(),
            grade: form.grade,
            dayScholarHostel: form.dayScholarHostel,
            board: form.board,
            currentSchool: form.currentSchool.trim(),
            howHeard: form.howHeard,
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

    // ── Access code gate ────────────────────────────────────────────────────
    if (!unlocked) {
        return (
            <form onSubmit={handleCodeSubmit} className="space-y-6">
                <div className="flex flex-col items-center text-center gap-3 py-4">
                    <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
                        <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Enter Access Code</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Ask our team at the event for today's code.
                        </p>
                    </div>
                </div>

                <div>
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        required
                        autoFocus
                        value={codeInput}
                        onChange={e => {
                            setCodeInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                            setCodeError(false);
                        }}
                        placeholder="4-digit code"
                        className={`w-full px-4 py-4 text-center text-2xl font-bold tracking-widest rounded-xl border ${codeError
                            ? 'border-red-400 bg-red-50 text-red-700 focus:ring-red-400'
                            : 'border-gray-200 bg-white text-gray-900 focus:ring-amber-400'
                            } focus:outline-none focus:ring-2 focus:border-transparent transition`}
                    />
                    {codeError && (
                        <p className="mt-2 text-sm text-red-600 text-center font-medium">
                            Incorrect code. Please try again.
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={codeInput.length < 4}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-base rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Continue
                </button>
            </form>
        );
    }

    // ── Inquiry form ─────────────────────────────────────────────────────────
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

            {/* Optional Email */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
            </div>

            {/* Date of Birth & CBSE Calculator */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Date of Birth & CBSE Eligibility
                </label>
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                    <button
                        type="button"
                        onClick={checkEligibility}
                        className="whitespace-nowrap px-4 py-3.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-100 font-medium transition-colors text-sm"
                    >
                        Check Age
                    </button>
                </div>
                {eligibilityMessage && (
                    <p className={`text-sm mt-2 font-medium ${eligibilityMessage.type === 'success' ? 'text-green-700' :
                        eligibilityMessage.type === 'error' ? 'text-red-600' :
                            'text-blue-700'
                        }`}>
                        {eligibilityMessage.text}
                    </p>
                )}
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

            <div>
                <label htmlFor="currentSchool" className="block text-sm font-semibold text-gray-700 mb-1.5" id="currentSchoolLabel">
                    Current School
                </label>
                <input
                    type="text"
                    id="currentSchool"
                    list="school-suggestions"
                    value={form.currentSchool}
                    onChange={e => set('currentSchool', e.target.value)}
                    placeholder="Enter current school name"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
                <datalist id="school-suggestions">
                    {schoolsList.map(school => (
                        <option key={school} value={school} />
                    ))}
                </datalist>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Board
                </label>
                <select
                    value={form.board}
                    onChange={e => set('board', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent appearance-none"
                >
                    <option value="">Select board</option>
                    {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    How did you hear about us?
                </label>
                <select
                    value={form.howHeard}
                    onChange={e => set('howHeard', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent appearance-none"
                >
                    <option value="">Select source</option>
                    {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
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
                            className={`py-3.5 rounded-xl border text-sm font-semibold transition-all ${form.dayScholarHostel === opt
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
