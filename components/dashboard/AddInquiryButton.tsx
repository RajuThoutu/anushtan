'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export function AddInquiryButton() {
    const router = useRouter();

    const handleClick = () => {
        // Direct navigation to default (Online)
        router.push('/auth/students/add');
    };

    return (
        <button
            onClick={handleClick}
            className="flex items-center gap-2 px-4 py-2 bg-anushtan-terracotta text-white rounded-lg hover:bg-anushtan-terracotta/90 transition shadow-lg shadow-anushtan-terracotta/20"
        >
            <Plus size={20} />
            <span className="font-medium hidden sm:inline">Add Inquiry</span>
        </button>
    );
}
