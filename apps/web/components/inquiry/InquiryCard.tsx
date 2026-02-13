import type { SheetInquiry as Inquiry } from '@repo/database';
import Link from 'next/link';

interface InquiryCardProps {
    inquiry: Inquiry;
    showAssignButton?: boolean;
    onAssign?: (id: string) => void;
}

export function InquiryCard({ inquiry, showAssignButton = false, onAssign }: InquiryCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Interested':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'Follow-up':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Enrolled':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const timeAgo = (timestamp: string) => {
        const now = new Date();
        const then = new Date(timestamp);
        const diffMs = now.getTime() - then.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    return (
        <div className="bg-white border border-anushtan-border rounded-lg p-4 hover:shadow-md transition-shadow">
            <Link href={`/auth/inquiry/${inquiry.id}`} className="block">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="font-semibold text-anushtan-charcoal text-lg mb-1">
                            {inquiry.studentName}
                        </h3>
                        <p className="text-sm text-anushtan-charcoal/60">
                            {inquiry.currentClass} • {inquiry.parentName}
                        </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status}
                    </span>
                </div>

                <div className="space-y-1 text-sm text-anushtan-charcoal/70">
                    <p>📞 {inquiry.phone}</p>
                    {inquiry.howHeard && <p>📢 {inquiry.howHeard}</p>}
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-anushtan-charcoal/50">
                    <span>{timeAgo(inquiry.timestamp)}</span>
                    {inquiry.source && (
                        <span className="px-2 py-1 bg-anushtan-parchment rounded">
                            {inquiry.source}
                        </span>
                    )}
                </div>
            </Link>

            {showAssignButton && onAssign && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onAssign(inquiry.id);
                    }}
                    className="mt-3 w-full px-3 py-2 bg-anushtan-terracotta text-white text-sm rounded-lg hover:bg-anushtan-terracotta/90 transition"
                >
                    Assign to Me
                </button>
            )}
        </div>
    );
}
