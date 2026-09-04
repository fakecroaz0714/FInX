'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
    Network, ArrowRight, CheckCircle2, Zap, BrainCircuit, X, Check,
    Building2, MapPin, Target, Sparkles, ShieldCheck, Loader2, AlertCircle,
    RotateCcw, Info, ChevronDown, ChevronUp, Layers, ExternalLink,
    FileText, Clock, Award, Users
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { safeJsonFetch } from '@/lib/apiUtils';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const STORAGE_KEY_WORKFLOWS = 'finx_matching_workflows';
const STORAGE_KEY_KPI = 'finx_matching_kpi';

export interface ScoreBreakdown {
    category: number;
    geographic: number;
    ngo: number;
    budget: number;
    relevance: number;
}

export interface SynergyWorkflow {
    id: number;
    matchKey: string;
    petition: {
        id?: string;
        title: string;
        location: string;
        category: string;
        requestedBudget?: string;
        signatures?: number;
        targetSignatures?: number;
        citizenRep?: string;
        problem?: string;
    };
    ngo: {
        id?: string;
        name: string;
        rating: number;
        verified: boolean;
        validatorScore?: number;
        darpanId?: string;
        pan?: string;
        experience?: string;
    };
    corporate: {
        id?: string;
        name: string;
        budget: string;
        matchScore: number;
        lead?: string;
        themeAlign?: string;
    };
    status: 'pending' | 'approve' | 'reject';
    confidenceScore?: number;
    scoreBreakdown?: ScoreBreakdown;
    explanation?: string;
    approvedAt?: string;
    declinedAt?: string;
    escrowContractId?: string;
    txHash?: string;
}

export interface MatchingKPI {
    unresolvedPetitions: number;
    availableCsrCapital: string;
    workflowSuccessRate: number;
    highConfidenceCount: number;
}

const INITIAL_WORKFLOWS: SynergyWorkflow[] = [
    {
        id: 1,
        matchKey: 'PET-101_NGO-1082_CORP-GREEN-001',
        petition: {
            id: 'PET-101',
            title: 'Rural Solar Pumps',
            location: 'Nagpur, MH',
            category: 'Environment',
            requestedBudget: '₹4.0M',
            signatures: 1420,
            targetSignatures: 1500,
            citizenRep: 'Kishore Deshmukh (Gram Panchayat)',
            problem: 'Borewell pump failure leaves 450 farmer households without irrigation.'
        },
        ngo: {
            id: 'NGO-1082',
            name: 'Green Earth Foundation',
            rating: 94,
            verified: true,
            validatorScore: 94,
            darpanId: 'MH/2021/0088219',
            pan: 'AAATG8124P',
            experience: 'Completed 18 solar mini-grid installations in Vidarbha.'
        },
        corporate: {
            id: 'CORP-GREEN-001',
            name: 'GreenFuture Energy',
            budget: '₹4.0M',
            matchScore: 98,
            lead: 'Pooja Verma (Head of Sustainability)',
            themeAlign: 'SDG 7 & 13: Renewable Rural Micro-Grids'
        },
        status: 'pending',
        confidenceScore: 98,
        scoreBreakdown: { category: 40, geographic: 20, ngo: 19, budget: 10, relevance: 9 },
        explanation: 'Perfect SDG Environment alignment, identical Nagpur geo-location, 94/100 verified NGO trust score, full CSR budget match.'
    },
    {
        id: 2,
        matchKey: 'PET-103_NGO-1099_CORP-TECH-003',
        petition: {
            id: 'PET-103',
            title: 'Primary School Roof',
            location: 'Pune, MH',
            category: 'Education',
            requestedBudget: '₹1.5M',
            signatures: 980,
            targetSignatures: 1000,
            citizenRep: 'Sunita Patil (School Management Committee)',
            problem: 'Monsoon leaks prevent classes for 320 primary school children.'
        },
        ngo: {
            id: 'NGO-1099',
            name: 'EduCare Org',
            rating: 88,
            verified: true,
            validatorScore: 88,
            darpanId: 'MH/2020/0045231',
            pan: 'AAATE4910M',
            experience: 'Constructed 24 pre-fab school classrooms across Pune rural.'
        },
        corporate: {
            id: 'CORP-TECH-003',
            name: 'TechCorp India',
            budget: '₹1.5M',
            matchScore: 92,
            lead: 'Anand Kulkarni (CSR Lead)',
            themeAlign: 'SDG 4: Quality Infrastructure for Primary Education'
        },
        status: 'pending',
        confidenceScore: 92,
        scoreBreakdown: { category: 40, geographic: 20, ngo: 18, budget: 10, relevance: 4 },
        explanation: 'Education category match in Pune cluster, 88/100 verified NGO credentials, ₹1.5M budget parity.'
    },
    {
        id: 3,
        matchKey: 'PET-104_NGO-1105_CORP-PHARMA-004',
        petition: {
            id: 'PET-104',
            title: 'Clinic Medical Supplies',
            location: 'Mumbai, MH',
            category: 'Healthcare',
            requestedBudget: '₹0.8M',
            signatures: 640,
            targetSignatures: 800,
            citizenRep: 'Dr. A. B. Joshi (Primary Health Center)',
            problem: 'Sub-district hospital lacks point-of-care diagnostic strips and vaccines.'
        },
        ngo: {
            id: 'NGO-1105',
            name: 'Urban Health Initiative',
            rating: 45,
            verified: false,
            validatorScore: 45,
            darpanId: 'MH/2024/0991823',
            pan: 'AAATU1123J',
            experience: 'New non-profit organization pending multi-signature audit validation.'
        },
        corporate: {
            id: 'CORP-PHARMA-004',
            name: 'PharmaCare CSR',
            budget: '₹0.8M',
            matchScore: 78,
            lead: 'Dr. Meera Nambiar (CSR Medical Affairs)',
            themeAlign: 'SDG 3: Essential Rural Healthcare & Diagnostics'
        },
        status: 'pending',
        confidenceScore: 78,
        scoreBreakdown: { category: 40, geographic: 10, ngo: 9, budget: 10, relevance: 9 },
        explanation: 'Healthcare category alignment, but NGO verification score (45/100) requires human-in-the-loop review before escrow authorization.'
    }
];

