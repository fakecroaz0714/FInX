'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
    Search,
    ShieldAlert,
    FileCheck2,
    Building2,
    MapPin,
    Eye,
    AlertTriangle,
    CheckCircle2,
    FileText,
    AlertCircle,
    RefreshCw,
    Clock,
    X,
    Filter,
    ShieldCheck,
    ChevronRight,
    TrendingUp,
    BarChart3,
    Sparkles,
    SlidersHorizontal,
    ArrowUpRight,
    Compass
} from 'lucide-react';
import { ValidatorActiveProjectsMap } from '@/components/maps/ValidatorActiveProjectsMap';

import { useProposals } from '@/lib/ProposalContext';
import { useLanguage } from '@/lib/LanguageContext';
import {
    NGOValidationRecord,
    AuditLogRecord,
    NGOStatus,
    PriorityLevel,
    loadStoredNGOs,
    saveStoredNGOs,
    loadStoredAuditLogs,
    saveStoredAuditLogs,
    createAuditEntry
} from '@/lib/validatorData';

export default function ValidatorDashboard() {
    const { t } = useLanguage();
    // Central NGO dataset and audit logs
    const [ngos, setNgos] = useState<NGOValidationRecord[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);

    // Navigation and active selection
    const [activeTab, setActiveTab] = useState<'Overview' | 'Active Projects Map' | 'Validation Queue' | 'Risk Assessment' | 'Project Proposals' | 'Audit Logs'>('Overview');
    const [selectedNGO, setSelectedNGO] = useState<NGOValidationRecord | null>(null);
    const [riskInspectedNGOId, setRiskInspectedNGOId] = useState<string>('NGO-1082');

    // Filter and search states
    const [queueSearch, setQueueSearch] = useState('');
    const [queueStatusFilter, setQueueStatusFilter] = useState<string>('All');
    const [queuePriorityFilter, setQueuePriorityFilter] = useState<string>('All');
    const [queueTypeFilter, setQueueTypeFilter] = useState<string>('All');
    const [queueStateFilter, setQueueStateFilter] = useState<string>('All');

    const [auditSearch, setAuditSearch] = useState('');
    const [auditActionFilter, setAuditActionFilter] = useState<string>('All');

    // Proposal Context
    const { proposals, validateProposal } = useProposals();

    // Feedback notification
    const [notification, setNotification] = useState<{ type: 'success' | 'warning' | 'info'; message: string } | null>(null);

    // Document preview modal state
    const [previewDoc, setPreviewDoc] = useState<string | null>(null);

    // Initialize data from localStorage
    useEffect(() => {
        const loadedNgos = loadStoredNGOs();
        const loadedLogs = loadStoredAuditLogs();
        setNgos(loadedNgos);
        setAuditLogs(loadedLogs);
        if (loadedNgos.length > 0) {
            setRiskInspectedNGOId(loadedNgos[1]?.id || loadedNgos[0]?.id);
        }
    }, []);

    const triggerNotification = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    // Calculate real-time KPI counters from `ngos`
    const stats = useMemo(() => {
        const total = ngos.length;
        const verified = ngos.filter(n => n.status === 'VERIFIED').length;
        const needsReview = ngos.filter(n => ['NEEDS_REVIEW', 'PENDING_REVIEW', 'UNDER_VERIFICATION', 'DOCUMENTS_MISSING'].includes(n.status)).length;
        const highRisk = ngos.filter(n => n.status === 'HIGH_RISK').length;

        const verificationRate = total > 0 ? ((verified / total) * 100).toFixed(1) : '0.0';
        const highRiskRate = total > 0 ? ((highRisk / total) * 100).toFixed(1) : '0.0';
        const avgScore = total > 0 ? Math.round(ngos.reduce((acc, n) => acc + n.score, 0) / total) : 0;

        return {
            total,
            verified,
            needsReview,
            highRisk,
            verificationRate,
            highRiskRate,
            avgScore
        };
    }, [ngos]);

    // Handle Validator Action on an NGO
    const handleUpdateNGOStatus = (ngoId: string, newStatus: NGOStatus, actionName: string, reason: string) => {
        const targetNGO = ngos.find(n => n.id === ngoId);
        if (!targetNGO) return;

        const prevStatusFriendly = formatStatusLabel(targetNGO.status);
        const newStatusFriendly = formatStatusLabel(newStatus);

        const updatedNgos = ngos.map(n => {
            if (n.id === ngoId) {
                return {
                    ...n,
                    status: newStatus,
                    verifiedAt: newStatus === 'VERIFIED' ? new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : n.verifiedAt
                };
            }
            return n;
        });

        setNgos(updatedNgos);
        saveStoredNGOs(updatedNgos);

        // Create immutable audit log entry
        const logEntry = createAuditEntry(
            targetNGO.id,
            targetNGO.name,
            actionName,
            prevStatusFriendly,
            newStatusFriendly,
            reason
        );

        const updatedLogs = [logEntry, ...auditLogs];
        setAuditLogs(updatedLogs);
        saveStoredAuditLogs(updatedLogs);

        // Update selected NGO state if currently viewed
        if (selectedNGO && selectedNGO.id === ngoId) {
            setSelectedNGO(prev => prev ? { ...prev, status: newStatus } : null);
        }

        triggerNotification(`Action "${actionName}" completed for ${targetNGO.name}. Status updated to "${newStatusFriendly}".`);
    };

    // Forward proposal to CSR funder & create audit log
    const handleValidateProposal = (proposalId: string, ngoName: string, projectTitle: string) => {
        validateProposal(proposalId);

        // Log audit event
        const matchedNGO = ngos.find(n => n.name.toLowerCase() === ngoName.toLowerCase());
        const logEntry = createAuditEntry(
            matchedNGO?.id || 'PROP-AUD',
            ngoName,
            'Approve Proposal',
            'Pending Review',
            'NGO Validated',
            `Validated funding proposal for project: "${projectTitle}". Forwarded to Corporate Funder for escrow locking.`
        );

        const updatedLogs = [logEntry, ...auditLogs];
        setAuditLogs(updatedLogs);
        saveStoredAuditLogs(updatedLogs);

        triggerNotification(`Proposal "${projectTitle}" verified and forwarded to Corporate CSR Matching!`);
    };

    // Format status labels
    function formatStatusLabel(status: NGOStatus): string {
        switch (status) {
            case 'VERIFIED': return 'Verified';
            case 'NEEDS_REVIEW': return 'Needs Review';
            case 'HIGH_RISK': return 'High Risk';
            case 'PENDING_REVIEW': return 'Pending Review';
            case 'DOCUMENTS_MISSING': return 'Documents Missing';
            case 'UNDER_VERIFICATION': return 'Under Verification';
            case 'REJECTED': return 'Rejected';
            default: return status;
        }
    }

    // Status Badge Variant
    function getStatusBadgeVariant(status: NGOStatus): 'default' | 'success' | 'warning' | 'danger' | 'neutral' {
        switch (status) {
            case 'VERIFIED': return 'success';
            case 'NEEDS_REVIEW': return 'warning';
            case 'HIGH_RISK': return 'danger';
            case 'DOCUMENTS_MISSING': return 'warning';
            case 'PENDING_REVIEW': return 'neutral';
            case 'UNDER_VERIFICATION': return 'default';
            case 'REJECTED': return 'danger';
            default: return 'neutral';
        }
    }

    // Filtered Queue dataset
    const filteredQueue = useMemo(() => {
        return ngos.filter(ngo => {
            const matchesSearch = queueSearch.trim() === '' ||
                ngo.name.toLowerCase().includes(queueSearch.toLowerCase()) ||
                ngo.id.toLowerCase().includes(queueSearch.toLowerCase()) ||
                ngo.pan.toLowerCase().includes(queueSearch.toLowerCase());

            const matchesStatus = queueStatusFilter === 'All' || ngo.status === queueStatusFilter;
            const matchesPriority = queuePriorityFilter === 'All' || ngo.priority === queuePriorityFilter;
            const matchesType = queueTypeFilter === 'All' || ngo.registrationType === queueTypeFilter;
            const matchesState = queueStateFilter === 'All' || ngo.state === queueStateFilter;

            return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesState;
        });
    }, [ngos, queueSearch, queueStatusFilter, queuePriorityFilter, queueTypeFilter, queueStateFilter]);

    // Filtered Audit Logs
    const filteredAuditLogs = useMemo(() => {
        return auditLogs.filter(log => {
            const matchesSearch = auditSearch.trim() === '' ||
                log.ngoName.toLowerCase().includes(auditSearch.toLowerCase()) ||
                log.id.toLowerCase().includes(auditSearch.toLowerCase()) ||
                log.reason.toLowerCase().includes(auditSearch.toLowerCase());

            const matchesAction = auditActionFilter === 'All' || log.action === auditActionFilter;

            return matchesSearch && matchesAction;
        });
    }, [auditLogs, auditSearch, auditActionFilter]);

    // Target NGO for Risk Tab inspection
    const inspectedNGO = useMemo(() => {
        return ngos.find(n => n.id === riskInspectedNGOId) || ngos[0];
    }, [ngos, riskInspectedNGOId]);

    // NGOs requiring urgent attention for Overview
    const attentionNGOs = useMemo(() => {
        return ngos.filter(n => ['NEEDS_REVIEW', 'HIGH_RISK', 'DOCUMENTS_MISSING'].includes(n.status))
            .sort((a, b) => a.score - b.score);
    }, [ngos]);

    return (
        <div className="p-8 pb-24 max-w-7xl mx-auto space-y-8">
            {/* Notification Banner */}
            {notification && (
                <div className={`p-4 rounded-xl flex items-center justify-between border shadow-sm animate-in fade-in ${
                    notification.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : notification.type === 'warning'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                }`}>
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-sm font-semibold">{notification.message}</span>
                    </div>
                    <button onClick={() => setNotification(null)} className="font-bold text-xs hover:opacity-75">Dismiss</button>
                </div>
            )}

            {/* Header with Title & FINX Trust Flow */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <Badge variant="default" className="text-[11px] font-bold">{t('validator_engine_badge', 'FINX Oversight Engine')}</Badge>
                        <span className="text-xs text-slate-400 font-medium">{t('validator_engine_sub', 'Independent Auditing & Risk Assessment')}</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('validator_dashboard_title', 'NGO Validator Dashboard')}</h1>
                    <p className="text-slate-500 mt-1 font-medium text-sm">
                        {t('validator_dashboard_sub', 'Government-grade compliance verification, risk modeling, and on-chain proposal endorsement.')}
                    </p>
                </div>

                {/* Trust Flow Visual Indicator */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center gap-2 text-[11px] font-semibold text-slate-600 overflow-x-auto">
                    <span className="text-slate-400">{t('trust_flow_label', 'Trust Flow:')}</span>
                    <span className="bg-white px-2.5 py-1 rounded shadow-2xs border border-slate-200 text-slate-700">{t('step_reg', '1. Registration')}</span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded border border-indigo-200 font-bold">{t('step_doc_val', '2. Document Validation')}</span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-white px-2.5 py-1 rounded shadow-2xs border border-slate-200 text-slate-700">{t('step_risk_assess', '3. Risk Assessment')}</span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-white px-2.5 py-1 rounded shadow-2xs border border-slate-200 text-slate-700">{t('step_prop_review', '4. Proposal Review')}</span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded border border-emerald-200 font-bold">{t('step_csr_match', '5. CSR Matching')}</span>
                </div>
            </header>

            {/* Summary KPI Cards (Derived from real-time NGO state) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <Card className="border border-slate-200 shadow-sm">
                    <CardContent className="p-5">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('kpi_total_ngos', 'Total NGOs')}</div>
                        <div className="text-3xl font-bold text-slate-900 mt-2 font-mono">{stats.total}</div>
                        <div className="text-[11px] text-slate-400 mt-1">{t('kpi_total_ngos_sub', 'Platform registered non-profits')}</div>
                    </CardContent>
                </Card>
                <Card className="border border-slate-200 shadow-sm border-b-4 border-b-emerald-500">
                    <CardContent className="p-5">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('status_verified', 'Verified')}</div>
                        <div className="text-3xl font-bold text-emerald-600 mt-2 font-mono">{stats.verified}</div>
                        <div className="text-[11px] text-emerald-600 font-semibold mt-1">{stats.verificationRate}% {t('kpi_verified_rate', 'Verified Rate')}</div>
                    </CardContent>
                </Card>
                <Card className="border border-slate-200 shadow-sm border-b-4 border-b-amber-500">
                    <CardContent className="p-5">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('status_needs_review', 'Needs Review')}</div>
                        <div className="text-3xl font-bold text-amber-600 mt-2 font-mono">{stats.needsReview}</div>
                        <div className="text-[11px] text-amber-600 font-semibold mt-1">{t('kpi_needs_review_sub', 'Pending validation or docs')}</div>
                    </CardContent>
                </Card>
                <Card className="border border-slate-200 shadow-sm border-b-4 border-b-rose-500">
                    <CardContent className="p-5">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('status_high_risk', 'High Risk')}</div>
                        <div className="text-3xl font-bold text-rose-600 mt-2 font-mono">{stats.highRisk}</div>
                        <div className="text-[11px] text-rose-600 font-semibold mt-1">{stats.highRiskRate}% of Active NGOs</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tabs Navigation */}
            <Card className="border border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100 p-0 px-6 pt-3 pb-0">
                    <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar">
                        {[
                            { id: 'Overview', key: 'tab_overview', label: 'Overview' },
                            { id: 'Active Projects Map', key: 'tab_active_projects_map', label: 'Active Projects Map' },
                            { id: 'Validation Queue', key: 'tab_validation_queue', label: 'Validation Queue' },
                            { id: 'Risk Assessment', key: 'tab_risk_assessment', label: 'Risk Assessment' },
                            { id: 'Project Proposals', key: 'tab_project_proposals', label: 'Project Proposals' },
                            { id: 'Audit Logs', key: 'tab_audit_logs', label: 'Audit Logs' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`text-sm font-semibold pb-3.5 pt-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                                    activeTab === tab.id
                                        ? 'text-indigo-600 border-indigo-600'
                                        : 'text-slate-500 border-transparent hover:text-slate-800'
                                }`}
                            >
                                {tab.id === 'Active Projects Map' && <Compass className="w-4 h-4 text-blue-600" />}
                                {t(tab.key, tab.label)}
                                {tab.id === 'Validation Queue' && stats.needsReview > 0 && (
                                    <span className="ml-2 bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {stats.needsReview}
                                    </span>
                                )}
                                {tab.id === 'Project Proposals' && proposals.filter(p => p.status === 'Submitted').length > 0 && (
                                    <span className="ml-2 bg-indigo-100 text-indigo-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {proposals.filter(p => p.status === 'Submitted').length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    {/* Active Projects Map View */}
                    {activeTab === 'Active Projects Map' && (
                        <div className="space-y-4">
                            <ValidatorActiveProjectsMap />
                        </div>
                    )}

                    {/* =========================================================================
                        TAB 1: OVERVIEW
                       ========================================================================= */}
                    {activeTab === 'Overview' && (
                        <div className="space-y-8">
                            {/* Map Spotlight Banner in Overview */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-sm shrink-0">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Field Geo-Verification Map Active</h4>
                                        <p className="text-xs text-slate-600 mt-0.5">
                                            5 active NGO projects undergoing physical GPS audits, drone tree checks, and milestone inspection across Maharashtra.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveTab('Active Projects Map')}
                                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition shadow-xs whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Compass className="w-3.5 h-3.5" /> Open Field Verification Map &rarr;
                                </button>
                            </div>
                            {/* Verification Statistics Panel */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-indigo-600" /> Verification Overview
                                </h3>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <span className="text-xs text-slate-500 font-semibold block mb-1">Verification Rate</span>
                                        <span className="text-2xl font-bold font-mono text-emerald-600">{stats.verificationRate}%</span>
                                        <p className="text-[11px] text-slate-400 mt-1">Compliant & approved</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <span className="text-xs text-slate-500 font-semibold block mb-1">Pending Reviews</span>
                                        <span className="text-2xl font-bold font-mono text-amber-600">{stats.needsReview}</span>
                                        <p className="text-[11px] text-slate-400 mt-1">In validation pipeline</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <span className="text-xs text-slate-500 font-semibold block mb-1">High Risk Percentage</span>
                                        <span className="text-2xl font-bold font-mono text-rose-600">{stats.highRiskRate}%</span>
                                        <p className="text-[11px] text-slate-400 mt-1">Flagged for legal issues</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <span className="text-xs text-slate-500 font-semibold block mb-1">Average Risk Score</span>
                                        <span className="text-2xl font-bold font-mono text-slate-900">{stats.avgScore} / 100</span>
                                        <p className="text-[11px] text-slate-400 mt-1">Assisted Transparency Index</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Validation Activity */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-indigo-600" /> Recent Validation Activity
                                    </h3>
                                    <button
                                        onClick={() => setActiveTab('Audit Logs')}
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                    >
                                        View Full Audit Trail <ArrowUpRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="space-y-2.5">
                                    {auditLogs.slice(0, 4).map(log => (
                                        <div key={log.id} className="p-3.5 bg-slate-50 hover:bg-slate-100/80 transition rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-3">
                                                {log.action.includes('Verify') ? (
                                                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">✓</span>
                                                ) : log.action.includes('Flag') || log.action.includes('Reject') ? (
                                                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold">✕</span>
                                                ) : (
                                                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">⚠</span>
                                                )}
                                                <div>
                                                    <span className="font-bold text-slate-900">{log.ngoName}</span>
                                                    <span className="text-slate-500 ml-1.5">• {log.action}</span>
                                                    <p className="text-[11px] text-slate-500 mt-0.5">{log.reason}</p>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="text-slate-400 font-mono block text-[11px]">{log.timestamp}</span>
                                                <Badge variant="neutral" className="text-[10px] mt-1">{log.referenceId}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* NGOs Requiring Attention */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-amber-600" /> NGOs Requiring Attention
                                    </h3>
                                    <span className="text-xs text-slate-400 font-medium">Sorted by risk priority</span>
                                </div>
                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                                            <tr>
                                                <th className="p-3.5">NGO</th>
                                                <th className="p-3.5">Risk Score</th>
                                                <th className="p-3.5">Key Compliance Issue</th>
                                                <th className="p-3.5">Status</th>
                                                <th className="p-3.5 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {attentionNGOs.map(ngo => (
                                                <tr key={ngo.id} className="hover:bg-amber-50/20 transition">
                                                    <td className="p-3.5">
                                                        <div className="font-bold text-slate-900">{ngo.name}</div>
                                                        <div className="text-[11px] text-slate-400 font-mono">{ngo.id} • {ngo.location}</div>
                                                    </td>
                                                    <td className="p-3.5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full rounded-full"
                                                                    style={{
                                                                        width: `${ngo.score}%`,
                                                                        backgroundColor: ngo.score > 80 ? '#10b981' : ngo.score > 50 ? '#f59e0b' : '#ef4444'
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="font-mono font-bold text-slate-900">{ngo.score}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3.5 text-slate-600 max-w-xs truncate">
                                                        {ngo.issue || 'Pending review of compliance documents'}
                                                    </td>
                                                    <td className="p-3.5">
                                                        <Badge variant={getStatusBadgeVariant(ngo.status)}>
                                                            {formatStatusLabel(ngo.status)}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3.5 text-right">
                                                        <button
                                                            onClick={() => setSelectedNGO(ngo)}
                                                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition"
                                                        >
                                                            Review
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* =========================================================================
                        TAB 2: VALIDATION QUEUE
                       ========================================================================= */}
                    {activeTab === 'Validation Queue' && (
                        <div className="space-y-4">
                            {/* Search & Multi-Filters Toolbar */}
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder={t('search_queue_placeholder', 'Search by NGO name, ID, or PAN...')}
                                            value={queueSearch}
                                            onChange={e => setQueueSearch(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        <select
                                            value={queueStatusFilter}
                                            onChange={e => setQueueStatusFilter(e.target.value)}
                                            className="p-2 border border-slate-200 rounded-lg bg-white font-medium text-slate-700 outline-none"
                                        >
                                            <option value="All">{t('filter_all_status', 'All Statuses')}</option>
                                            <option value="PENDING_REVIEW">Pending Review</option>
                                            <option value="NEEDS_REVIEW">{t('status_needs_review', 'Needs Review')}</option>
                                            <option value="DOCUMENTS_MISSING">Documents Missing</option>
                                            <option value="UNDER_VERIFICATION">Under Verification</option>
                                            <option value="VERIFIED">{t('status_verified', 'Verified')}</option>
                                            <option value="HIGH_RISK">{t('status_high_risk', 'High Risk')}</option>
                                            <option value="REJECTED">Rejected</option>
                                        </select>

                                        <select
                                            value={queuePriorityFilter}
                                            onChange={e => setQueuePriorityFilter(e.target.value)}
                                            className="p-2 border border-slate-200 rounded-lg bg-white font-medium text-slate-700 outline-none"
                                        >
                                            <option value="All">{t('filter_all_priority', 'All Priorities')}</option>
                                            <option value="High">High Priority</option>
                                            <option value="Medium">Medium Priority</option>
                                            <option value="Low">Low Priority</option>
                                        </select>

                                        <select
                                            value={queueTypeFilter}
                                            onChange={e => setQueueTypeFilter(e.target.value)}
                                            className="p-2 border border-slate-200 rounded-lg bg-white font-medium text-slate-700 outline-none"
                                        >
                                            <option value="All">{t('filter_all_types', 'All Types')}</option>
                                            <option value="Trust">Trust</option>
                                            <option value="Society">Society</option>
                                            <option value="Section 8 Company">Section 8 Company</option>
                                        </select>

                                        {(queueSearch || queueStatusFilter !== 'All' || queuePriorityFilter !== 'All' || queueTypeFilter !== 'All') && (
                                            <button
                                                onClick={() => {
                                                    setQueueSearch('');
                                                    setQueueStatusFilter('All');
                                                    setQueuePriorityFilter('All');
                                                    setQueueTypeFilter('All');
                                                    setQueueStateFilter('All');
                                                }}
                                                className="px-3 py-2 text-indigo-600 hover:text-indigo-800 font-bold"
                                            >
                                                {t('btn_reset_filters', 'Reset Filters')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Queue Table */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                {filteredQueue.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500 font-medium bg-slate-50 text-xs">
                                        No NGOs found matching the selected filter criteria.
                                    </div>
                                ) : (
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                                            <tr>
                                                <th className="p-3.5">{t('th_ngo_name_id', 'Organization')}</th>
                                                <th className="p-3.5">NGO ID</th>
                                                <th className="p-3.5">{t('reg_type', 'Reg Type')}</th>
                                                <th className="p-3.5">{t('state_district', 'State')}</th>
                                                <th className="p-3.5">{t('th_date', 'Submitted')}</th>
                                                <th className="p-3.5">Documents</th>
                                                <th className="p-3.5">{t('th_risk_score', 'Risk Score')}</th>
                                                <th className="p-3.5">{t('th_priority', 'Priority')}</th>
                                                <th className="p-3.5">{t('th_status', 'Status')}</th>
                                                <th className="p-3.5 text-right">{t('th_action', 'Action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredQueue.map(ngo => (
                                                <tr key={ngo.id} className="hover:bg-slate-50 transition">
                                                    <td className="p-3.5">
                                                        <div className="font-bold text-slate-900">{ngo.name}</div>
                                                        <div className="text-[11px] text-slate-400">{ngo.primaryFocusArea}</div>
                                                    </td>
                                                    <td className="p-3.5 font-mono text-slate-700">{ngo.id}</td>
                                                    <td className="p-3.5 text-slate-600 font-medium">{ngo.registrationType}</td>
                                                    <td className="p-3.5 text-slate-600">{ngo.district}, {ngo.state}</td>
                                                    <td className="p-3.5 text-slate-500">{ngo.submittedAt}</td>
                                                    <td className="p-3.5">
                                                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                                                            {ngo.documentsCount}
                                                        </span>
                                                    </td>
                                                    <td className="p-3.5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-14 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full rounded-full"
                                                                    style={{
                                                                        width: `${ngo.score}%`,
                                                                        backgroundColor: ngo.score > 80 ? '#10b981' : ngo.score > 50 ? '#f59e0b' : '#ef4444'
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="font-mono font-bold text-slate-900">{ngo.score}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3.5">
                                                        <Badge variant={ngo.priority === 'High' ? 'danger' : ngo.priority === 'Medium' ? 'warning' : 'neutral'} className="text-[10px]">
                                                            {ngo.priority}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3.5">
                                                        <Badge variant={getStatusBadgeVariant(ngo.status)} className="text-[10px]">
                                                            {formatStatusLabel(ngo.status)}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3.5 text-right">
                                                        <button
                                                            onClick={() => setSelectedNGO(ngo)}
                                                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition"
                                                        >
                                                            Review
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    {/* =========================================================================
                        TAB 3: RISK ASSESSMENT
                       ========================================================================= */}
                    {activeTab === 'Risk Assessment' && (
                        <div className="space-y-6">
                            {/* Risk Distribution Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-emerald-800 uppercase">Low Risk</span>
                                        <Badge variant="success" className="text-[10px]">Score ≥ 80</Badge>
                                    </div>
                                    <div className="text-3xl font-bold font-mono text-emerald-900">
                                        {ngos.filter(n => n.score >= 80).length} NGOs
                                    </div>
                                    <p className="text-[11px] text-emerald-700 mt-1">Full compliance & verified history</p>
                                </div>
                                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-amber-800 uppercase">Medium Risk</span>
                                        <Badge variant="warning" className="text-[10px]">Score 50-79</Badge>
                                    </div>
                                    <div className="text-3xl font-bold font-mono text-amber-900">
                                        {ngos.filter(n => n.score >= 50 && n.score < 80).length} NGOs
                                    </div>
                                    <p className="text-[11px] text-amber-700 mt-1">Document renewals or checks pending</p>
                                </div>
                                <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-rose-800 uppercase">High Risk</span>
                                        <Badge variant="danger" className="text-[10px]">Score &lt; 50</Badge>
                                    </div>
                                    <div className="text-3xl font-bold font-mono text-rose-900">
                                        {ngos.filter(n => n.score < 50).length} NGOs
                                    </div>
                                    <p className="text-[11px] text-rose-700 mt-1">Expired certificates or missing legal docs</p>
                                </div>
                            </div>

                            {/* Risk Breakdown Inspector for Selected NGO */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left: NGO Selector & Score Gauge */}
                                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-6">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                            Select NGO to Inspect Risk:
                                        </label>
                                        <select
                                            value={riskInspectedNGOId}
                                            onChange={e => setRiskInspectedNGOId(e.target.value)}
                                            className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 bg-white"
                                        >
                                            {ngos.map(n => (
                                                <option key={n.id} value={n.id}>{n.name} ({n.id}) - Score: {n.score}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {inspectedNGO && (
                                        <div className="text-center p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                                            <span className="text-xs font-bold text-slate-400 uppercase">Overall Transparency Score</span>
                                            <div
                                                className="text-6xl font-bold font-mono tracking-tighter"
                                                style={{ color: inspectedNGO.score > 80 ? '#10b981' : inspectedNGO.score > 50 ? '#f59e0b' : '#ef4444' }}
                                            >
                                                {inspectedNGO.score}
                                                <span className="text-base text-slate-400 font-normal">/100</span>
                                            </div>
                                            <div className="pt-2">
                                                <Badge variant={inspectedNGO.riskLevel === 'Low Risk' ? 'success' : inspectedNGO.riskLevel === 'Medium Risk' ? 'warning' : 'danger'}>
                                                    {inspectedNGO.riskLevel}
                                                </Badge>
                                            </div>
                                            <p className="text-[11px] text-slate-500 pt-1 font-medium">{inspectedNGO.issue || 'Compliance metrics in normal operational bounds.'}</p>
                                        </div>
                                    )}

                                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                                        <span><strong>Prototype Notice:</strong> FINX automated risk assessment computes scores based on simulated database cross-references. Final verification requires human validator approval.</span>
                                    </div>
                                </div>

                                {/* Right: Weighted Risk Factors Breakdown */}
                                <div className="lg:col-span-2 p-6 bg-white border border-slate-200 rounded-2xl space-y-5">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                        <div>
                                            <h3 className="font-bold text-slate-900">{inspectedNGO?.name}</h3>
                                            <p className="text-xs text-slate-500">Risk Factors Breakdown & Weighting Model</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedNGO(inspectedNGO)}
                                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 bg-indigo-50 rounded-lg"
                                        >
                                            Open Full Audit Dossier
                                        </button>
                                    </div>

                                    {inspectedNGO && (
                                        <div className="space-y-4 text-xs">
                                            {[
                                                { label: 'Registration & MCA Compliance', score: inspectedNGO.riskFactors.registrationCompliance, weight: '25%', desc: 'CSR-1, Trust Deed / MoA valid & active' },
                                                { label: 'Document Completeness', score: inspectedNGO.riskFactors.documentCompleteness, weight: '20%', desc: `${inspectedNGO.documentsCount} uploaded with clear stamps` },
                                                { label: 'Financial Transparency', score: inspectedNGO.riskFactors.financialTransparency, weight: '20%', desc: 'Audited balance sheets, 12A/80G status' },
                                                { label: 'Operational History', score: inspectedNGO.riskFactors.operationalHistory, weight: '15%', desc: `${inspectedNGO.operationalHistoryYears} years active in ground operations` },
                                                { label: 'Previous CSR Performance', score: inspectedNGO.riskFactors.previousCsrPerformance, weight: '10%', desc: `${inspectedNGO.beneficiariesReach.toLocaleString()} documented rural beneficiaries` },
                                                { label: 'Geographic & Field Verification Risk', score: inspectedNGO.riskFactors.geographicRisk, weight: '10%', desc: `Region: ${inspectedNGO.location}` }
                                            ].map((factor, idx) => (
                                                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-slate-800">{factor.label} <span className="text-slate-400 font-normal">({factor.weight} weight)</span></span>
                                                        <span className="font-mono font-bold text-slate-900">{factor.score} / 100</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-500"
                                                            style={{
                                                                width: `${factor.score}%`,
                                                                backgroundColor: factor.score > 80 ? '#10b981' : factor.score > 50 ? '#f59e0b' : '#ef4444'
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="text-[11px] text-slate-500">{factor.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* =========================================================================
                        TAB 4: PROJECT PROPOSALS (Existing Logic Preserved & Enriched)
                       ========================================================================= */}
                    {activeTab === 'Project Proposals' && (
                        <div className="space-y-6">
                            {proposals.filter(p => p.status === 'Submitted').length === 0 ? (
                                <div className="text-center p-12 bg-slate-50 rounded-2xl text-slate-500 border border-slate-200">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                    <p className="font-bold text-slate-800">All Project Proposals Validated</p>
                                    <p className="text-xs text-slate-500 mt-1">No new proposals are currently awaiting validator sign-off.</p>
                                </div>
                            ) : (
                                proposals.filter(p => p.status === 'Submitted').map((p) => {
                                    // Cross-reference with central NGO data
                                    const matchingNGO = ngos.find(n => n.name.toLowerCase() === p.ngoName.toLowerCase());
                                    const isHighRisk = matchingNGO?.status === 'HIGH_RISK';

                                    return (
                                        <div key={p.id} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl relative space-y-6 shadow-2xs">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                                        {p.id}
                                                    </span>
                                                    <h3 className="text-lg font-bold text-slate-900 mt-1">{p.title}</h3>
                                                </div>
                                                <Badge variant="warning">Awaiting Validator Review</Badge>
                                            </div>

                                            {/* Submitting NGO Compliance Summary Bar */}
                                            <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                                                <div className="flex items-center gap-3">
                                                    <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                                                    <div>
                                                        <span className="font-bold text-slate-800">Submitting NGO: {p.ngoName}</span>
                                                        <span className="text-slate-400 ml-2">(Reg: {p.ngoRegNum})</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-slate-500">NGO Validation Status:</span>
                                                    {matchingNGO ? (
                                                        <Badge variant={getStatusBadgeVariant(matchingNGO.status)}>
                                                            {formatStatusLabel(matchingNGO.status)}
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="neutral">Under Initial Review</Badge>
                                                    )}
                                                    <span className="text-slate-500 ml-2">Risk Score:</span>
                                                    <strong className="font-mono text-slate-900">{matchingNGO?.score || 70}/100</strong>
                                                </div>
                                            </div>

                                            {/* High Risk Caution Alert */}
                                            {isHighRisk && (
                                                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center gap-2">
                                                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                                                    <span><strong>CAUTION:</strong> Submitting NGO is flagged as High Risk in the validation queue. Requires escalated physical and financial audit prior to corporate escrow commitment.</span>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Left: Citizen Petition Simulator */}
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">1. Originating Citizen Petition</h4>
                                                    <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-2xs space-y-2">
                                                        <p className="font-bold text-slate-900 text-sm">{p.title}</p>
                                                        <div className="text-xs text-slate-500 flex gap-4">
                                                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {p.location}</span>
                                                            <span>Beneficiaries: <strong className="text-slate-700 font-mono">{p.beneficiaries}</strong></span>
                                                        </div>
                                                        <p className="text-xs mt-2 text-slate-600 italic border-l-2 border-indigo-200 pl-3">
                                                            "{p.problem}"
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Right: NGO Proposal Details */}
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">2. Proposed Milestone Strategy</h4>
                                                    <div className="bg-white p-4 border border-indigo-100 rounded-xl shadow-2xs space-y-3">
                                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                                            <div>
                                                                <span className="text-slate-500 block">Requested Budget</span>
                                                                <span className="font-bold font-mono text-sm text-slate-900">₹{p.totalFunding.toLocaleString('en-IN')}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-500 block">Target Completion</span>
                                                                <span className="font-bold text-slate-900">{p.targetDate}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 pt-1">
                                                            <Badge variant="neutral">{p.milestones.length} Milestone Tranches</Badge>
                                                            <Badge variant="neutral">{p.category}</Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                                                <div className="text-xs text-slate-500">
                                                    Review all legal IDs & field reports before forwarding to CSR corporate matching.
                                                </div>
                                                <button
                                                    onClick={() => handleValidateProposal(p.id, p.ngoName, p.title)}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-md shadow-emerald-200 cursor-pointer shrink-0"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" /> {t('endorse_proposal', 'Verify & Forward to Corporate Funder')}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {/* =========================================================================
                        TAB 5: AUDIT LOGS
                       ========================================================================= */}
                    {activeTab === 'Audit Logs' && (
                        <div className="space-y-4">
                            {/* Filter Bar */}
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col md:flex-row gap-3 justify-between">
                                <div className="relative flex-1">
                                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search audit logs by NGO, reason, or reference ID..."
                                        value={auditSearch}
                                        onChange={e => setAuditSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        value={auditActionFilter}
                                        onChange={e => setAuditActionFilter(e.target.value)}
                                        className="p-2 border border-slate-200 rounded-lg bg-white text-xs font-semibold text-slate-700 outline-none"
                                    >
                                        <option value="All">All Actions</option>
                                        <option value="Verify NGO">Verify NGO</option>
                                        <option value="Flag High Risk">Flag High Risk</option>
                                        <option value="Document Review">Document Review</option>
                                        <option value="Request Documents">Request Documents</option>
                                        <option value="Approve Proposal">Approve Proposal</option>
                                        <option value="Reject Organization">Reject Organization</option>
                                    </select>
                                </div>
                            </div>

                            {/* Audit Logs Table */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                {filteredAuditLogs.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500 font-medium bg-slate-50 text-xs">
                                        No audit entries match the search criteria.
                                    </div>
                                ) : (
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                                            <tr>
                                                <th className="p-3.5">Timestamp</th>
                                                <th className="p-3.5">Actor</th>
                                                <th className="p-3.5">NGO</th>
                                                <th className="p-3.5">Action</th>
                                                <th className="p-3.5">Status Transition</th>
                                                <th className="p-3.5">Reason / Evidence</th>
                                                <th className="p-3.5">Reference ID</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredAuditLogs.map(log => (
                                                <tr key={log.id} className="hover:bg-slate-50 transition">
                                                    <td className="p-3.5 font-mono text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                                                    <td className="p-3.5 font-semibold text-slate-800 whitespace-nowrap">{log.actor}</td>
                                                    <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">{log.ngoName}</td>
                                                    <td className="p-3.5">
                                                        <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] whitespace-nowrap">
                                                            {log.action}
                                                        </span>
                                                    </td>
                                                    <td className="p-3.5 whitespace-nowrap">
                                                        <span className="text-slate-500">{log.previousStatus}</span>
                                                        <span className="text-slate-400 mx-1">→</span>
                                                        <strong className="text-slate-800">{log.newStatus}</strong>
                                                    </td>
                                                    <td className="p-3.5 text-slate-600 max-w-sm">{log.reason}</td>
                                                    <td className="p-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">{log.referenceId}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* =========================================================================
                NGO REVIEW / DETAILS MODAL
               ========================================================================= */}
            {selectedNGO && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant={getStatusBadgeVariant(selectedNGO.status)} className="text-xs">
                                        {formatStatusLabel(selectedNGO.status)}
                                    </Badge>
                                    <span className="text-xs font-mono text-slate-400">{selectedNGO.id}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">{selectedNGO.name}</h2>
                                <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 font-medium">
                                    <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {selectedNGO.registrationType}</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedNGO.location}</span>
                                    <span>Reg No: <strong className="font-mono text-slate-700">{selectedNGO.registrationNumber}</strong></span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedNGO(null)} className="text-slate-400 hover:text-slate-600 p-1">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content: 2-Column Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
                            {/* Left 2 Cols: Compliance & Documents */}
                            <div className="lg:col-span-2 space-y-5">
                                {/* Legal Credentials */}
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-3">Compliance & Statutory Registrations</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><span className="text-slate-500 block">PAN Number</span><span className="font-mono font-bold text-slate-900">{selectedNGO.pan}</span></div>
                                        <div><span className="text-slate-500 block">NGO Darpan ID</span><span className="font-mono font-bold text-slate-900">{selectedNGO.darpanId}</span></div>
                                        <div><span className="text-slate-500 block">CSR-1 Filing</span><Badge variant={selectedNGO.csr1 === 'Valid' ? 'success' : 'danger'}>{selectedNGO.csr1}</Badge></div>
                                        <div><span className="text-slate-500 block">12A Certificate</span><Badge variant={selectedNGO.sec12a === 'Valid' ? 'success' : selectedNGO.sec12a === 'Expired' ? 'danger' : 'warning'}>{selectedNGO.sec12a}</Badge></div>
                                        <div><span className="text-slate-500 block">80G Certificate</span><Badge variant={selectedNGO.sec80g === 'Valid' ? 'success' : selectedNGO.sec80g === 'Expired' ? 'danger' : 'warning'}>{selectedNGO.sec80g}</Badge></div>
                                        <div><span className="text-slate-500 block">Primary Sector</span><span className="font-semibold text-slate-900">{selectedNGO.primaryFocusArea}</span></div>
                                    </div>
                                </div>

                                {/* Uploaded Documents Checklist */}
                                <div>
                                    <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">Verified Documents ({selectedNGO.documentsCount})</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {selectedNGO.documents.map((doc, i) => (
                                            <div
                                                key={i}
                                                onClick={() => setPreviewDoc(doc.name)}
                                                className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between hover:border-indigo-300 hover:bg-indigo-50/20 cursor-pointer transition"
                                            >
                                                <div className="flex items-center gap-2 truncate">
                                                    <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                                                    <span className="font-medium text-slate-700 truncate">{doc.name}</span>
                                                </div>
                                                <Badge variant={doc.status === 'Valid' ? 'success' : doc.status === 'Expired' ? 'danger' : 'warning'} className="text-[9px] shrink-0">
                                                    {doc.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Col: Risk Score & Action Buttons */}
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase">Trust & Risk Score</span>
                                    <div
                                        className="text-5xl font-bold font-mono tracking-tighter"
                                        style={{ color: selectedNGO.score > 80 ? '#10b981' : selectedNGO.score > 50 ? '#f59e0b' : '#ef4444' }}
                                    >
                                        {selectedNGO.score}
                                    </div>
                                    <Badge variant={selectedNGO.riskLevel === 'Low Risk' ? 'success' : selectedNGO.riskLevel === 'Medium Risk' ? 'warning' : 'danger'}>
                                        {selectedNGO.riskLevel}
                                    </Badge>
                                    <p className="text-[11px] text-slate-500 pt-1">{selectedNGO.issue || 'All compliance checks satisfied.'}</p>
                                </div>

                                {/* Validation Actions */}
                                <div className="space-y-2 pt-2">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Validator Decisions</span>

                                    <button
                                        onClick={() => {
                                            handleUpdateNGOStatus(selectedNGO.id, 'VERIFIED', 'Verify NGO', 'All statutory documents, 12A/80G, and bank mandates confirmed valid.');
                                        }}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> {t('status_verified', 'Verify NGO')}
                                    </button>

                                    <button
                                        onClick={() => {
                                            handleUpdateNGOStatus(selectedNGO.id, 'DOCUMENTS_MISSING', 'Request Documents', 'Requested updated FY25 audited balance sheet and signed board resolution.');
                                        }}
                                        className="w-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" /> {t('tab_compliance_docs', 'Request Documents')}
                                    </button>

                                    <button
                                        onClick={() => {
                                            handleUpdateNGOStatus(selectedNGO.id, 'NEEDS_REVIEW', 'Mark Needs Review', 'Flagged for supervisor review regarding statutory renewals.');
                                        }}
                                        className="w-full bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                                    >
                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> {t('status_needs_review', 'Mark Needs Review')}
                                    </button>

                                    <button
                                        onClick={() => {
                                            handleUpdateNGOStatus(selectedNGO.id, 'HIGH_RISK', 'Flag High Risk', 'Flagged high risk due to non-compliance with statutory tax filings.');
                                        }}
                                        className="w-full bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                                    >
                                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> {t('status_high_risk', 'Flag High Risk')}
                                    </button>

                                    <button
                                        onClick={() => {
                                            handleUpdateNGOStatus(selectedNGO.id, 'REJECTED', 'Reject Organization', 'Application rejected due to fraudulent registration or lack of compliance.');
                                        }}
                                        className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                                    >
                                        <AlertCircle className="w-3.5 h-3.5" /> {t('btn_reject', 'Reject NGO')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Document Preview Modal */}
            {previewDoc && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-600" /> Document Preview
                            </h4>
                            <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                        </div>
                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                            <FileText className="w-10 h-10 text-indigo-500 mx-auto" />
                            <p className="font-bold text-slate-800">{previewDoc}</p>
                            <p className="text-slate-400 text-[11px]">Digital stamp & MCA certificate cryptographic hash verified.</p>
                            <Badge variant="success" className="text-[10px]">Hash: 0x8f2a...91b4</Badge>
                        </div>
                        <button
                            onClick={() => setPreviewDoc(null)}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl transition"
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
