'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface FunnelData {
    stage: string;
    count: number;
}

interface AdmissionFunnelChartProps {
    data: FunnelData[];
}

export function AdmissionFunnelChart({ data }: AdmissionFunnelChartProps) {
    const getBarColor = (stage: string) => {
        switch (stage) {
            case 'New': return '#3b82f6';
            case 'Open': return '#f59e0b';
            case 'Follow-up': return '#f97316';
            case 'Converted': return '#10b981';
            case 'Closed': return '#94a3b8';
            default: return '#64748b';
        }
    };

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="stage"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.stage)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
