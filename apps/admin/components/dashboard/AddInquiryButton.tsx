'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export function AddInquiryButton() {
    const router = useRouter();

    const handleClick = () => {
        // Direct navigation to default (Online)
        router.push('/students/add');
    };

    return (
        <button
            onClick={handleClick}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-admin-blue to-admin-purple text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-md"
        >
            <Plus size={20} />
            <span className="font-medium hidden sm:inline">Add Inquiry</span>
        </button>
    );
}
