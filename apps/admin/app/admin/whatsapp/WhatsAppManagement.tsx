'use client';

import { useEffect, useState, useTransition } from 'react';
import {
    MessageSquare, CheckCircle, Clock, XCircle, PauseCircle,
    Send, Users, ChevronRight, ChevronLeft, RefreshCw,
    ExternalLink, Settings, Wifi, WifiOff, AlertTriangle,
    Filter, Eye,
} from 'lucide-react';
import {
    fetchWATemplates, getAudiencePreview, sendBlast, getConnectionStatus, toggleWhatsAppEnabled,
    type WATemplate, type AudienceCriteria, type AudiencePreview, type BlastResult,
} from './actions';

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_STATUSES = ['New', 'Contacted', 'Interested', 'Follow-up', 'Not Interested', 'Admitted'];
const ALL_GRADES   = ['Pre-KG', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
                      'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
const ALL_SOURCES  = ['QRScan', 'WalkIn', 'GoogleForm', 'PhoneCall', 'Referral', 'Website', 'Other'];

// ─── Status badge ─────────────────────────────────────────────────────────────

function TemplateBadge({ status }: { status: WATemplate['status'] }) {
    const map = {
        APPROVED: { color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle size={12} />, label: 'Approved' },
        PENDING:  { color: 'bg-amber-100 text-amber-700 border-amber-200',  icon: <Clock size={12} />,       label: 'Pending'  },
        REJECTED: { color: 'bg-red-100 text-red-700 border-red-200',        icon: <XCircle size={12} />,     label: 'Rejected' },
        PAUSED:   { color: 'bg-gray-100 text-gray-600 border-gray-200',     icon: <PauseCircle size={12} />, label: 'Paused'   },
    };
    const { color, icon, label } = map[status] ?? map.PAUSED;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${color}`}>
            {icon} {label}
        </span>
    );
}

function CategoryBadge({ category }: { category: WATemplate['category'] }) {
    const map = {
        UTILITY:        'bg-blue-50 text-blue-700 border-blue-200',
        MARKETING:      'bg-purple-50 text-purple-700 border-purple-200',
        AUTHENTICATION: 'bg-orange-50 text-orange-700 border-orange-200',
    };
    return (
        <span className={`inline-flex px-2 py-0.5 rounded-full border text-xs font-medium ${map[category] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
            {category.charAt(0) + category.slice(1).toLowerCase()}
        </span>
    );
}

// ─── Multi-select chip group ──────────────────────────────────────────────────

function ChipGroup({ label, options, selected, onChange }: {
    label: string;
    options: string[];
    selected: string[];
    onChange: (v: string[]) => void;
}) {
    const toggle = (v: string) =>
        onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]);
    return (
        <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
            <div className="flex flex-wrap gap-1.5">
                {options.map(o => (
                    <button
                        key={o}
                        type="button"
                        onClick={() => toggle(o)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                            selected.includes(o)
                                ? 'bg-admin-purple text-white border-admin-purple shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-admin-purple/50'
                        }`}
                    >
                        {o}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Tab = 'templates' | 'campaign' | 'settings';
type CampaignStep = 1 | 2 | 3;

export function WhatsAppManagement() {
    const [activeTab, setActiveTab] = useState<Tab>('templates');

    // Connection
    const [connStatus, setConnStatus] = useState<Awaited<ReturnType<typeof getConnectionStatus>> | null>(null);

    // Templates
    const [templates, setTemplates]     = useState<WATemplate[]>([]);
    const [tplLoading, setTplLoading]   = useState(false);
    const [tplError, setTplError]       = useState('');

    // WA enable toggle
    const [toggling, startToggle] = useTransition();

    // Campaign wizard
    const [step, setStep]                       = useState<CampaignStep>(1);
    const [selectedTemplate, setSelectedTemplate] = useState<WATemplate | null>(null);
    const [criteria, setCriteria]               = useState<AudienceCriteria>({ daysBack: 0 });
    const [audience, setAudience]               = useState<AudiencePreview | null>(null);
    const [audienceLoading, startAudienceLoad]  = useTransition();
    const [blastResult, setBlastResult]         = useState<BlastResult | null>(null);
    const [sending, startSend]                  = useTransition();

    // Load connection status on mount
    useEffect(() => {
        getConnectionStatus().then(setConnStatus);
    }, []);

    // Load templates when tab is opened
    useEffect(() => {
        if (activeTab === 'templates' && templates.length === 0) loadTemplates();
    }, [activeTab]);

    async function loadTemplates() {
        setTplLoading(true);
        setTplError('');
        const res = await fetchWATemplates();
        setTemplates(res.templates);
        if (res.error) setTplError(res.error);
        setTplLoading(false);
    }

    function refreshAudience(c: AudienceCriteria) {
        startAudienceLoad(async () => {
            const preview = await getAudiencePreview(c);
            setAudience(preview);
        });
    }

    function handleSendBlast() {
        if (!selectedTemplate) return;
        startSend(async () => {
            // Pass '$studentName' as first body param — resolved per-contact in the action
            const result = await sendBlast(
                selectedTemplate.name,
                selectedTemplate.language,
                criteria,
                ['$studentName']
            );
            setBlastResult(result);
            setStep(3);
        });
    }

    // ── Tabs ──────────────────────────────────────────────────────────────────

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: 'templates', label: 'Templates',     icon: <MessageSquare size={16} /> },
        { id: 'campaign',  label: 'Send Campaign', icon: <Send size={16} /> },
        { id: 'settings',  label: 'Settings',      icon: <Settings size={16} /> },
    ];

    return (
        <div className="p-6 max-w-5xl mx-auto">

            {/* Page header */}
            <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold bg-gradient-to-r from-admin-purple to-admin-rose bg-clip-text text-transparent">
                        WhatsApp Management
                    </h1>
                    <p className="text-sm text-admin-text-secondary mt-1">
                        Manage templates, send targeted campaigns, and track messaging activity.
                    </p>
                </div>

                {/* Connection pill */}
                {connStatus && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                        connStatus.connected
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                        {connStatus.connected
                            ? <><Wifi size={14} /> {connStatus.phoneNumber ?? 'Connected'}</>
                            : <><WifiOff size={14} /> Not connected</>
                        }
                        {connStatus.testMode && (
                            <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full border border-amber-200">
                                TEST MODE
                            </span>
                        )}
                        {!connStatus.enabled && (
                            <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full border border-gray-200">
                                DISABLED
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-admin-border mb-6">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => { setActiveTab(t.id); setStep(1); setBlastResult(null); }}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${
                            activeTab === t.id
                                ? 'border-admin-purple text-admin-purple'
                                : 'border-transparent text-admin-text-secondary hover:text-admin-text'
                        }`}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* ── TEMPLATES TAB ─────────────────────────────────────────── */}
            {activeTab === 'templates' && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-admin-text-secondary">
                            Templates fetched live from Meta Business Manager.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={loadTemplates}
                                disabled={tplLoading}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-admin-border rounded-lg hover:bg-gray-50 transition-all"
                            >
                                <RefreshCw size={14} className={tplLoading ? 'animate-spin' : ''} />
                                Refresh
                            </button>
                            <a
                                href="https://business.facebook.com/wa/manage/message-templates/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-admin-purple text-white rounded-lg hover:opacity-90 transition-all"
                            >
                                <ExternalLink size={14} />
                                Create Template
                            </a>
                        </div>
                    </div>

                    {tplError && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-4">
                            <AlertTriangle size={16} /> {tplError}
                        </div>
                    )}

                    {tplLoading ? (
                        <div className="flex items-center justify-center py-16 text-admin-text-secondary">
                            <RefreshCw size={20} className="animate-spin mr-2" /> Loading templates…
                        </div>
                    ) : templates.length === 0 && !tplError ? (
                        <div className="text-center py-16 text-admin-text-secondary">
                            <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
                            <p>No templates found. Create one in Meta Business Manager.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {templates.map(t => {
                                const bodyComp = t.components?.find(c => c.type === 'BODY');
                                return (
                                    <div key={t.id} className="bg-white rounded-xl border border-admin-border p-4 hover:shadow-sm transition-all">
                                        <div className="flex items-start justify-between gap-3 flex-wrap">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <span className="font-mono text-sm font-semibold text-admin-charcoal">
                                                        {t.name}
                                                    </span>
                                                    <CategoryBadge category={t.category} />
                                                    <span className="text-xs text-gray-400">· {t.language}</span>
                                                </div>
                                                {bodyComp?.text && (
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                        {bodyComp.text}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <TemplateBadge status={t.status} />
                                                {t.status === 'APPROVED' && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedTemplate(t);
                                                            setActiveTab('campaign');
                                                            setStep(2);
                                                        }}
                                                        className="px-3 py-1.5 text-xs font-medium bg-admin-purple/10 text-admin-purple rounded-lg hover:bg-admin-purple/20 transition-all"
                                                    >
                                                        Use in Campaign
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* School use-case guide */}
                    <div className="mt-8 p-5 bg-gradient-to-br from-admin-purple/5 to-admin-rose/5 border border-admin-border rounded-2xl">
                        <h3 className="font-semibold text-admin-charcoal mb-3 flex items-center gap-2">
                            <MessageSquare size={16} className="text-admin-purple" />
                            Recommended Templates for Schools
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            {[
                                { cat: 'Utility', name: 'anushtan_inquiry_ack', desc: 'Acknowledge new inquiry with student name' },
                                { cat: 'Utility', name: 'fee_reminder', desc: 'Remind parents about upcoming fee due date' },
                                { cat: 'Utility', name: 'admission_status', desc: 'Update on admission application progress' },
                                { cat: 'Marketing', name: 'open_house_invite', desc: 'Campus visit / open house invitation' },
                                { cat: 'Marketing', name: 'admissions_open', desc: 'Announce new academic year admissions' },
                                { cat: 'Utility', name: 'followup_reminder', desc: 'Soft follow-up for unconverted inquiries' },
                            ].map(item => (
                                <div key={item.name} className="flex gap-2 p-3 bg-white rounded-xl border border-admin-border/60">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded self-start ${
                                        item.cat === 'Utility' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                    }`}>{item.cat}</span>
                                    <div>
                                        <p className="font-mono text-xs font-semibold text-gray-700">{item.name}</p>
                                        <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-3">
                            Submit new templates in Meta Business Manager. Templates require 24–48h for approval.
                        </p>
                    </div>
                </div>
            )}

            {/* ── CAMPAIGN TAB ──────────────────────────────────────────── */}
            {activeTab === 'campaign' && (
                <div>
                    {/* Step indicator */}
                    <div className="flex items-center gap-2 mb-6">
                        {(['Pick Template', 'Define Audience', 'Review & Send'] as const).map((label, i) => {
                            const stepNum = (i + 1) as CampaignStep;
                            const isDone = step > stepNum;
                            const isActive = step === stepNum;
                            return (
                                <div key={label} className="flex items-center gap-2">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                        isDone   ? 'bg-green-500 text-white' :
                                        isActive ? 'bg-admin-purple text-white' :
                                                   'bg-gray-100 text-gray-400'
                                    }`}>
                                        {isDone ? '✓' : stepNum}
                                    </div>
                                    <span className={`text-sm font-medium ${isActive ? 'text-admin-charcoal' : 'text-gray-400'}`}>
                                        {label}
                                    </span>
                                    {i < 2 && <ChevronRight size={16} className="text-gray-300 mx-1" />}
                                </div>
                            );
                        })}
                    </div>

                    {/* Step 1: Pick Template */}
                    {step === 1 && (
                        <div>
                            <h2 className="font-semibold text-admin-charcoal mb-4">Select an approved template</h2>
                            {templates.filter(t => t.status === 'APPROVED').length === 0 && (
                                <div className="text-center py-10 text-gray-400">
                                    <p>No approved templates. Go to the Templates tab to refresh or create one.</p>
                                    <button onClick={() => setActiveTab('templates')} className="mt-3 text-admin-purple underline text-sm">
                                        Go to Templates
                                    </button>
                                </div>
                            )}
                            <div className="space-y-2">
                                {templates.filter(t => t.status === 'APPROVED').map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => { setSelectedTemplate(t); setStep(2); setCriteria({ daysBack: 0 }); setAudience(null); }}
                                        className="w-full text-left p-4 rounded-xl border border-admin-border hover:border-admin-purple hover:shadow-sm transition-all bg-white flex items-center justify-between gap-3"
                                    >
                                        <div>
                                            <p className="font-mono text-sm font-semibold text-admin-charcoal">{t.name}</p>
                                            <div className="flex gap-2 mt-1">
                                                <CategoryBadge category={t.category} />
                                                <span className="text-xs text-gray-400">{t.language}</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-400 shrink-0" />
                                    </button>
                                ))}
                            </div>
                            {templates.length === 0 && (
                                <button
                                    onClick={() => { setActiveTab('templates'); loadTemplates(); }}
                                    className="mt-4 flex items-center gap-1.5 text-sm text-admin-purple hover:underline"
                                >
                                    <RefreshCw size={14} /> Load templates first
                                </button>
                            )}
                        </div>
                    )}

                    {/* Step 2: Define Audience */}
                    {step === 2 && selectedTemplate && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold text-admin-charcoal">
                                    Define audience for <span className="font-mono text-admin-purple">{selectedTemplate.name}</span>
                                </h2>
                                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                                    <ChevronLeft size={16} /> Change template
                                </button>
                            </div>

                            <div className="bg-white rounded-xl border border-admin-border p-5 space-y-5">
                                <ChipGroup
                                    label="Inquiry Status"
                                    options={ALL_STATUSES}
                                    selected={criteria.statuses ?? []}
                                    onChange={v => setCriteria(c => ({ ...c, statuses: v }))}
                                />
                                <ChipGroup
                                    label="Grade Interested In"
                                    options={ALL_GRADES}
                                    selected={criteria.grades ?? []}
                                    onChange={v => setCriteria(c => ({ ...c, grades: v }))}
                                />
                                <ChipGroup
                                    label="Inquiry Source"
                                    options={ALL_SOURCES}
                                    selected={criteria.sources ?? []}
                                    onChange={v => setCriteria(c => ({ ...c, sources: v }))}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Preference</p>
                                        <select
                                            value={criteria.preference ?? ''}
                                            onChange={e => setCriteria(c => ({ ...c, preference: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-admin-purple/30"
                                        >
                                            <option value="">Any</option>
                                            <option>Day Scholar</option>
                                            <option>Hostel</option>
                                        </select>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Inquired In Last</p>
                                        <select
                                            value={criteria.daysBack ?? 0}
                                            onChange={e => setCriteria(c => ({ ...c, daysBack: Number(e.target.value) }))}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-admin-purple/30"
                                        >
                                            <option value={0}>All time</option>
                                            <option value={7}>7 days</option>
                                            <option value={14}>14 days</option>
                                            <option value={30}>30 days</option>
                                            <option value={60}>60 days</option>
                                            <option value={90}>90 days</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => refreshAudience(criteria)}
                                    disabled={audienceLoading}
                                    className="flex items-center gap-2 px-4 py-2 border border-admin-border rounded-lg text-sm hover:bg-gray-50 transition-all"
                                >
                                    <Eye size={15} className={audienceLoading ? 'animate-pulse' : ''} />
                                    {audienceLoading ? 'Calculating…' : 'Preview Audience'}
                                </button>

                                {audience && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-admin-purple/10 rounded-lg text-sm">
                                        <Users size={15} className="text-admin-purple" />
                                        <span className="font-semibold text-admin-purple">{audience.count}</span>
                                        <span className="text-gray-600">contacts matched</span>
                                    </div>
                                )}
                            </div>

                            {audience && audience.count > 0 && (
                                <div className="bg-white rounded-xl border border-admin-border p-4">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                        <Filter size={12} /> Sample (first 5)
                                    </p>
                                    <div className="space-y-1.5">
                                        {audience.sample.map((s, i) => (
                                            <div key={i} className="flex items-center gap-3 text-sm">
                                                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                                                <span className="font-medium text-gray-800 w-40 truncate">{s.name}</span>
                                                <span className="text-gray-400 font-mono text-xs">{s.phone}</span>
                                                <span className="text-gray-400 text-xs">{s.grade}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    onClick={() => { if (!audience) { refreshAudience(criteria); } setStep(3 as CampaignStep); }}
                                    disabled={audience !== null && audience.count === 0}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-admin-purple text-white rounded-xl font-medium text-sm hover:opacity-90 disabled:opacity-40 transition-all"
                                >
                                    Continue to Review <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review & Send / Result */}
                    {step === 3 && (
                        <div className="space-y-5">
                            {!blastResult ? (
                                <>
                                    <h2 className="font-semibold text-admin-charcoal">Review & Confirm</h2>

                                    <div className="bg-white rounded-xl border border-admin-border p-5 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Template</span>
                                            <span className="font-mono font-semibold text-admin-charcoal">{selectedTemplate?.name}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Category</span>
                                            <span>{selectedTemplate && <CategoryBadge category={selectedTemplate.category} />}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Audience</span>
                                            <span className="font-semibold text-admin-purple">{audience?.count ?? '—'} contacts</span>
                                        </div>
                                        {criteria.statuses?.length ? (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Status filter</span>
                                                <span>{criteria.statuses.join(', ')}</span>
                                            </div>
                                        ) : null}
                                        {criteria.grades?.length ? (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Grade filter</span>
                                                <span>{criteria.grades.join(', ')}</span>
                                            </div>
                                        ) : null}
                                        {criteria.daysBack ? (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Date range</span>
                                                <span>Last {criteria.daysBack} days</span>
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                                        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                        <span>
                                            This will send a WhatsApp message to <strong>{audience?.count ?? '?'} real phone numbers</strong>.
                                            Make sure your template is correct before proceeding.
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setStep(2)} className="px-4 py-2.5 border border-admin-border rounded-xl text-sm hover:bg-gray-50 transition-all flex items-center gap-1.5">
                                            <ChevronLeft size={15} /> Back
                                        </button>
                                        <button
                                            onClick={handleSendBlast}
                                            disabled={sending}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-admin-purple to-admin-rose text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all shadow-md"
                                        >
                                            <Send size={16} />
                                            {sending ? 'Sending…' : `Send to ${audience?.count ?? '?'} Contacts`}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                /* Result screen */
                                <div className="text-center py-8">
                                    <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                                        blastResult.failed === 0 ? 'bg-green-100' : 'bg-amber-100'
                                    }`}>
                                        {blastResult.failed === 0
                                            ? <CheckCircle size={32} className="text-green-600" />
                                            : <AlertTriangle size={32} className="text-amber-600" />
                                        }
                                    </div>
                                    <h2 className="text-xl font-bold text-admin-charcoal mb-2">Campaign Sent</h2>
                                    <div className="flex justify-center gap-6 mb-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-green-600">{blastResult.sent}</p>
                                            <p className="text-xs text-gray-500">Delivered</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-red-500">{blastResult.failed}</p>
                                            <p className="text-xs text-gray-500">Failed</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-gray-600">{blastResult.total}</p>
                                            <p className="text-xs text-gray-500">Total</p>
                                        </div>
                                    </div>
                                    {blastResult.errors.length > 0 && (
                                        <div className="text-left max-h-32 overflow-y-auto bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-xs text-red-700 space-y-1">
                                            {blastResult.errors.map((e, i) => <p key={i}>{e}</p>)}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => { setStep(1); setBlastResult(null); setSelectedTemplate(null); setAudience(null); setCriteria({ daysBack: 0 }); }}
                                        className="px-5 py-2.5 bg-admin-purple text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all"
                                    >
                                        New Campaign
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ── SETTINGS TAB ──────────────────────────────────────────── */}
            {activeTab === 'settings' && connStatus && (
                <div className="space-y-4 max-w-xl">

                    <div className="bg-white rounded-xl border border-admin-border divide-y divide-gray-100">
                        {/* Connection */}
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-admin-charcoal text-sm">Connection</p>
                                <p className="text-xs text-gray-400 mt-0.5">{connStatus.phoneNumber ?? 'No phone number'}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                connStatus.connected ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                                {connStatus.connected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>

                        {/* WABA name */}
                        {connStatus.wabaName && (
                            <div className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-admin-charcoal text-sm">Business Account</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{connStatus.wabaName}</p>
                                </div>
                            </div>
                        )}

                        {/* Enabled — interactive toggle */}
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-admin-charcoal text-sm">Messaging Enabled</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {connStatus.enabled ? 'WhatsApp messages are being sent.' : 'All WhatsApp messages are suppressed.'}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    const next = !connStatus.enabled;
                                    startToggle(async () => {
                                        await toggleWhatsAppEnabled(next);
                                        setConnStatus(s => s ? { ...s, enabled: next } : s);
                                    });
                                }}
                                disabled={toggling}
                                aria-label={connStatus.enabled ? 'Disable WhatsApp' : 'Enable WhatsApp'}
                                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
                                    connStatus.enabled ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                            >
                                <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                                    connStatus.enabled ? 'translate-x-5' : 'translate-x-0'
                                }`} />
                            </button>
                        </div>

                        {/* Test mode */}
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-admin-charcoal text-sm">Test Mode</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    When ON, all messages go to WHATSAPP_TEST_RECIPIENT instead of real numbers
                                </p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                connStatus.testMode ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}>
                                {connStatus.testMode ? 'ON' : 'OFF'}
                            </span>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700 space-y-1">
                        <p className="font-semibold">Note on Test Mode:</p>
                        <p>When Test Mode is ON, all messages are redirected to <code className="font-mono bg-blue-100 px-1 rounded">WHATSAPP_TEST_RECIPIENT</code> instead of real parent numbers.</p>
                        <p>Change <code className="font-mono bg-blue-100 px-1 rounded">WHATSAPP_TEST_MODE</code> in <code className="font-mono bg-blue-100 px-1 rounded">.env.local</code> and restart to toggle it.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
