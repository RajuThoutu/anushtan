'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    TrendingUp,
    ClipboardList,
    AlertCircle,
    Download
} from 'lucide-react';
import { AdmissionFunnelChart } from '@/components/dashboard/reports/AdmissionFunnelChart';
import { CounselorPerformanceChart } from '@/components/dashboard/reports/CounselorPerformanceChart';
import { GradeDistributionChart } from '@/components/dashboard/reports/GradeDistributionChart';
import { BoardingTypeChart } from '@/components/dashboard/reports/BoardingTypeChart';
import { SchoolDrilldownChart } from '@/components/dashboard/reports/SchoolDrilldownChart';
import { ExportButton } from '@/components/reports/ExportButton';

interface Inquiry {
    id: string;
    inquiryDate: string;
    status: string;
    counselorName: string;
    currentClass?: string;
    source?: string;
    dayScholarHostel?: string;
}

export default function ReportsClient() {
    const [loading, setLoading] = useState(true);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);

    // View State
    const [visibleSections, setVisibleSections] = useState({
        kpi: true,
        prediction: true,
        charts: true,
        gradeSource: true,
        counselor: true
    });

    const toggleSection = (id: string) => {
        setVisibleSections(prev => ({ ...prev, [id]: !prev[id as keyof typeof prev] }));
    };

    const sectionOptions = [
        { id: 'kpi', label: 'Executive Summary (KPIs)', checked: visibleSections.kpi },
        { id: 'prediction', label: 'Enrollment Forecast', checked: visibleSections.prediction },
        { id: 'charts', label: 'Trends & Funnel', checked: visibleSections.charts },
        { id: 'gradeSource', label: 'Market Insights (Grade/Source)', checked: visibleSections.gradeSource },
        { id: 'counselor', label: 'Counselor Performance', checked: visibleSections.counselor },
    ];

    // Aggregated Metrics
    const [metrics, setMetrics] = useState({
        total: 0,
        conversionRate: 0,
        activePipeline: 0,
        actionNeeded: 0
    });

    const [trendData, setTrendData] = useState<{ date: string; count: number }[]>([]);
    const [funnelData, setFunnelData] = useState<{ stage: string; count: number }[]>([]);

    // Aggregated Data for new reports
    const [counselorStats, setCounselorStats] = useState<any[]>([]);
    const [dailyLogs, setDailyLogs] = useState<any[]>([]);
    const [gradeData, setGradeData] = useState<{ grade: string; count: number; admissions: number }[]>([]);
    const [sourceData, setSourceData] = useState<{ source: string; count: number }[]>([]);
    const [prediction, setPrediction] = useState({ confirmed: 0, predicted: 0, confidence: 85 });

    const [boardingData, setBoardingData] = useState<{ name: string; value: number }[]>([]);

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
        const actionNeeded = newInquiries + data.filter(i => i.status === 'Follow-up').length;

        setMetrics({
            total,
            conversionRate: total > 0 ? Number(((converted / total) * 100).toFixed(1)) : 0,
            activePipeline: active,
            actionNeeded
        });

        // 2. Trend Data
        const dateMap = new Map<string, number>();
        data.forEach(i => {
            const date = new Date(i.inquiryDate).toLocaleDateString();
            dateMap.set(date, (dateMap.get(date) || 0) + 1);
        });
        const sortedDates = Array.from(dateMap.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        const recentDates = sortedDates.slice(-14);
        setTrendData(recentDates.map(date => ({ date, count: dateMap.get(date) || 0 })));

        // 3. Funnel Data
        const stages = ['New', 'Open', 'Follow-up', 'Converted', 'Closed'];
        const funnelCounts = stages.map(stage => ({
            stage,
            count: data.filter(i => i.status === stage).length
        }));
        setFunnelData(funnelCounts);

        // 4. Counselor Stats Aggregation
        const counselorMap = new Map<string, any>();
        data.forEach(i => {
            const name = i.counselorName || 'Unassigned';
            if (!counselorMap.has(name)) {
                counselorMap.set(name, {
                    name,
                    total: 0,
                    statuses: { New: 0, Open: 0, FollowUp: 0, Converted: 0, Closed: 0 },
                    conversionRate: 0
                });
            }
            const stats = counselorMap.get(name);
            stats.total += 1;
            const statusKey = i.status === 'Follow-up' ? 'FollowUp' : i.status;
            if (stats.statuses[statusKey] !== undefined) {
                stats.statuses[statusKey] += 1;
            }
        });
        const statsArray = Array.from(counselorMap.values()).map(c => {
            c.conversionRate = c.total > 0 ? Number(((c.statuses.Converted / c.total) * 100).toFixed(1)) : 0;
            return c;
        });
        setCounselorStats(statsArray);

        // 5. Daily Activity Log
        const activityMap = new Map<string, any>();
        data.forEach(i => {
            const date = new Date(i.inquiryDate).toLocaleDateString();
            const counselor = i.counselorName || 'Unassigned';
            const key = `${date}_${counselor}`;
            if (!activityMap.has(key)) {
                activityMap.set(key, {
                    date: i.inquiryDate,
                    counselorName: counselor,
                    total: 0,
                    statusCounts: {} as Record<string, number>
                });
            }
            const entry = activityMap.get(key);
            entry.total += 1;
            entry.statusCounts[i.status] = (entry.statusCounts[i.status] || 0) + 1;
        });
        const activityArray = Array.from(activityMap.values()).map(entry => {
            const breakdownParts = Object.entries(entry.statusCounts).map(([status, count]) => `${count} ${status}`);
            return {
                date: entry.date,
                counselorName: entry.counselorName,
                total: entry.total,
                statusBreakdown: breakdownParts.join(', ')
            };
        });
        activityArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setDailyLogs(activityArray);


        // 6. Grade Distribution
        const gradeMap = new Map<string, { count: number; admissions: number }>();
        data.forEach(i => {
            const grade = i.currentClass || 'Unknown';
            if (!gradeMap.has(grade)) {
                gradeMap.set(grade, { count: 0, admissions: 0 });
            }
            const gData = gradeMap.get(grade)!;
            gData.count += 1;
            if (i.status === 'Converted') {
                gData.admissions += 1;
            }
        });
        const gradeArr = Array.from(gradeMap.entries()).map(([grade, stats]) => ({
            grade,
            count: stats.count,
            admissions: stats.admissions
        }));
        gradeArr.sort((a, b) => b.count - a.count);
        setGradeData(gradeArr.slice(0, 10)); // Top 10 grades

        // 7. Source Effectiveness
        const sourceMap = new Map<string, number>();
        data.forEach(i => {
            const src = i.source || 'Other';
            sourceMap.set(src, (sourceMap.get(src) || 0) + 1);
        });
        const sourceArr = Array.from(sourceMap.entries()).map(([source, count]) => ({ source, count }));
        sourceArr.sort((a, b) => b.count - a.count);
        setSourceData(sourceArr);

        // 8. Boarding Type Data
        const boardMap = new Map<string, number>();
        data.forEach(i => {
            const type = i.dayScholarHostel || 'Not Specified';
            boardMap.set(type, (boardMap.get(type) || 0) + 1);
        });
        const boardArr = Array.from(boardMap.entries()).map(([name, value]) => ({ name, value }));
        setBoardingData(boardArr);

        // 9. Prediction Calculation
        const openCount = data.filter(i => i.status === 'Open').length;
        const followUpCount = data.filter(i => i.status === 'Follow-up').length;
        const predictedVal = (openCount * 0.1) + (followUpCount * 0.3);

        setPrediction({
            confirmed: converted,
            predicted: predictedVal,
            confidence: 85
        });
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
            <div className="flex justify-end gap-4">
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-admin-border rounded-lg text-admin-text hover:bg-gray-50 transition shadow-sm">
                        <Download size={18} />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Market Insights */}
            {visibleSections.gradeSource && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                    <div className="bg-white p-6 rounded-xl border border-admin-border shadow-sm">
                        <h3 className="text-lg font-semibold text-admin-text mb-6">Demand by Grade Level</h3>
                        <GradeDistributionChart data={gradeData} />
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-admin-border shadow-sm">
                        <h3 className="text-lg font-semibold text-admin-text mb-6">Boarding Type Preference</h3>
                        <BoardingTypeChart data={boardingData} />
                    </div>
                </div>
            )}

            {/* Trends & Funnel */}
            {visibleSections.charts && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                    <SchoolDrilldownChart inquiries={inquiries} />
                    <div className="bg-white p-6 rounded-xl border border-admin-border shadow-sm">
                        <h3 className="text-lg font-semibold text-admin-text mb-6">Admission Pipeline</h3>
                        <AdmissionFunnelChart data={funnelData} />
                    </div>
                </div>
            )}

            {/* Counselor Performance Section */}
            {visibleSections.counselor && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                    <CounselorPerformanceChart data={counselorStats} />
                </div>
            )}
        </div>
    );
}
