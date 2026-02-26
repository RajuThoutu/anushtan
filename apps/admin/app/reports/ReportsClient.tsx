'use client';

import { useState, useEffect } from 'react';

import { AdmissionFunnelChart } from '@/components/dashboard/reports/AdmissionFunnelChart';
import { CounselorPerformanceChart } from '@/components/dashboard/reports/CounselorPerformanceChart';
import { GradeDistributionChart } from '@/components/dashboard/reports/GradeDistributionChart';
import { BoardingTypeChart } from '@/components/dashboard/reports/BoardingTypeChart';
import { SchoolDrilldownChart } from '@/components/dashboard/reports/SchoolDrilldownChart';
import { DirectorKpiCards } from '@/components/dashboard/reports/DirectorKpiCards';
import { FollowUpHealthChart } from '@/components/dashboard/reports/FollowUpHealthChart';
import { SourceConversionChart } from '@/components/dashboard/reports/SourceConversionChart';
import { CounselorLeaderboard } from '@/components/dashboard/reports/CounselorLeaderboard';
import { TrendChart } from '@/components/dashboard/reports/TrendChart';
import { ExportButton } from '@/components/reports/ExportButton';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Inquiry {
    id: string;
    inquiryDate: string;
    updatedAt?: string;
    status: string;
    counselorName?: string;
    assignedTo?: string;
    currentClass?: string;
    currentSchool?: string;
    source?: string;
    dayScholarHostel?: string;
    followUpDate?: string | null;
    studentName?: string;
    parentName?: string;
    phone?: string;
}

