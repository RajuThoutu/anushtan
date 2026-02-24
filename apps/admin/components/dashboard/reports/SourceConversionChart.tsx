'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface SourceConversionData {
    source: string;
    total: number;
    converted: number;
    conversionRate: number;
}

interface SourceConversionChartProps {
    data: SourceConversionData[];
}

const SOURCE_COLORS: Record<string, string> = {
    Website:      '#3b82f6',
    WhatsApp:     '#10b981',
    'Paper Form': '#f59e0b',
    'Phone Call': '#8b5cf6',
    Referral:     '#06b6d4',
    Other:        '#94a3b8',
};

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    const row = payload[0]?.payload as SourceConversionData;
    return (
        <div className="bg-white p-3 border border-admin-border rounded-lg shadow-lg text-sm">
            <p className="font-semibold text-admin-charcoal mb-1">{label}</p>
            <p className="text-blue-600">Total inquiries: <span className="font-bold">{row.total}</span></p>
            <p className="text-emerald-600">Converted: <span className="font-bold">{row.converted}</span></p>
            <p className="text-admin-charcoal font-semibold mt-1">Conv. rate: {row.conversionRate}%</p>
        </div>
    );
}

export function SourceConversionChart({ data }: SourceConversionChartProps) {
    return (
        <div className="bg-white p-6 rounded-xl border border-admin-border shadow-sm">
            <div className="mb-5">
                <h3 className="text-lg font-bold text-admin-charcoal">Source Effectiveness</h3>
                <p className="text-sm text-admin-text-secondary">Inquiries vs conversions by channel</p>
            </div>

            <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="source" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                        <Bar dataKey="total"     name="Total"     fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={18} />
                        <Bar dataKey="converted" name="Converted" fill="#10b981" radius={[4, 4, 0, 0]} barSize={18} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Conversion rate table */}
            <div className="mt-4 border-t border-admin-border pt-3 space-y-1">
                <div className="grid grid-cols-3 text-xs font-semibold text-admin-text-secondary uppercase tracking-wide pb-1.5">
                    <span>Source</span>
                    <span className="text-center">Inquiries</span>
                    <span className="text-right">Conv. Rate</span>
                </div>
                {data.map(row => (
                    <div key={row.source} className="grid grid-cols-3 items-center text-sm py-1.5 border-b border-gray-50 last:border-0">
                        <span className="flex items-center gap-1.5">
                            <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: SOURCE_COLORS[row.source] ?? '#94a3b8' }}
                            />
                            <span className="truncate">{row.source}</span>
                        </span>
                        <span className="text-center text-admin-text">{row.total}</span>
                        <span className={`text-right font-semibold ${
                            row.conversionRate >= 20 ? 'text-emerald-600' :
                            row.conversionRate >= 10 ? 'text-amber-600' :
                            'text-red-500'
                        }`}>
                            {row.conversionRate}%
                        </span>
                    </div>
                ))}
                {data.length === 0 && (
                    <p className="text-sm text-center text-admin-text-secondary py-4">No source data available.</p>
                )}
            </div>
        </div>
    );
}
