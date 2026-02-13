'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Globe, FileText } from 'lucide-react';

export function InquiryTypeToggle() {
    const router = useRouter();
    const pathname = usePathname();

    // Check if we are on the online form page
    const isOnline = pathname === '/students/add';

    return (
        <div className="flex justify-center mb-8">
            <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm flex gap-1">
                <button
                    onClick={() => router.push('/students/add')}
                    className={`
                        flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                        ${isOnline
                            ? 'bg-anushtan-terracotta text-white shadow-md'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }
                    `}
                >
                    <Globe size={18} />
                    Online Entry
                </button>
                <button
                    onClick={() => router.push('/inquiry/new')}
                    className={`
                        flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                        ${!isOnline
                            ? 'bg-anushtan-terracotta text-white shadow-md'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }
                    `}
                >
                    <FileText size={18} />
                    Paper Inquiry
                </button>
            </div>
        </div>
    );
}