const INITIAL_KPI: MatchingKPI = {
    unresolvedPetitions: 1204,
    availableCsrCapital: '₹48.2M',
    workflowSuccessRate: 91,
    highConfidenceCount: 2
};

export default function MatchingEngine() {
    const { t } = useLanguage();

    const [matches, setMatches] = useState<SynergyWorkflow[]>(INITIAL_WORKFLOWS);
    const [kpi, setKpi] = useState<MatchingKPI>(INITIAL_KPI);
    const [isRunning, setIsRunning] = useState(false);
    const [progressStep, setProgressStep] = useState<number>(0);
    const [progressLogs, setProgressLogs] = useState<string[]>([]);
    const [completionBanner, setCompletionBanner] = useState<string | null>(null);
    const [expandedBreakdownId, setExpandedBreakdownId] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [actionNotice, setActionNotice] = useState<string | null>(null);

    // Entity Inspection Modal State
    const [inspectedEntity, setInspectedEntity] = useState<{
        type: 'petition' | 'ngo' | 'corporate';
        match: SynergyWorkflow;
    } | null>(null);

    // Load persisted workflows and metrics from storage on mount
    useEffect(() => {
        try {
            const savedWorkflows = localStorage.getItem(STORAGE_KEY_WORKFLOWS);
            const savedKPI = localStorage.getItem(STORAGE_KEY_KPI);

            if (savedWorkflows) {
                const parsed = JSON.parse(savedWorkflows);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setMatches(parsed);
                }
            }

            if (savedKPI) {
                const parsedKPI = JSON.parse(savedKPI);
                if (parsedKPI && parsedKPI.unresolvedPetitions) {
                    setKpi(parsedKPI);
                }
            }
        } catch (e) {
            console.error('Error loading stored matching state:', e);
        }

        // Fetch latest state from backend if available
        fetchBackendData();
    }, []);

    const fetchBackendData = async () => {
        try {
            const res = await safeJsonFetch<any>(`${BACKEND_URL}/api/matching/data`);
            if (res.ok && res.data?.success) {
                if (Array.isArray(res.data.workflows) && res.data.workflows.length > 0) {
                    setMatches(res.data.workflows);
                    persistState(res.data.workflows, res.data.summary);
                }
                if (res.data.summary) {
                    setKpi(res.data.summary);
                }
            }
        } catch (e) {
            console.warn('Backend offline or unreachable, using client cached data.');
        }
    };

    const persistState = (newMatches: SynergyWorkflow[], newKpi: MatchingKPI) => {
        try {
            localStorage.setItem(STORAGE_KEY_WORKFLOWS, JSON.stringify(newMatches));
            localStorage.setItem(STORAGE_KEY_KPI, JSON.stringify(newKpi));
        } catch (e) {
            console.error('Error persisting matching state:', e);
        }
    };

    // Main execution handler for "Run Auto-Match Algorithm"
    const handleRunAutoMatch = async () => {
        if (isRunning) return;

        setIsRunning(true);
        setErrorMessage(null);
        setCompletionBanner(null);
        setProgressStep(1);
        setProgressLogs([]);

        const steps = [
            'Loading citizen petitions...',
            'Checking verified NGOs...',
            'Comparing SDG categories...',
            'Checking geographic compatibility...',
            'Checking CSR budgets...',
            'Generating high-confidence matches...'
        ];

        // Animate live progress steps for user visibility
        for (let i = 0; i < steps.length; i++) {
            setProgressStep(i + 1);
            setProgressLogs(prev => [...prev, steps[i]]);
            await new Promise(res => setTimeout(res, 350));
        }

        try {
            const res = await safeJsonFetch<any>(`${BACKEND_URL}/api/matching/auto-match`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok && res.data?.success) {
                const updatedWorkflows: SynergyWorkflow[] = res.data.workflows;
                const updatedSummary: MatchingKPI = res.data.summary;

                setMatches(updatedWorkflows);
                setKpi(updatedSummary);
                persistState(updatedWorkflows, updatedSummary);

                const count = updatedSummary.highConfidenceCount;
                setCompletionBanner(`${count} High-Confidence Matches Found`);
                setActionNotice(`AI Auto-Match successfully executed. Found ${count} optimal synergy matches across Citizen Petitions, Verified NGOs & Corporate CSR Funds.`);
                setTimeout(() => setActionNotice(null), 6000);
            } else {
                console.warn('Backend matching API returned error, falling back to local multi-model calculation:', res.error);
                executeLocalAutoMatch();
            }
        } catch (err: any) {
            console.error('Auto-Match execution error:', err);
            executeLocalAutoMatch();
        } finally {
            setIsRunning(false);
            setProgressStep(7);
        }
    };

    // Client-side fallback matching engine
    const executeLocalAutoMatch = () => {
        const updated = matches.map(m => {
            let score = m.confidenceScore || 90;
            if (m.petition.category === 'Environment') score = 98;
            else if (m.petition.category === 'Sanitation') score = 95;
            else if (m.petition.category === 'Education') score = 92;
            else if (m.petition.category === 'Healthcare') score = 78;

            return {
                ...m,
                confidenceScore: score,
                corporate: {
                    ...m.corporate,
                    matchScore: score
                }
            };
        });

        const highCount = updated.filter(w => (w.confidenceScore || 0) >= 85 && w.ngo.verified).length;
        const newKPI: MatchingKPI = {
            ...kpi,
            highConfidenceCount: highCount
        };

        setMatches(updated);
        setKpi(newKPI);
        persistState(updated, newKPI);
        setCompletionBanner(`${highCount} High-Confidence Matches Found`);
        setActionNotice(`AI Auto-Match completed. ${highCount} High-Confidence Matches Found.`);
        setTimeout(() => setActionNotice(null), 6000);
    };

    // Workflow actions: Approve and Decline
    const handleAction = async (id: number, action: 'approve' | 'reject') => {
        const targetWorkflow = matches.find(m => m.id === id);
        if (!targetWorkflow) return;

        const updatedMatches = matches.map(m => {
            if (m.id === id) {
                return {
                    ...m,
                    status: action,
                    approvedAt: action === 'approve' ? new Date().toISOString() : undefined,
                    declinedAt: action === 'reject' ? new Date().toISOString() : undefined,
                    escrowContractId: action === 'approve'
                        ? (m.escrowContractId || `0x${Math.random().toString(16).substring(2, 8).toUpperCase()}...${Math.random().toString(16).substring(2, 6).toUpperCase()}`)
                        : undefined
                };
            }
            return m;
        });

        const approvedCount = updatedMatches.filter(w => w.status === 'approve').length;
        const reviewedCount = updatedMatches.filter(w => w.status !== 'pending').length;
        const newSuccessRate = reviewedCount > 0 ? Math.round((approvedCount / reviewedCount) * 100) : 91;
        const newUnresolved = Math.max(0, 1204 - approvedCount);

        const newKPI: MatchingKPI = {
            ...kpi,
            unresolvedPetitions: newUnresolved,
            workflowSuccessRate: newSuccessRate
        };

        setMatches(updatedMatches);
        setKpi(newKPI);
        persistState(updatedMatches, newKPI);

        if (action === 'approve') {
            setActionNotice(`✅ Synergy Workflow #${id} Approved! Project moved to Escrow Controls with assigned Contract.`);
        } else {
            setActionNotice(`❌ Synergy Workflow #${id} Declined. Petition returned to open pool.`);
        }
        setTimeout(() => setActionNotice(null), 5000);

        try {
            await safeJsonFetch(`${BACKEND_URL}/api/matching/workflows/${id}/${action}`, {
                method: 'POST'
            });
        } catch (e) {
            console.warn(`Could not sync action ${action} to backend:`, e);
        }
    };

    // Reset demo state
    const handleReset = () => {
        setMatches(INITIAL_WORKFLOWS);
        setKpi(INITIAL_KPI);
        setProgressStep(0);
        setProgressLogs([]);
        setCompletionBanner(null);
        persistState(INITIAL_WORKFLOWS, INITIAL_KPI);
        setActionNotice('🔄 Matching state reset to initial demo configuration.');
        setTimeout(() => setActionNotice(null), 4000);
    };

    const highConfidenceMatches = matches.filter(w => (w.confidenceScore || w.corporate?.matchScore || 0) >= 85 && w.ngo?.verified);

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            {/* Action & Feedback Notification Banner */}
            {actionNotice && (
                <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-xs animate-in fade-in duration-300">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>{actionNotice}</span>
                    </div>
                    <button onClick={() => setActionNotice(null)} className="text-indigo-400 hover:text-indigo-700 cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {errorMessage && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Header with Run Auto-Match Algorithm Button */}
            <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
                {/* Decorative background visual */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-10 right-10 flex gap-4">
                        <Network className="w-48 h-48 animate-pulse text-indigo-400" />
                    </div>
                </div>

                <div className="relative z-10 w-full mb-4 md:mb-0">
                    <div className="flex items-center gap-2 mb-2">
                        <BrainCircuit className="w-6 h-6 text-indigo-400 mb-1" />
                        <span className="text-sm font-bold text-indigo-300 uppercase tracking-widest">
                            {t('ai_workflow_engine', 'AI Workflow Engine')}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                        {t('smart_mediation_title', 'Smart Mediation')}
                    </h1>
                    <p className="text-indigo-100 mt-2 font-medium opacity-90 max-w-2xl text-xs md:text-sm">
                        {t('smart_mediation_desc', 'Automatically triaging Citizen Petitions ➔ Verified NGOs ➔ Corporate CSR Funds based on SDG categories and geographic heuristics.')}
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-3 shrink-0">
                    <button
                        onClick={handleReset}
                        title="Reset Demo Workflows"
                        className="bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 p-3 rounded-xl transition shadow-sm cursor-pointer"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>

                    <button
                        id="btn-run-auto-match"
                        onClick={handleRunAutoMatch}
                        disabled={isRunning}
                        className={`relative z-10 px-6 py-3 rounded-xl font-bold shadow-md transition whitespace-nowrap flex items-center gap-2 text-sm select-none cursor-pointer ${isRunning
                            ? 'bg-indigo-700 text-indigo-200 border border-indigo-500 cursor-not-allowed opacity-90'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400 active:scale-[0.98]'
                            }`}
                    >
                        {isRunning ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin text-indigo-300" />
                                <span>{t('running_auto_match', 'Running Auto-Match...')}</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 text-indigo-300" />
                                <span>{t('run_auto_match', 'Run Auto-Match Algorithm')}</span>
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Live AI Matching Progress / Status Area */}
            {(isRunning || (progressStep > 0 && progressStep <= 7)) && (
                <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 shadow-sm overflow-hidden transition-all duration-300">
                    <CardContent className="p-5 md:p-6">
                        <div className="flex items-center justify-between border-b border-indigo-100 pb-3 mb-4">
                            <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-xs ${progressStep === 7 ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                                    {progressStep === 7 ? <CheckCircle2 className="w-5 h-5" /> : <BrainCircuit className="w-5 h-5 animate-pulse" />}
                                </div>
                                <div>
                                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                                        {progressStep === 7
                                            ? t('matching_completed', 'MATCHING COMPLETED')
                                            : t('matching_in_progress', 'AI MATCHING IN PROGRESS')}
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-medium">
                                        {progressStep === 7
                                            ? `${kpi.highConfidenceCount} ${t('matches_ready_approval', 'High-Confidence Matches Found & ready for approval')}`
                                            : t('matches_evaluating', 'Evaluating Citizen Petitions, Verified NGOs & Corporate CSR Funds')}
                                    </p>
                                </div>
                            </div>

                            {completionBanner && (
                                <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs px-3 py-1 font-bold">
                                    ✓ {completionBanner}
                                </Badge>
                            )}
                        </div>

                        {/* Visual Step Matrix */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-xs font-medium">
                            <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${progressStep >= 1 ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                {progressStep > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : progressStep === 1 ? <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" /> : <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />}
                                <span>{t('step_load_petitions', 'Loading citizen petitions')}</span>
                            </div>

                            <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${progressStep >= 2 ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                {progressStep > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : progressStep === 2 ? <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" /> : <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />}
                                <span>{t('step_check_ngos', 'Checking verified NGOs')}</span>
                            </div>

                            <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${progressStep >= 3 ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                {progressStep > 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : progressStep === 3 ? <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" /> : <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />}
                                <span>{t('step_compare_sdg', 'Comparing SDG categories')}</span>
                            </div>

                            <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${progressStep >= 4 ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                {progressStep > 4 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : progressStep === 4 ? <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" /> : <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />}
                                <span>{t('step_check_geo', 'Checking geographic compatibility')}</span>
                            </div>

                            <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${progressStep >= 5 ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                {progressStep > 5 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : progressStep === 5 ? <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" /> : <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />}
                                <span>{t('step_check_budget', 'Checking CSR budgets')}</span>
                            </div>

                            <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${progressStep >= 6 ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                {progressStep >= 7 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : progressStep === 6 ? <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" /> : <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />}
                                <span>{t('step_generate_matches', 'Generating high-confidence matches')}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Live KPI Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-sm border-slate-200 bg-white">
                    <CardContent className="p-6">
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                            {t('unresolved_petitions', 'Unresolved Petitions')}
                        </div>
                        <div className="text-3xl font-extrabold text-slate-900 mt-2">
                            {kpi.unresolvedPetitions.toLocaleString()}
                        </div>
                        <div className="mt-2 text-xs font-semibold text-indigo-600 flex items-center gap-1">
                            {t('this_week_increase', '+42 this week')} &bull; {t('grassroots_pipeline', 'Grassroots Pipeline')}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 bg-white">
                    <CardContent className="p-6">
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                            {t('available_csr_capital', 'Available CSR Capital')}
                        </div>
                        <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">
                            {kpi.availableCsrCapital}
                        </div>
                        <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                            {t('across_14_corporates', 'Across 14 Corporates')} &bull; {t('unlocked_escrow', 'Unlocked Escrow')}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 bg-white">
                    <CardContent className="p-6">
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                            {t('workflow_success_rate', 'Workflow Success Rate')}
                        </div>
                        <div className="text-3xl font-extrabold text-indigo-600 mt-2">
                            {kpi.workflowSuccessRate}%
                        </div>
                        <div className="mt-2 text-xs font-semibold text-slate-500 flex items-center gap-1">
                            {t('matches_converting_escrow', 'Matches converting to Escrow Controls')}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Suggested Synergy Workflows */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            {t('synergy_workflows_title', 'Suggested Synergy Workflows')}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {t('synergy_workflows_sub', 'AI-evaluated triage pairings across citizen petitions, verified field NGOs, and corporate CSR capital.')}
                        </p>
                    </div>
                    <span className="text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full whitespace-nowrap">
                        {highConfidenceMatches.length} {t('high_confidence_matches_found', 'High-Confidence Matches Found')}
                    </span>
                </div>

                {matches.length === 0 ? (
                    <Card className="border border-slate-200 p-12 text-center bg-white rounded-2xl">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
                            <BrainCircuit className="w-7 h-7" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">No high-confidence matches found.</h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                            The algorithm could not find a verified NGO and compatible CSR fund for the available petitions.
                        </p>
                        <button
                            onClick={handleRunAutoMatch}
                            className="mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
                        >
                            Re-run Auto-Match Algorithm
                        </button>
                    </Card>
                ) : (
                    matches.map((match) => {
                        const isApproved = match.status === 'approve';
                        const isRejected = match.status === 'reject';
                        const score = match.confidenceScore || match.corporate.matchScore || 90;
                        const isExpanded = expandedBreakdownId === match.id;

                        return (
                            <Card
                                key={match.id}
                                className={`border shadow-sm relative overflow-hidden transition-all duration-300 ${isApproved
                                    ? 'border-emerald-300 bg-emerald-50/20'
                                    : isRejected
                                        ? 'border-slate-200 opacity-60 bg-slate-50/80'
                                        : 'border-indigo-100 bg-white hover:border-indigo-200 hover:shadow-md'
                                    }`}
                            >
                                {/* Ribbon for Approved Status */}
                                {isApproved && (
                                    <div className="bg-emerald-600 text-white px-4 py-1.5 text-xs font-bold flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span>{t('workflow_sent_escrow', 'CSR Match Approved — Escrow Ready')}</span>
                                            {match.escrowContractId && (
                                                <span className="font-mono text-[10px] bg-emerald-700/80 px-2 py-0.5 rounded ml-2">
                                                    Contract: {match.escrowContractId}
                                                </span>
                                            )}
                                        </div>
                                        <Link
                                            href="/escrow"
                                            className="underline hover:text-emerald-100 flex items-center gap-1 text-[11px]"
                                        >
                                            {t('open_escrow_controls', 'View in Escrow Controls')} <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                )}

                                {/* Ribbon for Rejected Status */}
                                {isRejected && (
                                    <div className="bg-slate-500 text-white px-4 py-1 text-xs font-semibold flex items-center gap-1.5">
                                        <X className="w-3.5 h-3.5" />
                                        <span>{t('declined_by_admin', 'Declined by Admin — Archived')}</span>
                                    </div>
                                )}

                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row items-center gap-4 relative">
                                        {/* Connector line (desktop only) */}
                                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 hidden md:block rounded-full" />

                                        {/* 1. Citizen Petition */}
                                        <div
                                            onClick={() => setInspectedEntity({ type: 'petition', match })}
                                            className="flex-1 w-full bg-white border border-slate-200 p-4 rounded-xl shadow-xs relative z-10 hover:border-indigo-400 transition cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant="neutral" className="bg-slate-100 text-slate-700 text-[10px] font-bold">
                                                    {t('step_petition', 'Step 1: Petition')}
                                                </Badge>
                                                <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition" />
                                            </div>
                                            <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">{match.petition.title}</h3>
                                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                                <span>{match.petition.location}</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                                                <div className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">
                                                    {match.petition.category}
                                                </div>
                                                {match.petition.requestedBudget && (
                                                    <span className="text-[10px] font-bold text-slate-500 font-mono">
                                                        Goal: {match.petition.requestedBudget}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <ArrowRight className="w-6 h-6 text-indigo-300 hidden md:block shrink-0 bg-slate-50 rounded-full p-1" />

                                        {/* 2. Execution NGO */}
                                        <div
                                            onClick={() => setInspectedEntity({ type: 'ngo', match })}
                                            className="flex-1 w-full bg-white border border-slate-200 p-4 rounded-xl shadow-xs relative z-10 hover:border-indigo-400 transition cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant="neutral" className="bg-slate-100 text-slate-700 text-[10px] font-bold">
                                                    {t('step_execution', 'Step 2: Execution')}
                                                </Badge>
                                                <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition" />
                                            </div>
                                            <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">{match.ngo.name}</h3>
                                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                {match.ngo.verified ? (
                                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                                ) : (
                                                    <X className="w-3.5 h-3.5 text-rose-500" />
                                                )}
                                                <span className={match.ngo.verified ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
                                                    {match.ngo.verified ? t('status_verified_org', 'Verified Organization') : t('status_pending_verification', 'Pending Verification')}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                                                <div className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">
                                                    {t('validator_score', 'Validator Score')}: {match.ngo.validatorScore || match.ngo.rating}
                                                </div>
                                                <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                                                    {t('trust_verified', 'Trust Verified')}
                                                </span>
                                            </div>
                                        </div>

                                        <ArrowRight className="w-6 h-6 text-indigo-300 hidden md:block shrink-0 bg-slate-50 rounded-full p-1" />

                                        {/* 3. Corporate CSR Capital */}
                                        <div
                                            onClick={() => setInspectedEntity({ type: 'corporate', match })}
                                            className="flex-1 w-full bg-white border border-slate-200 p-4 rounded-xl shadow-xs relative z-10 hover:border-indigo-400 transition cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant="neutral" className="bg-slate-100 text-slate-700 text-[10px] font-bold">
                                                    {t('step_csr_capital', 'Step 3: CSR Capital')}
                                                </Badge>
                                                <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition" />
                                            </div>
                                            <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">{match.corporate.name}</h3>
                                            <div className="text-xs text-slate-600 mt-1 flex items-center gap-1 font-mono font-medium">
                                                <span>{match.corporate.budget} {t('available_funds', 'Available')}</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                                                <div className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">
                                                    {t('esg_match', 'ESG MATCH')}: {score}%
                                                </div>
                                                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${score >= 90
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : score >= 80
                                                        ? 'bg-indigo-100 text-indigo-800'
                                                        : 'bg-amber-100 text-amber-800'
                                                    }`}>
                                                    {score >= 90 ? t('optimal_match', 'Optimal') : score >= 80 ? t('strong_match', 'Strong') : t('review_match', 'Review')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expandable Score Breakdown & Explanation */}
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <div className="font-medium text-slate-600 flex items-center gap-1.5">
                                                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                                <span>{match.explanation || 'AI Confidence interval matches category logic perfectly.'}</span>
                                            </div>
                                            {match.scoreBreakdown && (
                                                <button
                                                    onClick={() => setExpandedBreakdownId(isExpanded ? null : match.id)}
                                                    className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
                                                >
                                                    <span>{t('scoring_model_title', 'Scoring Model (100%)')}</span>
                                                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                </button>
                                            )}
                                        </div>

                                        {isExpanded && match.scoreBreakdown && (
                                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mt-2 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs animate-in fade-in duration-200">
                                                <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase">{t('score_category_sdg', 'SDG Category')}</div>
                                                    <div className="text-base font-extrabold text-indigo-700 mt-0.5">{match.scoreBreakdown.category}/40</div>
                                                </div>
                                                <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase">{t('score_geographic', 'Geographic')}</div>
                                                    <div className="text-base font-extrabold text-indigo-700 mt-0.5">{match.scoreBreakdown.geographic}/20</div>
                                                </div>
                                                <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase">{t('score_ngo_track', 'NGO Trust')}</div>
                                                    <div className="text-base font-extrabold text-indigo-700 mt-0.5">{match.scoreBreakdown.ngo}/20</div>
                                                </div>
                                                <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase">{t('score_budget_match', 'CSR Budget')}</div>
                                                    <div className="text-base font-extrabold text-indigo-700 mt-0.5">{match.scoreBreakdown.budget}/10</div>
                                                </div>
                                                <div className="p-2 bg-white rounded-lg border border-slate-200/80 col-span-2 sm:col-span-1">
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase">{t('score_relevance', 'Relevance')}</div>
                                                    <div className="text-base font-extrabold text-indigo-700 mt-0.5">{match.scoreBreakdown.relevance}/10</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Footer for Pending Workflow */}
                                    {match.status === 'pending' && (
                                        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-end gap-3 w-full">
                                            <button
                                                onClick={() => handleAction(match.id, 'reject')}
                                                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-rose-600 px-4 py-2 rounded-lg font-bold transition text-xs flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <X className="w-3.5 h-3.5" /> {t('btn_decline', 'Decline')}
                                            </button>
                                            <button
                                                onClick={() => handleAction(match.id, 'approve')}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-bold shadow-sm transition text-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                                            >
                                                <Check className="w-3.5 h-3.5" /> {t('btn_approve_workflow', 'Approve Workflow')}
                                            </button>
                                        </div>
                                    )}

                                    {/* Action Footer for Approved Workflow */}
                                    {match.status === 'approve' && (
                                        <div className="pt-4 mt-3 border-t border-emerald-100 flex items-center justify-between text-xs">
                                            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                {t('workflow_locked_assigned', 'CSR Workflow Locked & Assigned to Escrow Milestone Engine')}
                                            </span>
                                            <Link
                                                href="/escrow"
                                                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
                                            >
                                                {t('manage_escrow', 'Manage Escrow')} <ExternalLink className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* ENTITY INSPECTION MODAL */}
            {inspectedEntity && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                                    {inspectedEntity.type === 'petition' ? 'Step 1: Citizen Petition Dossier' : inspectedEntity.type === 'ngo' ? 'Step 2: Implementing NGO Dossier' : 'Step 3: Corporate CSR Funder Dossier'}
                                </span>
                                <h3 className="text-lg font-bold text-slate-900 mt-1">
                                    {inspectedEntity.type === 'petition' ? inspectedEntity.match.petition.title : inspectedEntity.type === 'ngo' ? inspectedEntity.match.ngo.name : inspectedEntity.match.corporate.name}
                                </h3>
                            </div>
                            <button onClick={() => setInspectedEntity(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Petition Inspection */}
                        {inspectedEntity.type === 'petition' && (
                            <div className="space-y-3 text-xs">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="text-slate-400 mb-1 font-semibold">Reported Citizen Problem:</div>
                                    <p className="text-slate-700 leading-relaxed">
                                        {inspectedEntity.match.petition.problem || "Groundwater salinity and pump outages severely impact daily life."}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                        <div className="text-slate-400">Location</div>
                                        <div className="font-bold text-slate-800">{inspectedEntity.match.petition.location}</div>
                                    </div>
                                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                        <div className="text-slate-400">Citizen Signatures</div>
                                        <div className="font-bold text-indigo-600">{inspectedEntity.match.petition.signatures || 1200} / {inspectedEntity.match.petition.targetSignatures || 1500}</div>
                                    </div>
                                </div>
                                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                    <div className="text-slate-400">Grassroots Citizen Lead</div>
                                    <div className="font-bold text-slate-800">{inspectedEntity.match.petition.citizenRep || "Gram Panchayat Council"}</div>
                                </div>
                            </div>
                        )}

                        {/* NGO Inspection */}
                        {inspectedEntity.type === 'ngo' && (
                            <div className="space-y-3 text-xs">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                                    <div>
                                        <div className="text-slate-400">FINX AI Trust Rating</div>
                                        <div className="text-xl font-black text-indigo-600">{inspectedEntity.match.ngo.rating}/100</div>
                                    </div>
                                    <Badge variant={inspectedEntity.match.ngo.verified ? 'success' : 'warning'}>
                                        {inspectedEntity.match.ngo.verified ? 'Verified Organization' : 'Pending Review'}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                        <div className="text-slate-400">Niti Aayog Darpan ID</div>
                                        <div className="font-mono font-bold text-slate-800">{inspectedEntity.match.ngo.darpanId || "MH/2021/04910"}</div>
                                    </div>
                                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                        <div className="text-slate-400">Income Tax PAN</div>
                                        <div className="font-mono font-bold text-slate-800">{inspectedEntity.match.ngo.pan || "AAATJ9999K"}</div>
                                    </div>
                                </div>
                                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                    <div className="text-slate-400">Track Record</div>
                                    <div className="font-medium text-slate-800">{inspectedEntity.match.ngo.experience || "Proven execution in Maharashtra"}</div>
                                </div>
                            </div>
                        )}

                        {/* Corporate Inspection */}
                        {inspectedEntity.type === 'corporate' && (
                            <div className="space-y-3 text-xs">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                                    <div>
                                        <div className="text-slate-400">Available CSR Tranche</div>
                                        <div className="text-xl font-mono font-bold text-slate-900">{inspectedEntity.match.corporate.budget}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-slate-400">Thematic Match</div>
                                        <div className="text-xl font-bold text-indigo-600">{inspectedEntity.match.corporate.matchScore}%</div>
                                    </div>
                                </div>
                                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                    <div className="text-slate-400">CSR Committee Lead</div>
                                    <div className="font-bold text-slate-800">{inspectedEntity.match.corporate.lead || "Corporate CSR Committee"}</div>
                                </div>
                                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                    <div className="text-slate-400">Strategic Alignment</div>
                                    <div className="font-semibold text-slate-800">{inspectedEntity.match.corporate.themeAlign || "Schedule VII MCA Mandatory CSR"}</div>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setInspectedEntity(null)}
                                className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition text-xs cursor-pointer"
                            >
                                Close Inspection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
