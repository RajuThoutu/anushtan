'use client';

import { Trophy } from 'lucide-react';

export interface CounselorLeaderboardEntry {
    name: string;
    total: number;
    converted: number;
    conversionRate: number;
    overdue: number;
    openFollowUp: number;
}

interface CounselorLeaderboardProps {
    data: CounselorLeaderboardEntry[];
}

const MEDALS = ['🥇', '🥈', '🥉'];

export function CounselorLeaderboard({ data }: CounselorLeaderboardProps) {
    const sorted = [...data]
        .filter(c => c.name !== 'Unassigned' && c.total > 0)
        .sort((a, b) => b.converted - a.converted || b.conversionRate - a.conversionRate);

    return (
        <div className="bg-white p-6 rounded-xl border border-admin-border shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
                <Trophy size={18} className="text-amber-500 shrink-0" />
                <div>
                    <h3 className="text-lg font-bold text-admin-charcoal">Counselor Leaderboard</h3>
                    <p className="text-sm text-admin-text-secondary">Ranked by all-time conversions</p>
                </div>
            </div>

            {sorted.length === 0 ? (
                <p className="text-sm text-admin-text-secondary text-center py-10">No counselor data available yet.</p>
            ) : (
                <div>
                    {/* Table header */}
                    <div className="grid grid-cols-6 text-xs font-semibold text-admin-text-secondary uppercase tracking-wide px-3 pb-2 border-b border-admin-border">
                        <span className="col-span-2">Counselor</span>
                        <span className="text-center">Assigned</span>
                        <span className="text-center">Converted</span>
                        <span className="text-center">Rate</span>
                        <span className="text-center text-red-500">Overdue</span>
                    </div>

                    <div className="space-y-1 mt-1">
                        {sorted.map((c, idx) => (
                            <div
                                key={c.name}
                                className={`grid grid-cols-6 items-center py-2.5 px-3 rounded-lg text-sm transition-colors ${
                                    idx === 0 ? 'bg-amber-50 border border-amber-100' :
                                    idx === 1 ? 'bg-slate-50' :
                                    'hover:bg-gray-50'
                                }`}
                            >
                                <span className="col-span-2 flex items-center gap-2 font-medium text-admin-charcoal">
                                    <span className="shrink-0">{MEDALS[idx] ?? `#${idx + 1}`}</span>
                                    <span className="truncate">{c.name}</span>
                                </span>
                                <span className="text-center text-admin-text">{c.total}</span>
                                <span className="text-center font-semibold text-emerald-600">{c.converted}</span>
                                <span className={`text-center font-bold ${
                                    c.conversionRate >= 20 ? 'text-emerald-600' :
                                    c.conversionRate >= 10 ? 'text-amber-600' :
                                    'text-red-500'
                                }`}>
                                    {c.conversionRate}%
                                </span>
                                <span className={`text-center font-semibold ${c.overdue > 0 ? 'text-red-600' : 'text-gray-300'}`}>
                                    {c.overdue > 0 ? `⚠ ${c.overdue}` : '—'}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Summary footer */}
                    <div className="mt-4 pt-3 border-t border-admin-border grid grid-cols-3 text-center text-xs text-admin-text-secondary gap-2">
                        <div>
                            <p className="font-bold text-admin-charcoal text-base">{sorted.length}</p>
                            <p>Active Counselors</p>
                        </div>
                        <div>
                            <p className="font-bold text-emerald-600 text-base">
                                {sorted.reduce((s, c) => s + c.converted, 0)}
                            </p>
                            <p>Total Conversions</p>
                        </div>
                        <div>
                            <p className="font-bold text-red-500 text-base">
                                {sorted.reduce((s, c) => s + c.overdue, 0)}
                            </p>
                            <p>Total Overdue</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