interface DirectorKpis {
    thisMonthTotal: number;
    lastMonthTotal: number;
    thisMonthConverted: number;
    lastMonthConverted: number;
    overdueFollowUps: number;
    unassigned: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayIST(): Date {
    const now = new Date();
    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    ist.setUTCHours(0, 0, 0, 0);
    return ist;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReportsClient() {
    const [loading, setLoading] = useState(true);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);

    // ── Director Overview ──
    const [directorKpis, setDirectorKpis] = useState<DirectorKpis>({
        thisMonthTotal: 0, lastMonthTotal: 0,
        thisMonthConverted: 0, lastMonthConverted: 0,
        overdueFollowUps: 0, unassigned: 0,
    });
    const [followUpHealth, setFollowUpHealth] = useState({ overdue: 0, dueToday: 0, upcoming: 0, noDate: 0 });
    const [trendData30, setTrendData30] = useState<{ day: string; count: number; label: string }[]>([]);
    const [sourceConvData, setSourceConvData] = useState<{ source: string; total: number; converted: number; conversionRate: number }[]>([]);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    // ── Existing sections ──
    const [funnelData, setFunnelData] = useState<{ stage: string; count: number }[]>([]);
    const [counselorStats, setCounselorStats] = useState<any[]>([]);
    const [gradeData, setGradeData] = useState<{ grade: string; count: number; admissions: number }[]>([]);
    const [boardingData, setBoardingData] = useState<{ name: string; value: number }[]>([]);

    useEffect(() => {
        fetch('/api/counselor/inquiries')
            .then(r => r.json())
            .then(d => { if (d.success) processData(d.data); })
            .catch(e => console.error('Reports fetch failed', e))
            .finally(() => setLoading(false));
    }, []);

    const processData = (data: Inquiry[]) => {
        setInquiries(data);

        const today = todayIST();
        const tomorrow = new Date(today); tomorrow.setUTCDate(today.getUTCDate() + 1);
        const in7Days  = new Date(today); in7Days.setUTCDate(today.getUTCDate() + 7);

        const thisMonthStart = new Date(today); thisMonthStart.setUTCDate(1);
        const lastMonthStart = new Date(thisMonthStart); lastMonthStart.setUTCMonth(lastMonthStart.getUTCMonth() - 1);
        const lastMonthEnd   = new Date(thisMonthStart); lastMonthEnd.setUTCMilliseconds(-1);

        const ACTIVE = ['New', 'Follow-up'];

        // ── Director KPIs ──────────────────────────────────────────────────────
        const thisMonth = data.filter(i => new Date(i.inquiryDate) >= thisMonthStart);
        const lastMonth = data.filter(i => {
            const d = new Date(i.inquiryDate);
            return d >= lastMonthStart && d <= lastMonthEnd;
        });
        const unassigned = data.filter(i => !i.assignedTo && ACTIVE.includes(i.status)).length;
        const overdueFollowUps = data.filter(i => {
            if (!i.followUpDate || !ACTIVE.includes(i.status)) return false;
            const fd = new Date(i.followUpDate); fd.setUTCHours(0, 0, 0, 0);
            return fd < today;
        }).length;

        setDirectorKpis({
            thisMonthTotal:     thisMonth.length,
            lastMonthTotal:     lastMonth.length,
            thisMonthConverted: thisMonth.filter(i => i.status === 'Converted').length,
            lastMonthConverted: lastMonth.filter(i => i.status === 'Converted').length,
            overdueFollowUps,
            unassigned,
        });

        // ── Follow-up Health ───────────────────────────────────────────────────
        let overdue = 0, dueToday = 0, upcoming = 0, noDate = 0;
        data.filter(i => ACTIVE.includes(i.status)).forEach(i => {
            if (!i.followUpDate) { noDate++; return; }
            const fd = new Date(i.followUpDate); fd.setUTCHours(0, 0, 0, 0);
            if (fd < today)                                     overdue++;
            else if (fd.getTime() === today.getTime())          dueToday++;
            else if (fd < in7Days)                              upcoming++;
            else                                                noDate++;
        });
        setFollowUpHealth({ overdue, dueToday, upcoming, noDate });

        // ── 30-day Trend ───────────────────────────────────────────────────────
        const thirtyAgo = new Date(today); thirtyAgo.setUTCDate(today.getUTCDate() - 29);
        const days = Array.from({ length: 30 }, (_, d) => {
            const date = new Date(thirtyAgo); date.setUTCDate(thirtyAgo.getUTCDate() + d);
            const dayStr = date.toISOString().split('T')[0];
            return {
                day: dayStr,
                label: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                count: data.filter(i => new Date(i.inquiryDate).toISOString().split('T')[0] === dayStr).length,
            };
        });
        setTrendData30(days);

        // ── Source Conversion ──────────────────────────────────────────────────
        const srcMap = new Map<string, { total: number; converted: number }>();
        data.forEach(i => {
            const src = i.source || 'Other';
            if (!srcMap.has(src)) srcMap.set(src, { total: 0, converted: 0 });
            const s = srcMap.get(src)!;
            s.total++;
            if (i.status === 'Converted') s.converted++;
        });
        setSourceConvData(
            Array.from(srcMap.entries())
                .map(([source, s]) => ({
                    source,
                    total: s.total,
                    converted: s.converted,
                    conversionRate: s.total > 0 ? Number(((s.converted / s.total) * 100).toFixed(1)) : 0,
                }))
                .sort((a, b) => b.total - a.total)
        );

        // ── Counselor Stats + Leaderboard ──────────────────────────────────────
        const cMap = new Map<string, any>();
        data.forEach(i => {
            const name = i.counselorName || i.assignedTo || 'Unassigned';
            if (!cMap.has(name)) {
                cMap.set(name, {
                    name, total: 0,
                    statuses: { New: 0, FollowUp: 0, Converted: 0, CasualInquiry: 0 },
                    overdue: 0, openFollowUp: 0,
                });
            }
            const c = cMap.get(name)!;
            c.total++;
            const sk = i.status === 'Follow-up' ? 'FollowUp' : i.status === 'Casual Inquiry' ? 'CasualInquiry' : i.status;
            if (c.statuses[sk] !== undefined) c.statuses[sk]++;
            if (ACTIVE.includes(i.status)) {
                if (i.followUpDate) {
                    const fd = new Date(i.followUpDate); fd.setUTCHours(0, 0, 0, 0);
                    if (fd < today) c.overdue++;
                }
                if (i.status === 'Follow-up') c.openFollowUp++;
            }
        });
        const statsArr = Array.from(cMap.values()).map(c => ({
            ...c,
            converted: c.statuses.Converted,
            conversionRate: c.total > 0 ? Number(((c.statuses.Converted / c.total) * 100).toFixed(1)) : 0,
        }));
        setCounselorStats(statsArr);
        setLeaderboard(statsArr);

        // ── Grade Distribution ─────────────────────────────────────────────────
        const gMap = new Map<string, { count: number; admissions: number }>();
        data.forEach(i => {
            const g = i.currentClass || 'Unknown';
            if (!gMap.has(g)) gMap.set(g, { count: 0, admissions: 0 });
            const gd = gMap.get(g)!;
            gd.count++;
            if (i.status === 'Converted') gd.admissions++;
        });
        setGradeData(
            Array.from(gMap.entries())
                .map(([grade, s]) => ({ grade, count: s.count, admissions: s.admissions }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)
        );

        // ── Admission Funnel ───────────────────────────────────────────────────
        setFunnelData(['New', 'Follow-up', 'Converted', 'Casual Inquiry'].map(stage => ({
            stage,
            count: data.filter(i => i.status === stage).length,
        })));

        // ── Boarding Type ──────────────────────────────────────────────────────
        const bMap = new Map<string, number>();
        data.forEach(i => {
            const t = i.dayScholarHostel || 'Not Specified';
            bMap.set(t, (bMap.get(t) || 0) + 1);
        });
        setBoardingData(Array.from(bMap.entries()).map(([name, value]) => ({ name, value })));
    };

    // ── Loading ────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-emerald" />
            </div>
        );
    }

