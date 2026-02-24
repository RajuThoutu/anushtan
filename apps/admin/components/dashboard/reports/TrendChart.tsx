'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

export interface TrendDay {
    day: string;
    count: number;
    label: string;
}

interface TrendChartProps {
    data: TrendDay[];
}

export function TrendChart({ data }: TrendChartProps) {
    const total = data.reduce((sum, d) => sum + d.count, 0);
    const avg = data.length > 0 ? (total / data.length).toFixed(1) : '0';
    const peak = [...data].sort((a, b) => b.count - a.count)[0];

    return (
        <div className="bg-white p-6 rounded-xl border border-admin-border shadow-sm h-full">
            <div className="flex items-start justify-between mb-5">
                <div>
                    <h3 className="text-lg font-bold text-admin-charcoal">30-Day Inquiry Trend</h3>
                    <p className="text-sm text-admin-text-secondary">Daily intake — past 30 days</p>
                </div>
                <div className="flex gap-5 text-right">
                    <div>
                        <p className="text-xl font-bold text-admin-charcoal">{total}</p>
                        <p className="text-xs text-admin-text-secondary">Total</p>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-indigo-600">{avg}</p>
                        <p className="text-xs text-admin-text-secondary">Avg / day</p>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-purple-600">{peak?.count ?? 0}</p>
                        <p className="text-xs text-admin-text-secondary">Peak ({peak?.label ?? '—'})</p>
                    </div>
                </div>
            </div>

            <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="label"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                fontSize: '12px',
                            }}
                            formatter={(v) => [v, 'Inquiries']}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#6366f1"
                            strokeWidth={2}
                            fill="url(#trendGrad)"
                            dot={false}
                            activeDot={{ r: 4, fill: '#6366f1' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
