import type { Metadata } from 'next';
import { MobileInquiryForm } from './MobileInquiryForm';

export const metadata: Metadata = {
    title: 'Apply — Anushtan Indic School',
    description: 'Fill in your details and a counselor will reach out to you shortly.',
};

export default function ApplyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-500 px-5 pt-10 pb-8 text-white">
                <div className="max-w-md mx-auto">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 text-2xl font-bold shadow-lg">
                        A
                    </div>
                    <h1 className="text-2xl font-bold leading-tight mb-1">
                        Anushtan Indic School
                    </h1>
                    <p className="text-white/80 text-sm">
                        Ancient Roots, Global Minds — Siddipet
                    </p>
                </div>
            </div>

            {/* Form card */}
            <div className="flex-1 px-4 -mt-4">
                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Admission Inquiry</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Fill in your details and a counselor will reach out to you within 24 hours.
                    </p>
                    <MobileInquiryForm />
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 pb-8">
                    Anushtan Indic School · Siddipet, Telangana
                </p>
            </div>
        </div>
    );
}
