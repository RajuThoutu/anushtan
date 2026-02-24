'use client';

import { TrendingUp, TrendingDown, AlertTriangle, UserX, CheckCircle2, Users } from 'lucide-react';

interface DirectorKpiCardsProps {
    thisMonthTotal: number;
    lastMonthTotal: number;
    thisMonthConverted: number;
    lastMonthConverted: number;
    overdueFollowUps: number;
    unassigned: number;
}

function TrendBadge({ current, previous }: { current: number; previous: number }) {
    if (previous === 0) return <span className="text-xs text-admin-text-secondary">No prior data</span>;
    const pct = (((current - previous) / previous) * 100).toFixed(1);
    const up = current >= previous;
    return (
        <span className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-emerald-600' : 'text-red-500'}`}>
            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {up ? '+' : ''}{pct}% vs last month
        </span>
    );
}

export function DirectorKpiCards({
    thisMonthTotal,
    lastMonthTotal,
    thisMonthConverted,
    lastMonthConverted,
    overdueFollowUps,
    unassigned
}: DirectorKpiCardsProps) {
    const convRate = thisMonthTotal > 0 ? ((thisMonthConverted / thisMonthTotal) * 100).toFixed(1) : '0';
    const prevConvRate = lastMonthTotal > 0 ? (lastMonthConverted / lastMonthTotal) * 100 : 0;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* This Month Inquiries */}
            <div className="bg-white rounded-xl border border-admin-border shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-admin-text-secondary uppercase tracking-wide">This Month</span>
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Users size={15} className="text-blue-600" />
                    </div>
                </div>
                <p className="text-3xl font-bold text-admin-charcoal">{thisMonthTotal}</p>
                <p className="text-sm text-admin-text-secondary mt-0.5 mb-2">New Inquiries</p>
                <TrendBadge current={thisMonthTotal} previous={lastMonthTotal} />
            </div>

            {/* This Month Conversions */}
            <div className="bg-white rounded-xl border border-admin-border shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-admin-text-secondary uppercase tracking-wide">This Month</span>
                    <div className="p-2 bg-emerald-50 rounded-lg">
                        <CheckCircle2 size={15} className="text-emerald-600" />
                    </div>
                </div>
                <p className="text-3xl font-bold text-admin-charcoal">
                    {thisMonthConverted}
                    <span className="text-base font-semibold text-emerald-600 ml-1.5">({convRate}%)</span>
                </p>
                <p className="text-sm text-admin-text-secondary mt-0.5 mb-2">Conversions</p>
                <TrendBadge current={parseFloat(convRate)} previous={prevConvRate} />
            </div>

            {/* Overdue Follow-ups */}
            <div className={`rounded-xl border shadow-sm p-5 transition-colors ${overdueFollowUps > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-admin-border'}`}>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-admin-text-secondary uppercase tracking-wide">Needs Action</span>
                    <div className={`p-2 rounded-lg ${overdueFollowUps > 0 ? 'bg-red-100' : 'bg-gray-50'}`}>
                        <AlertTriangle size={15} className={overdueFollowUps > 0 ? 'text-red-600' : 'text-gray-400'} />
                    </div>
                </div>
                <p className={`text-3xl font-bold ${overdueFollowUps > 0 ? 'text-red-700' : 'text-admin-charcoal'}`}>
                    {overdueFollowUps}
                </p>
                <p className="text-sm text-admin-text-secondary mt-0.5 mb-2">Overdue Follow-ups</p>
                {overdueFollowUps > 0
                    ? <span className="text-xs text-red-600 font-semibold">⚠ Immediate attention needed</span>
                    : <span className="text-xs text-emerald-600 font-medium">All follow-ups on track</span>
                }
            </div>

            {/* Unassigned Inquiries */}
            <div className={`rounded-xl border shadow-sm p-5 transition-colors ${unassigned > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-admin-border'}`}>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-admin-text-secondary uppercase tracking-wide">Unassigned</span>
                    <div className={`p-2 rounded-lg ${unassigned > 0 ? 'bg-amber-100' : 'bg-gray-50'}`}>
                        <UserX size={15} className={unassigned > 0 ? 'text-amber-600' : 'text-gray-400'} />
                    </div>
                </div>
                <p className={`text-3xl font-bold ${unassigned > 0 ? 'text-amber-700' : 'text-admin-charcoal'}`}>
                    {unassigned}
                </p>
                <p className="text-sm text-admin-text-secondary mt-0.5 mb-2">Need a Counselor</p>
                {unassigned > 0
                    ? <span className="text-xs text-amber-600 font-semibold">Assign to a counselor</span>
                    : <span className="text-xs text-emerald-600 font-medium">All inquiries assigned</span>
                }
            </div>
        </div>
    );
}
