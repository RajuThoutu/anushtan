'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { submitInquiry } from '@/app/actions/inquiry';

interface FormData {
    name: string;
    email: string;
    phone: string;
    grade: string;
    notes: string;
}

export function AdmissionsForm() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '+91-',
        grade: '',
        notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const grades = [
        'Pre-K',
        'Kindergarten',
        'Grade 1',
        'Grade 2',
        'Grade 3',
        'Grade 4',
        'Grade 5',
        'Grade 6',
        'Grade 7',
        'Grade 8',
        'Grade 9',
        'Grade 10',
        'Grade 11',
        'Grade 12'
    ];

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        try {
            // Call the server action with mapped field names
            const result = await submitInquiry({
                studentName: formData.name,
                email: formData.email,
                phone: formData.phone,
                course: formData.grade,
                message: formData.notes
            });

            if (result.success) {
                setSubmitStatus('success');
                // Clear form on success
                setFormData({
                    name: '',
                    email: '',
                    phone: '+91-',
                    grade: '',
                    notes: ''
                });
            } else {
                setSubmitStatus('error');
                setErrorMessage(result.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmitStatus('error');
            setErrorMessage('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Special handling for phone field
        if (name === 'phone') {
            let phoneValue = value;

            // Remove all +91 prefixes (with or without dash)
            phoneValue = phoneValue.replace(/^(\+91-?)+/g, '');

            // Remove any leading dashes, plus signs, or whitespace
            phoneValue = phoneValue.replace(/^[-+\s]+/, '');

            // Always ensure +91- prefix
            phoneValue = '+91-' + phoneValue;

            setFormData(prev => ({ ...prev, [name]: phoneValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-anushtan-charcoal mb-2">
                    Full Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta focus:border-transparent transition-all bg-white text-anushtan-charcoal"
                    placeholder="Enter student's full name"
                />
            </div>

            {/* Email Field */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-anushtan-charcoal mb-2">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta focus:border-transparent transition-all bg-white text-anushtan-charcoal"
                    placeholder="your.email@example.com"
                />
            </div>

            {/* Phone Field */}
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-anushtan-charcoal mb-2">
                    Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta focus:border-transparent transition-all bg-white text-anushtan-charcoal"
                    placeholder="+91-9044454441"
                />
            </div>

            {/* Grade Selection */}
            <div>
                <label htmlFor="grade" className="block text-sm font-medium text-anushtan-charcoal mb-2">
                    Grade Interested In <span className="text-red-500">*</span>
                </label>
                <select
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta focus:border-transparent transition-all bg-white text-anushtan-charcoal"
                >
                    <option value="">Select a grade</option>
                    {grades.map(grade => (
                        <option key={grade} value={grade}>
                            {grade}
                        </option>
                    ))}
                </select>
            </div>

            {/* Additional Notes */}
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-anushtan-charcoal mb-2">
                    Additional Notes
                </label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta focus:border-transparent transition-all bg-white text-anushtan-charcoal resize-none"
                    placeholder="Any additional information you'd like to share..."
                />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-anushtan-terracotta text-white rounded-lg font-medium text-lg hover:bg-anushtan-terracotta/90 focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Sending...' : 'Schedule a Visit'}
                </button>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    <p className="font-medium">Inquiry sent successfully!</p>
                    <p className="text-sm mt-1">We'll get back to you shortly to schedule your campus visit.</p>
                </div>
            )}

            {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    <p className="font-medium">Oops! Something went wrong.</p>
                    <p className="text-sm mt-1">{errorMessage || 'Please try again or contact us directly at +91-9044454441.'}</p>
                </div>
            )}
        </form>
    );
}
