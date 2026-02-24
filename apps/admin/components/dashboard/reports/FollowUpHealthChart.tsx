'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Clock, CalendarCheck, CalendarX } from 'lucide-react';

interface FollowUpHealthChartProps {
    overdue: number;
    dueToday: number;
    upcoming: number;
    noDate: number;
}

const SEGMENTS = [
    { key: 'overdue',  label: 'Overdue',      color: '#ef4444', bg: 'bg-red-50',    text: 'text-red-700',    sub: 'text-red-600',    Icon: AlertTriangle },
    { key: 'dueToday', label: 'Due Today',     color: '#f97316', bg: 'bg-orange-50', text: 'text-orange-700', sub: 'text-orange-600', Icon: Clock },
    { key: 'upcoming', label: 'Next 7 Days',   color: '#3b82f6', bg: 'bg-blue-50',   text: 'text-blue-700',   sub: 'text-blue-600',   Icon: CalendarCheck },
    { key: 'noDate',   label: 'No Date Set',   color: '#94a3b8', bg: 'bg-gray-50',   text: 'text-gray-600',   sub: 'text-gray-500',   Icon: CalendarX },
];

export function FollowUpHealthChart({ overdue, dueToday, upcoming, noDate }: FollowUpHealthChartProps) {
    const values: Record<string, number> = { overdue, dueToday, upcoming, noDate };

    const pieData = SEGMENTS
        .map(s => ({ name: s.label, value: values[s.key], color: s.color }))
        .filter(d => d.value > 0);

    const total = overdue + dueToday + upcoming + noDate;

    return (
        <div className="bg-white p-6 rounded-xl border border-admin-border shadow-sm h-full">
            <div className="mb-5">
                <h3 className="text-lg font-bold text-admin-charcoal">Follow-up Health</h3>
                <p className="text-sm text-admin-text-secondary">Active pipeline follow-up status ({total} active)</p>
            </div>

            {/* Stat tiles */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                {SEGMENTS.map(({ key, label, bg, text, sub, Icon }) => (
                    <div key={key} className={`flex items-center gap-2.5 p-3 rounded-lg ${bg}`}>
                        <Icon size={15} className={`${sub} shrink-0`} />
                        <div>
                            <p className={`text-xl font-bold ${text}`}>{values[key]}</p>
                            <p className={`text-xs ${sub}`}>{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Donut chart */}
            {total > 0 && pieData.length > 0 && (
                <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={48}
                                outerRadius={72}
                                dataKey="value"
                                paddingAngle={2}
                                stroke="none"
                            >
                                {pieData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(v) => [v, '']}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {total === 0 && (
                <p className="text-sm text-center text-admin-text-secondary py-6">No active inquiries in pipeline.</p>
            )}
        </div>
    );
}
