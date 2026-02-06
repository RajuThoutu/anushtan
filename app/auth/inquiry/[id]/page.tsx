import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/auth-config';
import { getInquiryById } from '@/lib/sheets/client';
import { InquiryDetailView } from './InquiryDetailView';

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/api/auth/signin');
    }

    const { id } = await params;
    const inquiryId = id; // Keep as string (S-1, S-2, etc.)

    if (!inquiryId) {
        return (
            <div className="min-h-screen bg-anushtan-parchment flex items-center justify-center">
                <div className="text-center">
                    <p className="text-anushtan-charcoal/60">Invalid inquiry ID</p>
                    <a href="/auth/dashboard" className="text-anushtan-terracotta hover:underline mt-4 inline-block">
                        Back to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    let inquiry;
    try {
        inquiry = await getInquiryById(inquiryId);
    } catch (error) {
        return (
            <div className="min-h-screen bg-anushtan-parchment flex items-center justify-center">
                <div className="text-center">
                    <p className="text-anushtan-charcoal/60">Inquiry not found</p>
                    <a href="/auth/dashboard" className="text-anushtan-terracotta hover:underline mt-4 inline-block">
                        Back to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    return <InquiryDetailView inquiry={inquiry} userName={session.user.name} />;
}
