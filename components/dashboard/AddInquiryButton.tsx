'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Globe } from 'lucide-react';

export function AddInquiryButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'online' | 'paper'>('online');
    const router = useRouter();

    const handleProceed = () => {
        setIsOpen(false);
        if (mode === 'paper') {
            router.push('/auth/inquiry/new');
        } else {
            router.push('/auth/students/add');
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-anushtan-terracotta text-white rounded-lg hover:bg-anushtan-terracotta/90 transition shadow-lg shadow-anushtan-terracotta/20"
            >
                <Plus size={20} />
                <span className="font-medium hidden sm:inline">Add Inquiry</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-anushtan-charcoal">New Inquiry</h2>
                            <p className="text-sm text-gray-500 mt-1">Select inquiry method</p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Online Option */}
                            <label className={`
                                flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all group
                                ${mode === 'online'
                                    ? 'border-anushtan-terracotta bg-anushtan-terracotta/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                }
                            `}>
                                <input
                                    type="radio"
                                    name="inquiryType"
                                    value="online"
                                    checked={mode === 'online'}
                                    onChange={() => setMode('online')}
                                    className="w-5 h-5 text-anushtan-terracotta focus:ring-anushtan-terracotta"
                                />
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={`p-2 rounded-lg transition-colors ${mode === 'online' ? 'bg-anushtan-terracotta text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
                                        <Globe size={24} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Online Entry (Default)</div>
                                        <div className="text-xs text-gray-500">Standard digital form</div>
                                    </div>
                                </div>
                            </label>

                            {/* Paper Option */}
                            <label className={`
                                flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all group
                                ${mode === 'paper'
                                    ? 'border-anushtan-terracotta bg-anushtan-terracotta/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                }
                            `}>
                                <input
                                    type="radio"
                                    name="inquiryType"
                                    value="paper"
                                    checked={mode === 'paper'}
                                    onChange={() => setMode('paper')}
                                    className="w-5 h-5 text-anushtan-terracotta focus:ring-anushtan-terracotta"
                                />
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={`p-2 rounded-lg transition-colors ${mode === 'paper' ? 'bg-anushtan-terracotta text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Paper Inquiry</div>
                                        <div className="text-xs text-gray-500">Upload photo & counselor notes</div>
                                    </div>
                                </div>
                            </label>
                        </div>

                        <div className="p-6 bg-gray-50 flex gap-3 justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleProceed}
                                className="px-6 py-2 bg-anushtan-terracotta text-white rounded-lg hover:bg-anushtan-terracotta/90 transition font-medium shadow-lg shadow-anushtan-terracotta/20"
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
