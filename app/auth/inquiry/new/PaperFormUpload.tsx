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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploading(true);

        const formData = new FormData(e.currentTarget);

        try {
            // For now, just submit the form data without OCR
            // OCR can be added later as an enhancement
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
        <div className="min-h-screen bg-anushtan-parchment">
            {/* Header */}
            <header className="bg-white border-b border-anushtan-border">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/auth/dashboard"
                            className="text-anushtan-charcoal hover:text-anushtan-terracotta"
                        >
                            ← Back to Dashboard
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-anushtan-charcoal">New Inquiry (Paper Form)</h1>
                            <p className="text-sm text-anushtan-charcoal/60">Upload and process paper inquiry form</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                <InquiryTypeToggle />
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Photo Upload */}
                    <div className="bg-white rounded-lg border border-anushtan-border p-6">
                        <h2 className="text-lg font-semibold text-anushtan-charcoal mb-4">
                            1. Upload Paper Form Photo
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="formPhoto"
                                    className="block w-full p-8 border-2 border-dashed border-anushtan-border rounded-lg text-center cursor-pointer hover:border-anushtan-terracotta transition"
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Form preview" className="max-h-64 mx-auto" />
                                    ) : (
                                        <div>
                                            <svg
                                                className="mx-auto h-12 w-12 text-anushtan-charcoal/40"
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
                                            <p className="mt-2 text-sm text-anushtan-charcoal/60">
                                                Click to upload paper form photo
                                            </p>
                                            <p className="text-xs text-anushtan-charcoal/40 mt-1">
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
                    <div className="bg-white rounded-lg border border-anushtan-border p-6">
                        <h2 className="text-lg font-semibold text-anushtan-charcoal mb-4">
                            2. Enter Inquiry Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                    Student Name *
                                </label>
                                <input
                                    type="text"
                                    name="studentName"
                                    required
                                    className="w-full px-4 py-2 border border-anushtan-border rounded-lg focus:ring-2 focus:ring-anushtan-terracotta focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                    Current Class *
                                </label>
                                <input
                                    type="text"
                                    name="currentClass"
                                    required
                                    className="w-full px-4 py-2 border border-anushtan-border rounded-lg focus:ring-2 focus:ring-anushtan-terracotta focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Counselor Assessment */}
                    <div className="bg-anushtan-gold/10 rounded-lg border border-anushtan-gold/30 p-6">
                        <h2 className="text-lg font-semibold text-anushtan-charcoal mb-4">
                            3. Counselor Assessment
                        </h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        defaultValue="New"
                                        className="w-full px-4 py-2 border border-anushtan-border rounded-lg focus:ring-2 focus:ring-anushtan-terracotta focus:border-transparent outline-none"
                                    >
                                        <option value="New">New</option>
                                        <option value="Open">Open (Assigned)</option>
                                        <option value="Follow-up">Follow-up</option>
                                        <option value="Converted">Converted</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="followUpDate" className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                        Follow-up Date
                                    </label>
                                    <input
                                        type="date"
                                        name="followUpDate"
                                        className="w-full px-4 py-2 border border-anushtan-border rounded-lg focus:ring-2 focus:ring-anushtan-terracotta focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="counselorComments" className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                    Counselor Comments
                                </label>
                                <textarea
                                    name="counselorComments"
                                    rows={3}
                                    placeholder="Enter initial assessment or notes..."
                                    className="w-full px-4 py-2 border border-anushtan-border rounded-lg focus:ring-2 focus:ring-anushtan-terracotta focus:border-transparent outline-none resize-none"
                                />
                            </div>

                            <input type="hidden" name="counselorName" value={userName} />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <Link
                            href="/auth/dashboard"
                            className="flex-1 px-6 py-3 border border-anushtan-border text-anushtan-charcoal rounded-lg hover:bg-anushtan-parchment transition text-center"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="flex-1 px-6 py-3 bg-anushtan-terracotta text-white rounded-lg hover:bg-anushtan-terracotta/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? 'Uploading...' : 'Submit Inquiry'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
