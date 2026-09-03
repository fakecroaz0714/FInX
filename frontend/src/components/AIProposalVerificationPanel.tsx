'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
    ShieldCheck,
    ShieldAlert,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    FileText,
    Sparkles,
    Building2,
    Eye,
    RefreshCw,
    Search,
    MapPin,
    Users,
    DollarSign,
    Check,
    RotateCcw,
    X,
    Coins,
    Award
} from "lucide-react";
import { useLanguage } from '@/lib/LanguageContext';
import { safeJsonFetch } from '@/lib/apiUtils';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

export default function AIProposalVerificationPanel() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'CORPORATE_OVERVIEW' | 'VALIDATOR_PANEL' | 'CORPORATE_MATCHING'>('CORPORATE_OVERVIEW');
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<any>({
        pendingAi: 0,
        awaitingValidation: 1,
        accepted: 1,
        changesRequested: 1,
        rejected: 0,
        highRisk: 0
    });
    const [proposals, setProposals] = useState<any[]>([]);
    const [eligibleProposals, setEligibleProposals] = useState<any[]>([]);
    const [selectedProposal, setSelectedProposal] = useState<any>(null);
    const [verificationReport, setVerificationReport] = useState<any>(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [actionMsg, setActionMsg] = useState('');
    const [validatorComment, setValidatorComment] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchProposalsData();
    }, []);

    const fetchProposalsData = async () => {
        setLoading(true);
        try {
            const [propRes, corpRes] = await Promise.all([
                safeJsonFetch<any>(`${BACKEND_URL}/api/proposals`),
                safeJsonFetch<any>(`${BACKEND_URL}/api/corporate/eligible-proposals`)
            ]);

            if (propRes.ok && propRes.data?.success) {
                setProposals(propRes.data.proposals);
                setSummary(propRes.data.summary);
                if (propRes.data.proposals.length > 0 && !selectedProposal) {
                    setSelectedProposal(propRes.data.proposals[0]);
                }
            } else if (propRes.error) {
                console.warn('Could not load proposals from backend:', propRes.error);
            }

            if (corpRes.ok && corpRes.data?.success) {
                setEligibleProposals(corpRes.data.eligibleProposals);
            } else if (corpRes.error) {
                console.warn('Could not load eligible proposals from backend:', corpRes.error);
            }
        } catch (err) {
            console.error('Error fetching proposals data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInspectReport = async (proposal: any) => {
        setSelectedProposal(proposal);
        setLoading(true);
        try {
            const res = await safeJsonFetch<any>(`${BACKEND_URL}/api/proposals/${proposal.id}/verification-report`);
            if (res.ok && res.data?.success) {
                setVerificationReport(res.data.report);
                setShowReportModal(true);
            } else {
                console.warn('Error fetching verification report:', res.error);
            }
        } catch (err) {
            console.error('Error loading verification report:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleValidatorDecision = async (action: 'accept' | 'request-changes' | 'reject') => {
        if (!selectedProposal) return;
        if ((action === 'request-changes' || action === 'reject') && !validatorComment.trim()) {
            setActionMsg(`❌ Validator comment is required when performing '${action.toUpperCase()}'.`);
            return;
        }

        setActionLoading(true);
        try {
            const res = await safeJsonFetch<any>(`${BACKEND_URL}/api/validator/proposals/${selectedProposal.id}/${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    validatorId: 'VAL-INSPECTOR-88',
                    validatorName: 'Inspector R. Sharma (Senior Hydrologist)',
                    comments: validatorComment || 'Proposal verified and approved for corporate CSR matching.'
                })
            });
            if (res.ok && res.data?.success) {
                setValidatorComment('');
                setShowReportModal(false);
                await fetchProposalsData();
                setActionMsg(`✅ Proposal ${selectedProposal.proposalCode} updated to '${res.data.proposal.status}'.`);
                setTimeout(() => setActionMsg(''), 4000);
            } else {
                setActionMsg(`❌ Error performing decision: ${res.error || 'Server error'}`);
            }
        } catch (err) {
            console.error(`Error performing validator decision ${action}:`, err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleTriggerDemo = async (scenario: string) => {
        setActionLoading(true);
        try {
            const res = await safeJsonFetch<any>(`${BACKEND_URL}/api/demo/proposal-scenario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scenario })
            });
            if (res.ok && res.data?.success) {
                await fetchProposalsData();
                if (scenario === 'suspicious_proposal') {
                    setActionMsg('🚨 DEMO DETECTED FRAUD: Proposal loaded with +14.3% Budget Variance, 500t Material Anomaly & 94% Duplicate Match!');
                } else if (scenario === 'valid_proposal') {
                    setActionMsg('✅ DEMO ACCEPTED: Proposal marked VALIDATOR_ACCEPTED and made eligible for Corporate CSR Dashboard.');
                } else {
                    setActionMsg('🔄 Proposal demo environment reset.');
                }
                setTimeout(() => setActionMsg(''), 5000);
            } else {
                setActionMsg(`❌ Error executing demo scenario: ${res.error || 'Request failed'}`);
            }
        } catch (err) {
            console.error('Error running proposal demo scenario:', err);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading && proposals.length === 0) {
        return (
            <div className="p-12 text-center">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 font-medium text-xs">Loading AI Proposal Verification Engine...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Status Action Banner */}
            {actionMsg && (
                <div className={`p-3.5 rounded-xl font-semibold text-xs shadow-sm flex items-center justify-between transition-all ${actionMsg.includes('🚨') || actionMsg.includes('❌') ? 'bg-red-50 border border-red-200 text-red-800' :
                    actionMsg.includes('✅') ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' :
                        'bg-indigo-50 border border-indigo-200 text-indigo-800'
                    }`}>
                    <div className="flex items-center gap-2.5">
                        {actionMsg.includes('🚨') ? <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" /> :
                            actionMsg.includes('✅') ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> :
                                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />}
                        <span>{actionMsg}</span>
                    </div>
                    <button onClick={() => setActionMsg('')} className="text-xs opacity-60 hover:opacity-100 font-bold px-2">✕</button>
                </div>
            )}

            {/* DEMO MODE CONTROL BAR */}
            <Card className="border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-sm overflow-hidden">
                <CardContent className="p-4 md:p-5">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                                <h3 className="font-bold text-sm text-white">AI NGO Proposal Verification Engine</h3>
                                <Badge className="bg-amber-500/30 text-amber-300 border-amber-400/40 text-[10px] px-2 py-0.5">Modules A–H Active</Badge>
                            </div>
                            <p className="text-slate-300 text-xs">
                                Evaluates NGO eligibility, OCR document cross-checking, CSR compliance, budget intelligence (+14.3% variance), quantity anomalies & semantic duplicate detection.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <button
                                onClick={() => handleTriggerDemo('suspicious_proposal')}
                                disabled={actionLoading}
                                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-all shadow-sm disabled:opacity-50 flex items-center gap-1">
                                🚨 Trigger Suspicious Proposal Demo
                            </button>
                            <button
                                onClick={() => handleTriggerDemo('valid_proposal')}
                                disabled={actionLoading}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-all shadow-sm disabled:opacity-50 flex items-center gap-1">
                                ✅ Trigger Valid Accepted Demo
                            </button>
                            <button
                                onClick={() => handleTriggerDemo('reset')}
                                disabled={actionLoading}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded transition-all flex items-center gap-1 border border-slate-700">
                                <RefreshCw className="w-3.5 h-3.5" /> Reset
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* DASHBOARD STAT CARDS (6 CARDS) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <Card className="border border-slate-200 shadow-sm card-hover-effect">
                    <CardContent className="p-3.5">
                        <div className="text-[11px] font-semibold text-slate-500 mb-0.5 truncate">Pending AI</div>
                        <div className="text-xl font-extrabold text-slate-900 font-mono">{summary.pendingAi}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">OCR / Modules A–H</div>
                    </CardContent>
                </Card>

                <Card className="border border-amber-200 bg-amber-50/20 shadow-sm card-hover-effect">
                    <CardContent className="p-3.5">
                        <div className="text-[11px] font-semibold text-amber-800 mb-0.5 truncate">Awaiting Validation</div>
                        <div className="text-xl font-extrabold text-amber-700 font-mono">{summary.awaitingValidation}</div>
                        <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Human Review</div>
                    </CardContent>
                </Card>

                <Card className="border border-emerald-200 bg-emerald-50/20 shadow-sm card-hover-effect">
                    <CardContent className="p-3.5">
                        <div className="text-[11px] font-semibold text-emerald-800 mb-0.5 truncate">Accepted Proposals</div>
                        <div className="text-xl font-extrabold text-emerald-700 font-mono">{summary.accepted}</div>
                        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Corporate Eligible</div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 shadow-sm card-hover-effect">
                    <CardContent className="p-3.5">
                        <div className="text-[11px] font-semibold text-slate-500 mb-0.5 truncate">Changes Requested</div>
                        <div className="text-xl font-extrabold text-indigo-600 font-mono">{summary.changesRequested}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">NGO Revision</div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 shadow-sm card-hover-effect">
                    <CardContent className="p-3.5">
                        <div className="text-[11px] font-semibold text-slate-500 mb-0.5 truncate">Rejected Proposals</div>
                        <div className="text-xl font-extrabold text-red-600 font-mono">{summary.rejected}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Excluded</div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 shadow-sm card-hover-effect">
                    <CardContent className="p-3.5">
                        <div className="text-[11px] font-semibold text-slate-500 mb-0.5 truncate">High Risk</div>
                        <div className="text-xl font-extrabold text-amber-600 font-mono">{summary.highRisk}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Audit Priority</div>
                    </CardContent>
                </Card>
            </div>

            {/* TAB NAVIGATION BAR */}
            <div className="flex border-b border-slate-200 gap-2 text-xs font-bold">
                <button
                    onClick={() => setActiveTab('CORPORATE_OVERVIEW')}
                    className={`pb-3 px-4 transition-all border-b-2 flex items-center gap-2 ${activeTab === 'CORPORATE_OVERVIEW' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>
                    <Building2 className="w-4 h-4" /> AI Proposal Verification Overview
                </button>
                <button
                    onClick={() => setActiveTab('VALIDATOR_PANEL')}
                    className={`pb-3 px-4 transition-all border-b-2 flex items-center gap-2 ${activeTab === 'VALIDATOR_PANEL' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>
                    <ShieldCheck className="w-4 h-4" /> Human NGO Validator Panel
                </button>
                <button
                    onClick={() => setActiveTab('CORPORATE_MATCHING')}
                    className={`pb-3 px-4 transition-all border-b-2 flex items-center gap-2 ${activeTab === 'CORPORATE_MATCHING' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>
                    <Coins className="w-4 h-4 text-emerald-600" /> Corporate CSR Goal Matching ({eligibleProposals.length} Eligible)
                </button>
            </div>

            {/* TAB 1: CORPORATE OVERVIEW TABLE */}
            {activeTab === 'CORPORATE_OVERVIEW' && (
                <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/60 p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-sm font-bold text-slate-900">Submitted NGO CSR Proposals</CardTitle>
                                <CardDescription className="text-xs">Comprehensive evaluation using Modules A–H (NGO Eligibility, OCR, Budget Intelligence, Duplicate Check).</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-left table-compact min-w-[700px]">
                            <thead>
                                <tr>
                                    <th>NGO & Proposal</th>
                                    <th>Category & Location</th>
                                    <th className="text-right">Requested Budget</th>
                                    <th className="text-center">AI Score</th>
                                    <th>Risk & Recommendation</th>
                                    <th>Current Status</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {proposals.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="font-semibold text-slate-900">
                                            <div>{p.projectName}</div>
                                            <div className="text-[11px] text-slate-400 font-normal">{p.ngoName} • ID: {p.proposalCode}</div>
                                        </td>
                                        <td className="text-xs text-slate-600">
                                            <div>{p.csrCategory}</div>
                                            <div className="text-[11px] text-slate-400">{p.projectLocation}</div>
                                        </td>
                                        <td className="text-right font-mono font-bold text-slate-900">₹{p.requestedAmount.toLocaleString()}</td>
                                        <td className="text-center">
                                            <span className={`font-mono font-extrabold text-sm ${p.aiVerificationScore >= 85 ? 'text-emerald-600' : p.aiVerificationScore >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                                                {p.aiVerificationScore}/100
                                            </span>
                                        </td>
                                        <td>
                                            <Badge variant={p.riskLevel === 'LOW RISK' ? 'success' : p.riskLevel === 'MEDIUM RISK' ? 'warning' : 'danger'} className="text-[10px] px-2 py-0.5">
                                                {p.riskLevel}
                                            </Badge>
                                            <div className="text-[10px] text-slate-400 font-medium mt-0.5 truncate max-w-[160px]">{p.aiRecommendation}</div>
                                        </td>
                                        <td>
                                            <Badge variant={p.status === 'VALIDATOR_ACCEPTED' || p.status === 'CORPORATE_MATCHED' ? 'success' : p.status === 'CHANGES_REQUESTED' ? 'neutral' : 'warning'} className="text-[10px] px-2 py-0.5">
                                                {p.status}
                                            </Badge>
                                        </td>
                                        <td className="text-right">
                                            <button
                                                onClick={() => handleInspectReport(p)}
                                                className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[11px] font-bold px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1">
                                                <Eye className="w-3.5 h-3.5" /> Inspect AI Report
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}

            {/* TAB 2: HUMAN NGO VALIDATOR PANEL */}
            {activeTab === 'VALIDATOR_PANEL' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-3">
                        <Card className="border border-slate-200/80 shadow-sm">
                            <CardHeader className="border-b border-slate-100 p-3 bg-slate-50/60">
                                <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">Proposals Queue ({proposals.length})</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2 space-y-2">
                                {proposals.map((p) => {
                                    const isSel = selectedProposal?.id === p.id;
                                    return (
                                        <div
                                            key={p.id}
                                            onClick={() => setSelectedProposal(p)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all ${isSel ? 'border-2 border-indigo-600 bg-indigo-50/30' : 'border-slate-200 hover:border-slate-300'}`}>
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold text-slate-900">{p.proposalCode}</span>
                                                <Badge variant={p.status === 'VALIDATOR_ACCEPTED' ? 'success' : p.status === 'CHANGES_REQUESTED' ? 'neutral' : 'warning'} className="text-[9px] px-1.5 py-0.5">
                                                    {p.status}
                                                </Badge>
                                            </div>
                                            <div className="text-xs font-semibold text-slate-800 mt-1 truncate">{p.projectName}</div>
                                            <div className="text-[11px] text-slate-500">{p.ngoName}</div>
                                            <div className="flex justify-between items-center mt-2 text-[10px] font-mono">
                                                <span className="text-slate-900 font-bold">₹{p.requestedAmount.toLocaleString()}</span>
                                                <span className="text-indigo-600 font-extrabold">Score: {p.aiVerificationScore}/100</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        {selectedProposal && (
                            <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
                                <CardHeader className="bg-slate-900 text-white p-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge className="bg-indigo-500/30 text-indigo-200 border-indigo-400 text-[10px]">{selectedProposal.csrCategory}</Badge>
                                                <span className="text-slate-400 text-xs font-mono">ID: {selectedProposal.proposalCode}</span>
                                            </div>
                                            <CardTitle className="text-xl font-bold text-white">{selectedProposal.projectName}</CardTitle>
                                            <CardDescription className="text-slate-300 text-xs mt-1">Submitted by {selectedProposal.ngoName} • {selectedProposal.projectLocation}</CardDescription>
                                        </div>
                                        <div className="bg-slate-800 p-3 rounded-xl text-right">
                                            <div className="text-[10px] text-slate-400 uppercase font-semibold">AI Score</div>
                                            <div className="text-2xl font-extrabold font-mono text-emerald-400">{selectedProposal.aiVerificationScore}/100</div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-5 space-y-6">
                                    {/* Action Buttons for Human Validator */}
                                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                                        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                                            <span>Human Validator Decision Panel</span>
                                            <span className="text-[10px] text-indigo-600 font-mono">Role: Authorized Inspector</span>
                                        </div>

                                        <textarea
                                            value={validatorComment}
                                            onChange={(e) => setValidatorComment(e.target.value)}
                                            placeholder="Enter validator inspection notes / reasons for decision..."
                                            className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-h-[60px]"
                                        />

                                        <div className="flex flex-wrap items-center gap-3">
                                            <button
                                                onClick={() => handleCorporateDecisionAction('accept')}
                                                disabled={actionLoading}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50">
                                                <Check className="w-4 h-4" /> [ ACCEPT PROPOSAL ]
                                            </button>
                                            <button
                                                onClick={() => handleCorporateDecisionAction('request-changes')}
                                                disabled={actionLoading}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50">
                                                <RotateCcw className="w-4 h-4" /> [ REQUEST CHANGES ]
                                            </button>
                                            <button
                                                onClick={() => handleCorporateDecisionAction('reject')}
                                                disabled={actionLoading}
                                                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50">
                                                <X className="w-4 h-4" /> [ REJECT PROPOSAL ]
                                            </button>
                                        </div>
                                    </div>

                                    {/* Proposal Summary Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                        <div className="p-3 bg-slate-50 border rounded-lg">
                                            <div className="text-slate-400 font-medium text-[10px]">Requested Budget</div>
                                            <div className="font-bold font-mono text-slate-900 text-sm mt-0.5">₹{selectedProposal.requestedAmount.toLocaleString()}</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 border rounded-lg">
                                            <div className="text-slate-400 font-medium text-[10px]">Beneficiaries</div>
                                            <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedProposal.beneficiaryCount.toLocaleString()} Villagers</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 border rounded-lg">
                                            <div className="text-slate-400 font-medium text-[10px]">Duration</div>
                                            <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedProposal.projectDurationMonths} Months</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 border rounded-lg">
                                            <div className="text-slate-400 font-medium text-[10px]">Risk Level</div>
                                            <div className="font-bold text-emerald-600 text-sm mt-0.5">{selectedProposal.riskLevel}</div>
                                        </div>
                                    </div>

                                    {/* Inspection Report Button */}
                                    <button
                                        onClick={() => handleInspectReport(selectedProposal)}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs p-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                                        <FileText className="w-4 h-4 text-indigo-400" /> Open Full AI Verification Report (Modules A–H)
                                    </button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 3: CORPORATE CSR GOAL MATCHING (STRICT VALIDATOR ACCEPTED ELIGIBILITY) */}
            {activeTab === 'CORPORATE_MATCHING' && (
                <div className="space-y-6">
                    <Card className="border border-emerald-200 bg-emerald-50/20 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center text-xs">
                                <div>
                                    <span className="font-bold text-emerald-900 uppercase tracking-wider">Corporate CSR Goal Matching Engine</span>
                                    <p className="text-slate-600 text-xs mt-0.5">Enforces strict backend eligibility rule: Only proposals with <code className="bg-emerald-100 text-emerald-800 px-1 font-mono font-bold">status == 'VALIDATOR_ACCEPTED'</code> are visible for corporate funding allocation.</p>
                                </div>
                                <Badge className="bg-emerald-600 text-white font-mono text-xs px-3 py-1">TechCorp CSR Trust</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {eligibleProposals.map((p) => (
                            <Card key={p.id} className="border border-slate-200/80 shadow-sm overflow-hidden card-hover-effect">
                                <CardHeader className="bg-slate-900 text-white p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Badge className="bg-emerald-500/30 text-emerald-300 border-emerald-400 text-[10px] mb-1">{p.csrCategory}</Badge>
                                            <CardTitle className="text-base font-bold text-white">{p.projectName}</CardTitle>
                                            <CardDescription className="text-slate-300 text-xs mt-0.5">{p.ngoName} • {p.projectLocation}</CardDescription>
                                        </div>
                                        <div className="bg-emerald-500/20 border border-emerald-500/40 p-2.5 rounded-xl text-right">
                                            <div className="text-[9px] text-emerald-300 uppercase font-semibold">CSR Match Score</div>
                                            <div className="text-xl font-extrabold font-mono text-emerald-400">{p.csrGoalMatchScore}/100</div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-4 space-y-4">
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                                        <div className="font-bold text-slate-900">AI CSR Goal Match Reason:</div>
                                        <div className="text-slate-600 text-xs">{p.matchReason}</div>
                                    </div>

                                    <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
                                        <div>
                                            <div className="text-slate-400 text-[10px]">Requested Budget</div>
                                            <div className="font-mono font-bold text-slate-900 text-sm">₹{p.requestedAmount.toLocaleString()}</div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setActionMsg(`🎉 Corporate CSR Fund allocated to ${p.projectName}! Project transferred to Milestone Escrow Engine.`);
                                                setTimeout(() => setActionMsg(''), 5000);
                                            }}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5">
                                            <Coins className="w-4 h-4" /> Allocate CSR Capital
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* AI VERIFICATION REPORT MODAL */}
            {showReportModal && verificationReport && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto border border-slate-200">
                        {/* Modal Header */}
                        <div className="bg-slate-900 text-white p-5 flex justify-between items-start shrink-0">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge className="bg-indigo-500/30 text-indigo-200 border-indigo-400 text-[10px]">FINX AI VERIFICATION REPORT</Badge>
                                    <span className="text-slate-400 text-xs font-mono">ID: {verificationReport.proposalId}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white">{verificationReport.projectName}</h3>
                                <p className="text-slate-300 text-xs mt-0.5">Submitted by {verificationReport.ngoName} • {verificationReport.projectLocation}</p>
                            </div>
                            <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-white text-xl font-bold p-1">✕</button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
                            {/* Score & Risk Summary Header */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div>
                                    <div className="text-slate-500 font-semibold text-[10px]">Requested Amount</div>
                                    <div className="text-base font-extrabold font-mono text-slate-900 mt-0.5">₹{verificationReport.requestedAmount.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-slate-500 font-semibold text-[10px]">AI Verification Score</div>
                                    <div className="text-base font-extrabold font-mono text-emerald-600 mt-0.5">{verificationReport.overallScore}/100</div>
                                </div>
                                <div>
                                    <div className="text-slate-500 font-semibold text-[10px]">AI Ensemble Confidence</div>
                                    <div className="text-base font-extrabold font-mono text-indigo-600 mt-0.5">{verificationReport.confidenceRating || 96.4}%</div>
                                </div>
                                <div>
                                    <div className="text-slate-500 font-semibold text-[10px]">Ensemble Action Routing</div>
                                    <div className={`font-bold text-xs mt-0.5 ${verificationReport.overallScore >= 85 ? 'text-emerald-700 font-mono' : 'text-amber-700 font-mono'}`}>
                                        {verificationReport.routingLabel || 'HUMAN REVIEW REQUIRED'}
                                    </div>
                                </div>
                            </div>

                            {/* MULTI-MODEL AI ORCHESTRATOR PIPELINE (MODELS 1–7) */}
                            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-4 border border-slate-800">
                                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-amber-400" />
                                        <h4 className="font-bold text-xs uppercase tracking-wider text-white">AI Orchestrator Multi-Model Engine (Models 1–7)</h4>
                                    </div>
                                    <Badge className="bg-indigo-500/30 text-indigo-300 border-indigo-400 text-[10px]">Ensemble Pipeline Active</Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                    {verificationReport.multiModelPipeline ? (
                                        verificationReport.multiModelPipeline.map((m: any) => (
                                            <div key={m.id} className="p-2.5 bg-slate-800/90 border border-slate-700/80 rounded-lg space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-indigo-300">{m.name}</span>
                                                    <span className="font-mono text-xs font-extrabold text-emerald-400">{m.score}/100</span>
                                                </div>
                                                <p className="text-[10px] text-slate-300 leading-tight">{m.details}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg">
                                                <div className="text-[10px] font-bold text-indigo-300">MODEL 1 — NGO / KYC VERIFIER</div>
                                                <div className="text-xs font-mono font-bold text-emerald-400">100/100</div>
                                                <div className="text-[10px] text-slate-300">Registration & 80G Tax Exemption Verified</div>
                                            </div>
                                            <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg">
                                                <div className="text-[10px] font-bold text-indigo-300">MODEL 2 — CSR COMPLIANCE ENGINE</div>
                                                <div className="text-xs font-mono font-bold text-emerald-400">100/100</div>
                                                <div className="text-[10px] text-slate-300">Schedule VII Legal Category Alignment</div>
                                            </div>
                                            <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg">
                                                <div className="text-[10px] font-bold text-indigo-300">MODEL 3 — DOCUMENT INTELLIGENCE AI</div>
                                                <div className="text-xs font-mono font-bold text-amber-400">80/100</div>
                                                <div className="text-[10px] text-slate-300">OCR Extraction & Quotation Cross-Check</div>
                                            </div>
                                            <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg">
                                                <div className="text-[10px] font-bold text-indigo-300">MODEL 4 — BUDGET ML (XGBoost)</div>
                                                <div className="text-xs font-mono font-bold text-amber-400">82/100</div>
                                                <div className="text-[10px] text-slate-300">Cost Variance Estimation (+14.3%)</div>
                                            </div>
                                            <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg">
                                                <div className="text-[10px] font-bold text-indigo-300">MODEL 5 — DUPLICATE / SIMILARITY AI</div>
                                                <div className="text-xs font-mono font-bold text-amber-400">82/100</div>
                                                <div className="text-[10px] text-slate-300">Semantic & Proximity Match (94%)</div>
                                            </div>
                                            <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg">
                                                <div className="text-[10px] font-bold text-indigo-300">MODEL 6 — ANOMALY / RISK ENGINE</div>
                                                <div className="text-xs font-mono font-bold text-amber-400">78/100</div>
                                                <div className="text-[10px] text-slate-300">Material Quantity Ratio Anomaly (+56%)</div>
                                            </div>
                                            <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-lg col-span-1 lg:col-span-3">
                                                <div className="text-[10px] font-bold text-indigo-300">MODEL 7 — VISION / EVIDENCE AI</div>
                                                <div className="text-xs font-mono font-bold text-emerald-400">95/100</div>
                                                <div className="text-[10px] text-slate-300">Geotagged & Baseline Photo Verification</div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Detected Issues */}
                            <div>
                                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-2">Detected Issues & Risk Flags</h4>
                                <div className="space-y-2">
                                    {verificationReport.findings.map((f: any, idx: number) => (
                                        <div key={idx} className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 flex items-start gap-2.5">
                                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                            <div>
                                                <div className="font-bold text-[11px]">[{f.severity}] {f.module}</div>
                                                <div className="text-slate-700 text-xs mt-0.5">{f.text}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Missing Documents */}
                            {verificationReport.missingDocuments && verificationReport.missingDocuments.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-2">Missing Documents</h4>
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-900">
                                        {verificationReport.missingDocuments.map((doc: string, i: number) => (
                                            <div key={i} className="flex items-center gap-2 text-xs font-semibold">
                                                <XCircle className="w-3.5 h-3.5 text-red-600" />
                                                <span>{doc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Safety Disclaimer Banner */}
                            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl text-center space-y-1">
                                <div className="font-bold text-amber-400 uppercase tracking-wider text-xs">AI RECOMMENDATION — HUMAN DECISION REQUIRED</div>
                                <p className="text-[11px] text-slate-300 leading-relaxed">{verificationReport.disclaimer}</p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center shrink-0">
                            <span className="text-[11px] text-slate-500">Inspector ID: VAL-INSPECTOR-88</span>
                            <button onClick={() => setShowReportModal(false)} className="bg-slate-900 text-white font-bold text-xs px-5 py-2 rounded-lg">Close Report</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    function handleCorporateDecisionAction(action: 'accept' | 'request-changes' | 'reject') {
        handleValidatorDecision(action);
    }
}