    // ── Section heading helper ─────────────────────────────────────────────────
    function SectionHeading({ label, color }: { label: string; color: string }) {
        return (
            <div className="flex items-center gap-3 mb-5">
                <div className={`h-5 w-1 rounded-full ${color}`} />
                <h2 className="text-xl font-bold text-admin-charcoal">{label}</h2>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Export */}
            <div className="flex justify-end">
                <ExportButton data={inquiries} />
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                DIRECTOR OVERVIEW
            ═══════════════════════════════════════════════════════════════════ */}
            <section>
                <div className="flex items-center gap-3 mb-5">
                    <div className="h-5 w-1 rounded-full bg-gradient-to-b from-admin-purple to-admin-rose" />
                    <h2 className="text-xl font-bold text-admin-charcoal">Director Overview</h2>
                    <span className="text-xs font-medium text-admin-text-secondary bg-gray-100 px-2 py-0.5 rounded-full">
                        Month-to-date
                    </span>
                </div>
                <DirectorKpiCards {...directorKpis} />
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                FOLLOW-UP HEALTH  +  30-DAY TREND
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <FollowUpHealthChart {...followUpHealth} />
                <div className="lg:col-span-2">
                    <TrendChart data={trendData30} />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                SOURCE EFFECTIVENESS  +  COUNSELOR LEADERBOARD
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SourceConversionChart data={sourceConvData} />
                <CounselorLeaderboard data={leaderboard} />
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                MARKET INSIGHTS
            ═══════════════════════════════════════════════════════════════════ */}
            <section>
                <SectionHeading label="Market Insights" color="bg-blue-400" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-admin-border shadow-sm">
                        <h3 className="text-lg font-semibold text-admin-text mb-5">Demand by Grade Level</h3>
                        <GradeDistributionChart data={gradeData} />
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-admin-border shadow-sm">
                        <h3 className="text-lg font-semibold text-admin-text mb-5">Boarding Type Preference</h3>
                        <BoardingTypeChart data={boardingData} />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                PIPELINE & SCHOOL BREAKDOWN
            ═══════════════════════════════════════════════════════════════════ */}
            <section>
                <SectionHeading label="Pipeline & Schools" color="bg-amber-400" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SchoolDrilldownChart inquiries={inquiries} />
                    <div className="bg-white p-6 rounded-xl border border-admin-border shadow-sm">
                        <h3 className="text-lg font-semibold text-admin-text mb-5">Admission Pipeline</h3>
                        <AdmissionFunnelChart data={funnelData} />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                COUNSELOR WORKLOAD
            ═══════════════════════════════════════════════════════════════════ */}
            <section>
                <SectionHeading label="Counselor Workload" color="bg-emerald-400" />
                <CounselorPerformanceChart data={counselorStats} />
            </section>
        </div>
    );
}
