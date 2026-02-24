'use client';

import { useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface CounselorStat {
    name: string;
    total: number;
    statuses: {
        New: number;
        Open: number;
        FollowUp: number;
        Converted: number;
        Closed: number;
    };
    conversionRate: number;
}

interface CounselorPerformanceChartProps {
    data: CounselorStat[];
}

// A vibrant, dynamic color palette for the pie chart slices
const COLORS = [
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#8b5cf6', // violet-500
    '#ef4444', // red-500
    '#06b6d4', // cyan-500
    '#f97316', // orange-500
    '#ec4899', // pink-500
];

export function CounselorPerformanceChart({ data }: CounselorPerformanceChartProps) {
    // Filter out counselors with 0 assigned inquiries and sort by highest total first
    const chartData = useMemo(() => {
        return [...data]
            .filter(c => c.total > 0)
            .sort((a, b) => b.total - a.total);
    }, [data]);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const dataData = payload[0].payload as CounselorStat;
            return (
                <div className="bg-white p-3 border border-admin-border rounded-lg shadow-lg">
                    <p className="font-semibold text-admin-charcoal mb-1">{dataData.name}</p>
                    <p className="text-sm text-admin-text-secondary">Assigned: <span className="font-bold text-admin-text">{dataData.total}</span></p>
                    <div className="mt-2 space-y-1 text-xs">
                        <p className="text-emerald-600">Converted: {dataData.statuses.Converted}</p>
                        <p className="text-blue-600">Open/Follow-up: {dataData.statuses.Open + dataData.statuses.FollowUp}</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-admin-border shadow-sm flex flex-col h-[450px] w-full">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-admin-charcoal">Counselor Workload</h3>
                <p className="text-sm text-admin-text-secondary">Total assigned inquiries per counselor</p>
            </div>

            <div className="flex-1 w-full relative">
                {chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No counselor data available.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={2}
                                dataKey="total"
                                nameKey="name"
                                stroke="none"
                                label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                                labelLine={true}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
