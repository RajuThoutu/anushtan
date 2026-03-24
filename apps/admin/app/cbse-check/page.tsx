'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { GraduationCap, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';

const CBSE_AGE_TABLE = [
    { class: 'Nursery / Pre-KG', minAge: 3, maxAge: 3, dob_year: '2022–2023' },
    { class: 'LKG (Lower KG)',   minAge: 4, maxAge: 4, dob_year: '2021–2022' },
    { class: 'UKG (Upper KG)',   minAge: 5, maxAge: 5, dob_year: '2020–2021' },
    { class: 'Class 1',          minAge: 6, maxAge: 6, dob_year: '2019–2020' },
    { class: 'Class 2',          minAge: 7, maxAge: 7, dob_year: '2018–2019' },
    { class: 'Class 3',          minAge: 8, maxAge: 8, dob_year: '2017–2018' },
    { class: 'Class 4',          minAge: 9, maxAge: 9, dob_year: '2016–2017' },
    { class: 'Class 5',          minAge: 10, maxAge: 10, dob_year: '2015–2016' },
    { class: 'Class 6',          minAge: 11, maxAge: 11, dob_year: '2014–2015' },
    { class: 'Class 7',          minAge: 12, maxAge: 12, dob_year: '2013–2014' },
    { class: 'Class 8',          minAge: 13, maxAge: 13, dob_year: '2012–2013' },
    { class: 'Class 9',          minAge: 14, maxAge: 14, dob_year: '2011–2012' },
    { class: 'Class 10',         minAge: 15, maxAge: 15, dob_year: '2010–2011' },
];

const CUTOFF_DATE = new Date('2026-04-01');

function getAgeOnCutoff(dob: string): number {
    const birth = new Date(dob);
    const ms = CUTOFF_DATE.getTime() - birth.getTime();
    return ms / (1000 * 60 * 60 * 24 * 365.25);
}

type ResultType = { grade: string; age: number; status: 'eligible' | 'too_young' | 'too_old' } | null;

