'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InquiryTypeToggle } from '@/components/dashboard/InquiryTypeToggle';

interface PaperFormUploadProps {
    userName: string;
}

export function PaperFormUpload({ userName }: PaperFormUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [dob, setDob] = useState('');
    const [eligibilityMessage, setEligibilityMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [calculatedClass, setCalculatedClass] = useState('');
    const router = useRouter();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

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
            setEligibilityMessage({ text: `Age ${ageInYears.toFixed(1)} yrs as of Apr 1, 2026. Too young for Nursery (Requires 3+).`, type: 'error' });
            setCalculatedClass('');
            return;
        }

        let eligibleGrade = '';
        if (ageInYears >= 3 && ageInYears < 4) eligibleGrade = 'Nursery';
        else if (ageInYears >= 4 && ageInYears < 5) eligibleGrade = 'LKG';
        else if (ageInYears >= 5 && ageInYears < 6) eligibleGrade = 'UKG';
        else if (ageInYears >= 6 && ageInYears < 7) eligibleGrade = 'Class 1';
        else if (ageInYears >= 7 && ageInYears < 8) eligibleGrade = 'Class 2';
        else if (ageInYears >= 8 && ageInYears < 9) eligibleGrade = 'Class 3';
        else if (ageInYears >= 9 && ageInYears < 10) eligibleGrade = 'Class 4';
        else if (ageInYears >= 10 && ageInYears < 11) eligibleGrade = 'Class 5';
        else if (ageInYears >= 11 && ageInYears < 12) eligibleGrade = 'Class 6';
        else if (ageInYears >= 12 && ageInYears < 13) eligibleGrade = 'Class 7';
        else if (ageInYears >= 13 && ageInYears < 14) eligibleGrade = 'Class 8';
        else if (ageInYears >= 14 && ageInYears < 15) eligibleGrade = 'Class 9';
        else if (ageInYears >= 15 && ageInYears < 16) eligibleGrade = 'Class 10';
        else return setEligibilityMessage({ text: `Age ${ageInYears.toFixed(1)} yrs as of Apr 1, 2026. Please verify higher classes manually.`, type: 'info' });

        setCalculatedClass(eligibleGrade);
        setEligibilityMessage({
            text: `✅ Eligible for ${eligibleGrade} (Age: ${ageInYears.toFixed(1)} yrs as of April 1, 2026).`,
            type: 'success'
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploading(true);

        const formData = new FormData(e.currentTarget);

        // Ensure calculated class is included if they didn't manually type it
        if (!formData.get('currentClass') && calculatedClass) {
            formData.set('currentClass', calculatedClass);
        }

        try {
            const response = await fetch('/api/counselor/upload-paper-form', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                alert('Paper form inquiry added successfully!');
                router.push('/auth/dashboard');
            } else {
                alert('Failed to add inquiry. Please try again.');
            }
        } catch (error) {
            alert('Error uploading form. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-admin-bg">
            <header className="bg-white border-b border-admin-border">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/auth/dashboard"
                            className="text-admin-text hover:text-admin-emerald transition-colors"
                        >
                            ← Back to Dashboard
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-admin-emerald to-admin-emerald-light bg-clip-text text-transparent">
                                New Inquiry (Paper Form)
                            </h1>
                            <p className="text-sm text-admin-text-secondary">
                                Upload and process paper inquiry form
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                <InquiryTypeToggle />
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Photo Upload */}
                    <div className="bg-white rounded-lg border border-admin-border p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-admin-text mb-4">
                            1. Upload Paper Form Photo
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="formPhoto"
                                    className="block w-full p-8 border-2 border-dashed border-admin-border rounded-lg text-center cursor-pointer hover:border-admin-emerald transition-colors bg-admin-bg/50 hover:bg-admin-bg"
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Form preview" className="max-h-64 mx-auto rounded shadow-sm" />
                                    ) : (
                                        <div>
                                            <svg
                                                className="mx-auto h-12 w-12 text-admin-text-secondary/40"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 48 48"
                                            >
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <p className="mt-2 text-sm text-admin-text-secondary">
                                                Click to upload paper form photo
                                            </p>
                                            <p className="text-xs text-admin-text-secondary/60 mt-1">
                                                PNG, JPG up to 10MB
                                            </p>
                                        </div>
                                    )}
                                </label>
                                <input
                                    id="formPhoto"
                                    name="formPhoto"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Manual Entry Form */}
                    <div className="bg-white rounded-lg border border-admin-border p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-admin-text mb-4">
                            2. Enter Inquiry Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-admin-text mb-2">
                                    Student Name *
                                </label>
                                <input
                                    type="text"
                                    name="studentName"
                                    required
                                    className="w-full px-4 py-2 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-emerald focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-admin-text mb-2">
                                    Date of Birth & CBSE Eligibility
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        className="w-full px-4 py-2 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-emerald focus:border-transparent outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={checkEligibility}
                                        className="whitespace-nowrap px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 font-medium transition-colors text-sm"
                                    >
                                        Check Age
                                    </button>
                                </div>
                                {eligibilityMessage && (
                                    <p className={`text-xs mt-2 font-medium ${eligibilityMessage.type === 'success' ? 'text-green-700' :
                                            eligibilityMessage.type === 'error' ? 'text-red-600' :
                                                'text-blue-700'
                                        }`}>
                                        {eligibilityMessage.text}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-admin-text mb-2">
                                    Current Class *
                                </label>
                                <input
                                    type="text"
                                    name="currentClass"
                                    required
                                    value={calculatedClass}
                                    onChange={(e) => setCalculatedClass(e.target.value)}
                                    placeholder="e.g. Nursery, Class 1"
                                    className="w-full px-4 py-2 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-emerald focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Counselor Assessment */}
                    <div className="bg-admin-bg rounded-lg border border-admin-border p-6 shadow-inner">
                        <h2 className="text-lg font-semibold text-admin-text mb-4">
                            3. Counselor Assessment
                        </h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-admin-text mb-2">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        defaultValue="New"
                                        className="w-full px-4 py-2 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-emerald focus:border-transparent outline-none bg-white transition-all"
                                    >
                                        <option value="New">New</option>
                                        <option value="Follow-up">Follow-up</option>
                                        <option value="Converted">Converted</option>
                                        <option value="Casual Inquiry">Casual Inquiry</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="followUpDate" className="block text-sm font-medium text-admin-text mb-2">
                                        Follow-up Date
                                    </label>
                                    <input
                                        type="date"
                                        name="followUpDate"
                                        defaultValue={(() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); })()}
                                        className="w-full px-4 py-2 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-emerald focus:border-transparent outline-none bg-white transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="counselorComments" className="block text-sm font-medium text-admin-text mb-2">
                                    Counselor Comments
                                </label>
                                <textarea
                                    name="counselorComments"
                                    rows={3}
                                    placeholder="Enter initial assessment or notes..."
                                    className="w-full px-4 py-2 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-emerald focus:border-transparent outline-none resize-none bg-white transition-all"
                                />
                            </div>

                            <input type="hidden" name="counselorName" value={userName} />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <Link
                            href="/auth/dashboard"
                            className="flex-1 px-6 py-3 border border-admin-border text-admin-text rounded-lg hover:bg-white hover:shadow-sm transition text-center shadow-sm bg-white"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-admin-emerald to-admin-emerald-light text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {uploading ? 'Uploading...' : 'Submit Inquiry'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
