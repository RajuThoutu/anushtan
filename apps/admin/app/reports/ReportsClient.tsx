'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

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

type PeriodFilter = 'today' | 'thisWeek' | 'thisMonth' | 'lastMonth' | 'custom';

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
    activityLog?: any[];
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

const PERIOD_LABELS: Record<PeriodFilter, string> = {
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    custom: 'Custom Range',
};

function getPeriodLabel(filter: PeriodFilter, cStart: string, cEnd: string): string {
    if (filter !== 'custom') return PERIOD_LABELS[filter];
    if (cStart && cEnd) return `${cStart} – ${cEnd}`;
    if (cStart) return `From ${cStart}`;
    if (cEnd) return `Until ${cEnd}`;
    return 'Custom Range';
}

function applyPeriodFilter(data: Inquiry[], filter: PeriodFilter, cStart: string, cEnd: string): Inquiry[] {
    const today = todayIST();
    switch (filter) {
        case 'today': {
            const todayStr = today.toISOString().split('T')[0];
            return data.filter(i => new Date(i.inquiryDate).toISOString().split('T')[0] === todayStr);
        }
        case 'thisWeek': {
            const dow = today.getUTCDay(); // 0=Sun
            const diffToMon = dow === 0 ? 6 : dow - 1;
            const weekStart = new Date(today);
            weekStart.setUTCDate(today.getUTCDate() - diffToMon);
            return data.filter(i => new Date(i.inquiryDate) >= weekStart);
        }
        case 'thisMonth': {
            const monthStart = new Date(today);
            monthStart.setUTCDate(1);
            return data.filter(i => new Date(i.inquiryDate) >= monthStart);
        }
        case 'lastMonth': {
            const thisMonthStart = new Date(today);
            thisMonthStart.setUTCDate(1);
            const lastStart = new Date(thisMonthStart);
            lastStart.setUTCMonth(lastStart.getUTCMonth() - 1);
            const lastEnd = new Date(thisMonthStart);
            lastEnd.setUTCMilliseconds(-1);
            return data.filter(i => {
                const d = new Date(i.inquiryDate);
                return d >= lastStart && d <= lastEnd;
            });
        }
        case 'custom': {
            return data.filter(i => {
                const d = new Date(i.inquiryDate);
                if (cStart && d < new Date(cStart + 'T00:00:00Z')) return false;
                if (cEnd && d > new Date(cEnd + 'T23:59:59Z')) return false;
                return true;
            });
        }
    }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReportsClient() {
    const [loading, setLoading] = useState(true);
    const [allInquiries, setAllInquiries] = useState<Inquiry[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]); // filtered — used for export

    // ── Filter state ──
    const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('thisMonth');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'marketing' | 'counseling' | 'pipeline'>('overview');

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
    const [followUpLeaderboard, setFollowUpLeaderboard] = useState<any[]>([]);
    const [followUpStats, setFollowUpStats] = useState<any[]>([]);

    // ── Existing sections ──
    const [funnelData, setFunnelData] = useState<{ stage: string; count: number }[]>([]);
    const [counselorStats, setCounselorStats] = useState<any[]>([]);
    const [gradeData, setGradeData] = useState<{ grade: string; count: number; admissions: number }[]>([]);
    const [boardingData, setBoardingData] = useState<{ name: string; value: number }[]>([]);

    // Fetch all data once
    useEffect(() => {
        fetch('/api/counselor/inquiries', { cache: 'no-store' })
            .then(r => r.json())
            .then(d => { if (d.success) setAllInquiries(d.data); })
            .catch(e => console.error('Reports fetch failed', e))
            .finally(() => setLoading(false));
    }, []);

    // Re-process whenever data or filter changes
    useEffect(() => {
        const filtered = applyPeriodFilter(allInquiries, periodFilter, customStart, customEnd);
        processData(filtered, allInquiries, periodFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allInquiries, periodFilter, customStart, customEnd]);

    const processData = (data: Inquiry[], allData: Inquiry[], filter: PeriodFilter) => {
        setInquiries(data);

        const today = todayIST();
        const in7Days = new Date(today); in7Days.setUTCDate(today.getUTCDate() + 7);
        const ACTIVE = ['New', 'Follow-up'];

        // ── Director KPIs (period totals) ──────────────────────────────────
        const periodTotal = data.length;
        const periodConverted = data.filter(i => i.status === 'Converted').length;
        let prevTotal = 0, prevConverted = 0;

        if (filter === 'thisMonth') {
            const thisMonthStart = new Date(today); thisMonthStart.setUTCDate(1);
            const lastMonthStart = new Date(thisMonthStart); lastMonthStart.setUTCMonth(lastMonthStart.getUTCMonth() - 1);
            const lastMonthEnd = new Date(thisMonthStart); lastMonthEnd.setUTCMilliseconds(-1);
            const lm = allData.filter(i => { const d = new Date(i.inquiryDate); return d >= lastMonthStart && d <= lastMonthEnd; });
            prevTotal = lm.length;
            prevConverted = lm.filter(i => i.status === 'Converted').length;
        } else if (filter === 'lastMonth') {
            const thisMonthStart = new Date(today); thisMonthStart.setUTCDate(1);
            const lmStart = new Date(thisMonthStart); lmStart.setUTCMonth(lmStart.getUTCMonth() - 1);
            const prev2Start = new Date(lmStart); prev2Start.setUTCMonth(prev2Start.getUTCMonth() - 1);
            const prev2End = new Date(lmStart); prev2End.setUTCMilliseconds(-1);
            const pm = allData.filter(i => { const d = new Date(i.inquiryDate); return d >= prev2Start && d <= prev2End; });
            prevTotal = pm.length;
            prevConverted = pm.filter(i => i.status === 'Converted').length;
        }
        // For today/thisWeek/custom: prevTotal stays 0 → TrendBadge shows "No prior data"

        // Global: overdue + unassigned from ALL active inquiries (not period-filtered)
        const unassigned = allData.filter(i => !i.assignedTo && ACTIVE.includes(i.status)).length;
        const overdueFollowUps = allData.filter(i => {
            if (!i.followUpDate || !ACTIVE.includes(i.status)) return false;
            const fd = new Date(i.followUpDate); fd.setUTCHours(0, 0, 0, 0);
            return fd < today;
        }).length;

        setDirectorKpis({
            thisMonthTotal: periodTotal,
            lastMonthTotal: prevTotal,
            thisMonthConverted: periodConverted,
            lastMonthConverted: prevConverted,
            overdueFollowUps,
            unassigned,
        });

        // ── Follow-up Health (always global — live operational metric) ─────
        let overdue = 0, dueToday = 0, upcoming = 0, noDate = 0;
        allData.filter(i => ACTIVE.includes(i.status)).forEach(i => {
            if (!i.followUpDate) { noDate++; return; }
            const fd = new Date(i.followUpDate); fd.setUTCHours(0, 0, 0, 0);
            if (fd < today) overdue++;
            else if (fd.getTime() === today.getTime()) dueToday++;
            else if (fd < in7Days) upcoming++;
            else noDate++;
        });
        setFollowUpHealth({ overdue, dueToday, upcoming, noDate });

        // ── 30-day Trend (always global rolling window for context) ────────
        const thirtyAgo = new Date(today); thirtyAgo.setUTCDate(today.getUTCDate() - 29);
        const days = Array.from({ length: 30 }, (_, d) => {
            const date = new Date(thirtyAgo); date.setUTCDate(thirtyAgo.getUTCDate() + d);
            const dayStr = date.toISOString().split('T')[0];
            return {
                day: dayStr,
                label: date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric' }),
                count: allData.filter(i => new Date(i.inquiryDate).toISOString().split('T')[0] === dayStr).length,
            };
        });
        setTrendData30(days);

        // ── Source Conversion ──────────────────────────────────────────────
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

        // ── Counselor Stats + Leaderboard ──────────────────────────────────
        const cMap = new Map<string, any>();
        const fMap = new Map<string, any>();

        data.forEach(i => {
            // -- Core Team (Assigned Counselor) --
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

            // -- Follow-up Team (Activity Logs) --
            if (i.activityLog && Array.isArray(i.activityLog)) {
                i.activityLog.forEach((log: any) => {
                    if (log.action === 'note_added' || log.action === 'status_change' || log.action === 'follow_up_set') {
                        const actor = log.counselorName || 'Unknown';
                        if (!fMap.has(actor)) {
                            fMap.set(actor, {
                                name: actor, total: 0,
                                statuses: { New: 0, FollowUp: 0, Converted: 0, CasualInquiry: 0 },
                                overdue: 0, openFollowUp: 0,
                            });
                        }
                        const f = fMap.get(actor)!;
                        f.total++; // Each log is one "follow-up interaction"
                        f.statuses.FollowUp++; // Map activity volume purely to FollowUp for chart rendering
                    }
                });
            }
        });

        const statsArr = Array.from(cMap.values()).map(c => ({
            ...c,
            converted: c.statuses.Converted,
            conversionRate: c.total > 0 ? Number(((c.statuses.Converted / c.total) * 100).toFixed(1)) : 0,
        }));
        
        // Filter out known telecallers from core board
        const isTelecaller = (n: string) => n.toLowerCase().includes('kavitha');
        
        setCounselorStats(statsArr.filter(c => !isTelecaller(c.name)));
        setLeaderboard(statsArr.filter(c => !isTelecaller(c.name)));

        const fStatsArr = Array.from(fMap.values()).map(f => ({
            ...f,
            converted: 0,
            conversionRate: 0,
        })).sort((a, b) => b.total - a.total);

        // Explicitly filter for only the designated follow-up team
        setFollowUpStats(fStatsArr.filter(f => isTelecaller(f.name)));
        setFollowUpLeaderboard(fStatsArr.filter(f => isTelecaller(f.name)));

        // ── Grade Distribution ─────────────────────────────────────────────
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

        // ── Admission Funnel ───────────────────────────────────────────────
        setFunnelData(['New', 'Follow-up', 'Converted', 'Casual Inquiry'].map(stage => ({
            stage,
            count: data.filter(i => i.status === stage).length,
        })));

        // ── Boarding Type ──────────────────────────────────────────────────
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

    const periodLabel = getPeriodLabel(periodFilter, customStart, customEnd);

    return (
        <div className="space-y-6">


            {/* ── Period Filter Bar ──────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-2 p-4 bg-white rounded-xl border border-admin-border shadow-sm">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-admin-text-secondary mr-1">
                    <Calendar size={14} />
                    Period:
                </span>
                {(['today', 'thisWeek', 'thisMonth', 'lastMonth', 'custom'] as PeriodFilter[]).map(p => (
                    <button
                        key={p}
                        onClick={() => setPeriodFilter(p)}
                        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            periodFilter === p
                                ? 'bg-admin-purple text-white shadow-sm'
                                : 'bg-gray-100 text-admin-text hover:bg-gray-200'
                        }`}
                    >
                        {PERIOD_LABELS[p]}
                    </button>
                ))}
                {periodFilter === 'custom' && (
                    <div className="flex items-center gap-2 ml-1">
                        <input
                            type="date"
                            value={customStart}
                            max={customEnd || undefined}
                            onChange={e => setCustomStart(e.target.value)}
                            className="px-2.5 py-1.5 text-sm border border-admin-border rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-admin-purple"
                        />
                        <span className="text-admin-text-secondary text-sm">—</span>
                        <input
                            type="date"
                            value={customEnd}
                            min={customStart || undefined}
                            onChange={e => setCustomEnd(e.target.value)}
                            className="px-2.5 py-1.5 text-sm border border-admin-border rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-admin-purple"
                        />
                    </div>
                )}
                <span className="ml-auto text-xs text-admin-text-secondary">
                    {inquiries.length} inquir{inquiries.length === 1 ? 'y' : 'ies'} in period
                </span>
            </div>

            {/* ── Tabs Navigation ──────────────────────────────────────────────── */}
            <div className="flex border-b border-admin-border mb-6">
                {(['overview', 'marketing', 'counseling', 'pipeline'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors capitalize -mb-[1px] ${
                            activeTab === tab 
                                ? 'border-admin-purple text-admin-purple' 
                                : 'border-transparent text-admin-text-secondary hover:text-admin-text hover:border-gray-300'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ── Tab Content ─────────────────────────────────────────────────── */}
            {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                    <section>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-5 w-1 rounded-full bg-gradient-to-b from-admin-purple to-admin-rose" />
                            <h2 className="text-xl font-bold text-admin-charcoal">Director Overview</h2>
                            <span className="text-xs font-medium text-admin-text-secondary bg-gray-100 px-2 py-0.5 rounded-full">
                                {periodLabel}
                            </span>
                        </div>
                        <DirectorKpiCards {...directorKpis} periodLabel={periodLabel} />
                    </section>

                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <FollowUpHealthChart {...followUpHealth} />
                        <div className="lg:col-span-2">
                            <TrendChart data={trendData30} />
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'marketing' && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                    <section>
                        <SectionHeading label="Marketing Insights" color="bg-blue-400" />
                        <div className="grid grid-cols-1 gap-6 mb-6">
                            <SourceConversionChart data={sourceConvData} />
                        </div>
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
                </div>
            )}

            {activeTab === 'counseling' && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                    <section>
                        <SectionHeading label="Counselor Performance (Core Team)" color="bg-emerald-400" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <CounselorLeaderboard data={leaderboard} />
                        </div>
                        <div className="grid grid-cols-1 gap-6 mb-10">
                            <CounselorPerformanceChart data={counselorStats} />
                        </div>

                        <SectionHeading label="Follow-up Team Activity (Actions taken)" color="bg-purple-400" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <CounselorLeaderboard data={followUpLeaderboard} />
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <CounselorPerformanceChart data={followUpStats} />
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'pipeline' && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
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
                </div>
            )}
        </div>
    );
}
