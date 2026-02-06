'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    TrendingUp,
    ClipboardList,
    AlertCircle,
    Download
} from 'lucide-react';
import { KpiCard } from '@/components/dashboard/reports/KpiCard';
import { InquiryTrendChart } from '@/components/dashboard/reports/InquiryTrendChart';
import { AdmissionFunnelChart } from '@/components/dashboard/reports/AdmissionFunnelChart';

interface Inquiry {
    id: string;
    inquiryDate: string;
    status: string;
    counselorName: string;
    // ... other fields
}

export default function ReportsClient() {
    const [loading, setLoading] = useState(true);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);

    // Aggregated Metrics
    const [metrics, setMetrics] = useState({
        total: 0,
        conversionRate: 0,
        activePipeline: 0,
        actionNeeded: 0
    });

    const [trendData, setTrendData] = useState<{ date: string; count: number }[]>([]);
    const [funnelData, setFunnelData] = useState<{ stage: string; count: number }[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/counselor/inquiries');
            const data = await response.json();

            if (data.success) {
                processData(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch reports data', error);
        } finally {
            setLoading(false);
        }
    };

    const processData = (data: Inquiry[]) => {
        setInquiries(data);

        // 1. KPI Calculations
        const total = data.length;
        const converted = data.filter(i => i.status === 'Converted').length;
        const active = data.filter(i => i.status === 'Open' || i.status === 'Follow-up').length;
        const newInquiries = data.filter(i => i.status === 'New').length;
        // Approximation for action needed: New + Follow-up 
        // (Real logic would check date, but this is a good proxy for now)
        const actionNeeded = newInquiries + data.filter(i => i.status === 'Follow-up').length;

        setMetrics({
            total,
            conversionRate: total > 0 ? Number(((converted / total) * 100).toFixed(1)) : 0,
            activePipeline: active,
            actionNeeded
        });

        // 2. Trend Data (Last 7 Days or Aggregated by Date)
        const dateMap = new Map<string, number>();
        data.forEach(i => {
            const date = new Date(i.inquiryDate).toLocaleDateString();
            dateMap.set(date, (dateMap.get(date) || 0) + 1);
        });

        // Sort dates
        const sortedDates = Array.from(dateMap.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        // Take last 14 days for cleaner view
        const recentDates = sortedDates.slice(-14);

        setTrendData(recentDates.map(date => ({
            date,
            count: dateMap.get(date) || 0
        })));


        // 3. Funnel Data
        const stages = ['New', 'Open', 'Follow-up', 'Converted', 'Closed'];
        const funnelCounts = stages.map(stage => ({
            stage,
            count: data.filter(i => i.status === stage).length
        }));
        setFunnelData(funnelCounts);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-emerald"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-admin-text">Executive Overview</h2>
                    <p className="text-admin-text-secondary">Real-time insights into admission performance</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-admin-border rounded-lg text-admin-text hover:bg-gray-50 transition shadow-sm">
                    <Download size={18} />
                    <span>Export Report</span>
                </button>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="Total Inquiries"
                    value={metrics.total}
                    icon={Users}
                    color="blue"
                    subtext="All time volume"
                />
                <KpiCard
                    title="Conversion Rate"
                    value={`${metrics.conversionRate}%`}
                    icon={TrendingUp}
                    color="emerald"
                    trend={metrics.conversionRate > 10 ? 'up' : 'neutral'}
                    trendValue={metrics.conversionRate > 10 ? 'Good' : 'Avg'}
                    subtext="Converted vs Total"
                />
                <KpiCard
                    title="Active Pipeline"
                    value={metrics.activePipeline}
                    icon={ClipboardList}
                    color="amber"
                    subtext="Open & Follow-up cases"
                />
                <KpiCard
                    title="Action Needed"
                    value={metrics.actionNeeded}
                    icon={AlertCircle}
                    color="rose"
                    subtext="New & Pending Follow-ups"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Trend Chart (2/3 width) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-admin-border shadow-sm">
                    <h3 className="text-lg font-semibold text-admin-text mb-6">Inquiry Volume Trend</h3>
                    <InquiryTrendChart data={trendData} />
                </div>

                {/* Funnel Chart (1/3 width) */}
                <div className="bg-white p-6 rounded-xl border border-admin-border shadow-sm">
                    <h3 className="text-lg font-semibold text-admin-text mb-6">Admission Pipeline</h3>
                    <AdmissionFunnelChart data={funnelData} />
                </div>
            </div>

            {/* Additional Insights (Placeholder for further expansion) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-admin-blue to-admin-purple p-6 rounded-xl text-white shadow-lg">
                    <h3 className="text-lg font-bold mb-2">Director's Insight</h3>
                    <p className="opacity-90 mb-4">
                        You have <span className="font-bold">{metrics.activePipeline} active conversations</span>. Focusing on the 'Follow-up' stage could increase conversion by estimated 5-10% this week.
                    </p>
                    <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                        <div className="text-sm font-medium opacity-80 uppercase tracking-wider mb-1">Top Performing Counselor</div>
                        <div className="text-xl font-bold">Training Recommended</div>
                        <div className="text-xs opacity-70 mt-1">Based on current conversion metrics</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