export default function CBSECheckPage() {
    const [dob, setDob] = useState('');
    const [result, setResult] = useState<ResultType>(null);
    const [highlightClass, setHighlightClass] = useState<string | null>(null);

    const checkEligibility = () => {
        if (!dob) return;
        const age = getAgeOnCutoff(dob);

        if (age < 3) {
            setResult({ grade: '', age, status: 'too_young' });
            setHighlightClass(null);
            return;
        }
        if (age >= 16) {
            setResult({ grade: '', age, status: 'too_old' });
            setHighlightClass(null);
            return;
        }

        const row = CBSE_AGE_TABLE.find(r => age >= r.minAge && age < r.minAge + 1);
        if (row) {
            setResult({ grade: row.class, age, status: 'eligible' });
            setHighlightClass(row.class);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') checkEligibility();
    };

    return (
        <DashboardLayout>
            <div className="p-4 sm:p-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-admin-blue to-admin-purple rounded-xl flex items-center justify-center shadow">
                            <GraduationCap size={22} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-heading text-2xl sm:text-3xl font-bold bg-gradient-to-r from-admin-blue to-admin-purple bg-clip-text text-transparent leading-tight">
                                CBSE Age Eligibility
                            </h1>
                            <p className="text-admin-text-secondary text-sm">
                                Check class eligibility based on CBSE age norms (cutoff: April 1, 2026)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Eligibility Checker Card */}
                <div className="bg-white rounded-2xl border border-admin-border shadow-sm p-5 sm:p-6 mb-6">
                    <h2 className="font-semibold text-gray-800 text-base mb-4 flex items-center gap-2">
                        <Calendar size={18} className="text-admin-blue" />
                        Check Student Eligibility
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                value={dob}
                                onChange={e => { setDob(e.target.value); setResult(null); setHighlightClass(null); }}
                                onKeyDown={handleKeyDown}
                                className="w-full border border-admin-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-admin-blue/40 focus:border-admin-blue transition"
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="sm:pt-6">
                            <button
                                onClick={checkEligibility}
                                disabled={!dob}
                                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-admin-blue to-admin-purple text-white font-semibold rounded-xl shadow hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                            >
                                Check Eligibility
                            </button>
                        </div>
                    </div>

                    {/* Result */}
                    {result && (
                        <div className={`mt-4 rounded-xl px-5 py-4 flex items-start gap-3 ${
                            result.status === 'eligible'
                                ? 'bg-green-50 border border-green-200'
                                : result.status === 'too_young'
                                ? 'bg-red-50 border border-red-200'
                                : 'bg-amber-50 border border-amber-200'
                        }`}>
                            {result.status === 'eligible' && <CheckCircle size={22} className="text-green-500 shrink-0 mt-0.5" />}
                            {result.status === 'too_young' && <XCircle size={22} className="text-red-500 shrink-0 mt-0.5" />}
                            {result.status === 'too_old' && <AlertCircle size={22} className="text-amber-500 shrink-0 mt-0.5" />}
                            <div>
                                {result.status === 'eligible' && (
                                    <>
                                        <p className="font-bold text-green-800 text-sm">
                                            Eligible for {result.grade}
                                        </p>
                                        <p className="text-green-700 text-xs mt-0.5">
                                            Age as of April 1, 2026: <strong>{result.age.toFixed(1)} years</strong>
                                        </p>
                                    </>
                                )}
                                {result.status === 'too_young' && (
                                    <>
                                        <p className="font-bold text-red-800 text-sm">Too young for admission</p>
                                        <p className="text-red-700 text-xs mt-0.5">
                                            Age as of April 1, 2026: <strong>{result.age.toFixed(1)} years</strong> — Minimum 3 years required for Nursery.
                                        </p>
                                    </>
                                )}
                                {result.status === 'too_old' && (
                                    <>
                                        <p className="font-bold text-amber-800 text-sm">Above Class 10 range</p>
                                        <p className="text-amber-700 text-xs mt-0.5">
                                            Age as of April 1, 2026: <strong>{result.age.toFixed(1)} years</strong> — Please verify eligibility manually for Class 11 and above.
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Age Eligibility Table */}
                <div className="bg-white rounded-2xl border border-admin-border shadow-sm overflow-hidden">
                    <div className="px-5 sm:px-6 py-4 border-b border-admin-border">
                        <h2 className="font-semibold text-gray-800 text-base">
                            CBSE Age Eligibility Chart
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            As per CBSE norms — Age calculated as of <strong>April 1, 2026</strong>
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-admin-border">
                                    <th className="text-left px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider w-8">#</th>
                                    <th className="text-left px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider">Class</th>
                                    <th className="text-left px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider">Age on Apr 1, 2026</th>
                                    <th className="text-left px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider">Born Between (approx.)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CBSE_AGE_TABLE.map((row, i) => {
                                    const isHighlighted = highlightClass === row.class;
                                    return (
                                        <tr
                                            key={row.class}
                                            className={`border-b border-gray-100 transition-colors ${
                                                isHighlighted
                                                    ? 'bg-green-50 border-green-200'
                                                    : i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                            }`}
                                        >
                                            <td className="px-5 py-3.5 text-gray-400 text-xs font-medium">{i + 1}</td>
                                            <td className="px-4 py-3.5">
                                                <span className={`font-semibold ${isHighlighted ? 'text-green-700' : 'text-gray-800'}`}>
                                                    {row.class}
                                                </span>
                                                {isHighlighted && (
                                                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                                        <CheckCircle size={10} /> ELIGIBLE
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                                                    isHighlighted
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-admin-blue/10 text-admin-blue'
                                                }`}>
                                                    {row.minAge}
                                                </span>
                                                <span className="ml-2 text-gray-500 text-xs">years completed</span>
                                            </td>
                                            <td className="px-4 py-3.5 text-gray-500 text-xs">
                                                {row.dob_year}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-5 py-3 bg-gray-50 border-t border-admin-border">
                        <p className="text-xs text-gray-400">
                            * A child must have completed the stated age by <strong>April 1, 2026</strong> to be eligible for admission to that class.
                            Age range shown is the completed age — child must be at least that age but less than 1 year older.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
