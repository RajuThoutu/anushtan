'use client';

import { useState, useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { ArrowLeft } from 'lucide-react';

interface Inquiry {
    status: string;
    currentSchool?: string;
    currentClass?: string;
}

interface SchoolDrilldownChartProps {
    inquiries: Inquiry[];
}

export function SchoolDrilldownChart({ inquiries }: SchoolDrilldownChartProps) {
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

    console.log('School Drilldown received inquiries:', inquiries?.length);

    const chartData = useMemo(() => {
        const counts: Record<string, { name: string; total: number; converted: number }> = {};

        if (!selectedSchool) {
            // Level 1: Group by School
            inquiries.forEach(inq => {
                const school = (inq.currentSchool || '').trim() || 'Unknown School';
                if (!counts[school]) {
                    counts[school] = { name: school, total: 0, converted: 0 };
                }
                counts[school].total++;
                if (inq.status === 'Converted' || inq.status === 'Closed') {
                    counts[school].converted++;
                }
            });
        } else {
            // Level 2: Group by Class (filtered for selected school)
            inquiries.forEach(inq => {
                const school = (inq.currentSchool || '').trim() || 'Unknown School';
                if (school === selectedSchool) {
                    const grade = (inq.currentClass || '').trim() || 'Unknown Class';
                    if (!counts[grade]) {
                        counts[grade] = { name: grade, total: 0, converted: 0 };
                    }
                    counts[grade].total++;
                    if (inq.status === 'Converted' || inq.status === 'Closed') {
                        counts[grade].converted++;
                    }
                }
            });
        }

        // Convert grouped object to sorted array (highest total first)
        const finalData = Object.values(counts).sort((a, b) => b.total - a.total);
        console.log('School Drilldown built chartData:', finalData.length);
        return finalData;
    }, [inquiries, selectedSchool]);

    const handleBarClick = (data: any) => {
        // Only drill down if we are at the school level
        if (!selectedSchool && data && data.activePayload && data.activePayload.length > 0) {
            const schoolName = data.activePayload[0].payload.name;
            setSelectedSchool(schoolName);
        }
    };

    return (
        <div className="flex flex-col h-[400px] w-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-admin-charcoal flex items-center gap-2">
                        {selectedSchool ? (
                            <>
                                <button
                                    onClick={() => setSelectedSchool(null)}
                                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-admin-purple"
                                    title="Back to All Schools"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                Class Breakdown: {selectedSchool}
                            </>
                        ) : (
                            'Inquiries by School'
                        )}
                    </h3>
                    <p className="text-sm text-admin-text-secondary mt-1">
                        {selectedSchool
                            ? "Total vs converted inquiries per class for this school."
                            : "Click any school's bar to drill down into its class distribution."}
                    </p>
                </div>
            </div>

            <div className="w-full mt-4 flex-1 min-h-0 relative">
                {chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400 min-h-[400px]">
                        No data available for this view.
                    </div>
                ) : (
                    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden pr-2">
                        {/* Calculate minimum height to ensure each row has enough space (min 400px total or 40px per item) */}
                        <div style={{ height: Math.max(400, chartData.length * 40), width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    layout="vertical"
                                    onClick={handleBarClick}
                                    margin={{ top: 5, right: 30, left: selectedSchool ? 80 : 120, bottom: 5 }}
                                    className={!selectedSchool ? "cursor-pointer" : ""}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                    <XAxis type="number" />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={selectedSchool ? 70 : 110}
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar
                                        dataKey="total"
                                        name="Total Inquiries"
                                        fill="#3b82f6"
                                        radius={[0, 4, 4, 0]}
                                        barSize={20}
                                    />
                                    <Bar
                                        dataKey="converted"
                                        name="Converted"
                                        fill="#10b981"
                                        radius={[0, 4, 4, 0]}
                                        barSize={20}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
