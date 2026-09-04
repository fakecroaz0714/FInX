'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
    ShieldCheck,
    ShieldAlert,
    Lock,
    Unlock,
    Camera,
    MapPin,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    ArrowRight,
    RefreshCw,
    FileText,
    History,
    Sparkles,
    DollarSign,
    UploadCloud,
    Building2,
    Eye,
    ChevronRight
} from "lucide-react";

import { useLanguage } from '@/lib/LanguageContext';
import { safeJsonFetch } from '@/lib/apiUtils';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export default function VerifiedMilestonesEngine() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [projectData, setProjectData] = useState<any>(null);
    const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showReleaseModal, setShowReleaseModal] = useState(false);
    const [actionMsg, setActionMsg] = useState('');
    const [demoLoading, setDemoLoading] = useState(false);

    // Form inputs for evidence submission
    const [evidenceForm, setEvidenceForm] = useState({
        photoUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop',
        latitude: '18.5204',
        longitude: '73.8567',
        claimedProgress: '100',
        reportedExpenditure: '800000',
        workDescription: 'Completed ground excavation, pipe trenching, and concrete bedding.'
    });

    const [reviewNotes, setReviewNotes] = useState('');

    const fetchProjectData = async () => {
        try {
            const { ok, data } = await safeJsonFetch<any>(`${BACKEND_URL}/api/milestones/project/PROJ-CLEAN-WATER-PUNE`);
            if (ok && data?.success) {
                setProjectData(data);
                if (data.milestones && data.milestones.length > 0) {
                    const activeOrSelected = data.milestones.find((m: any) => m.status === 'EVIDENCE_SUBMITTED' || m.status === 'HUMAN_REVIEW' || m.status === 'VERIFIED' || m.status === 'ACTIVE') || data.milestones[0];
                    setSelectedMilestone(activeOrSelected);
                }
            }
        } catch (err) {
            console.error('Error fetching milestone engine data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, []);

    // Get Current Geolocation from Device/Browser
    const handleGetLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setEvidenceForm(prev => ({
                        ...prev,
                        latitude: pos.coords.latitude.toFixed(6),
                        longitude: pos.coords.longitude.toFixed(6)
                    }));
                    setActionMsg('GPS Coordinates fetched from device geolocation!');
                    setTimeout(() => setActionMsg(''), 3000);
                },
                (err) => {
                    console.warn('Geolocation error:', err.message);
                    setActionMsg('Device GPS unavailable. Using project default location.');
                    setTimeout(() => setActionMsg(''), 3000);
                }
            );
        }
    };

    // Run Demo Fraud Scenario
    const handleTriggerDemo = async (scenario: string) => {
        setDemoLoading(true);
        setActionMsg(`Simulating Fraud Engine Scenario: ${scenario.toUpperCase()}...`);
        try {
            const { ok, data } = await safeJsonFetch<any>(`${BACKEND_URL}/api/demo/fraud-scenario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scenario })
            });
            if (ok && data?.success) {
                await fetchProjectData();
                if (scenario === 'gps_mismatch') {
                    setActionMsg('🚨 DEMO DETECTED FRAUD: GPS Mismatch! Evidence captured 15.4km away. Funds LOCKED & Risk Flag raised.');
                } else if (scenario === 'duplicate_image') {
                    setActionMsg('🔄 DEMO DETECTED FRAUD: SHA-256 Image Hash Collision! Photo previously submitted.');
                } else if (scenario === 'valid_verification') {
                    setActionMsg('✅ DEMO VERIFIED: Geotagged evidence valid (Score: 94.1%). Ready for Fund Release!');
                } else if (scenario === 'reset') {
                    setActionMsg('🔄 Demo environment reset to initial state.');
                }
            } else {
                setActionMsg(`Action failed: ${data?.error || 'Server error'}`);
            }
        } catch (err) {
            console.error('Error running demo scenario:', err);
        } finally {
            setDemoLoading(false);
        }
    };

    // Submit Evidence
    const handleSubmitEvidence = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMilestone) return;

        setLoading(true);
        try {
            const { ok, data } = await safeJsonFetch<any>(`${BACKEND_URL}/api/evidence/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: projectData.project.id,
                    milestoneId: selectedMilestone.id,
                    latitude: evidenceForm.latitude,
                    longitude: evidenceForm.longitude,
                    claimedProgress: evidenceForm.claimedProgress,
                    reportedExpenditure: evidenceForm.reportedExpenditure,
                    workDescription: evidenceForm.workDescription,
                    photoUrl: evidenceForm.photoUrl,
                    uploadedBy: 'Jal Seva NGO Field Team'
                })
            });
            if (ok && data?.success) {
                setShowSubmitModal(false);
                await fetchProjectData();
                setActionMsg(`Evidence submitted! Verification Score: ${data.verification.verificationScore}%`);
            } else {
                setActionMsg(`Evidence submission failed: ${data?.error || 'Server error'}`);
            }
        } catch (err) {
            console.error('Error submitting evidence:', err);
        } finally {
            setLoading(false);
        }
    };

    // Corporate Decision (Human-in-the-Loop)
    const handleCorporateDecision = async (action: string) => {
        if (!selectedMilestone) return;
        setLoading(true);
        try {
            const { ok, data } = await safeJsonFetch<any>(`${BACKEND_URL}/api/milestones/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: projectData.project.id,
                    milestoneId: selectedMilestone.id,
                    action,
                    notes: reviewNotes,
                    corporateUser: 'TechCorp CSR Director'
                })
            });
            if (ok && data?.success) {
                setShowReviewModal(false);
                setReviewNotes('');
                await fetchProjectData();
                setActionMsg(`Corporate Decision applied: ${action}`);
            } else {
                setActionMsg(`Decision failed: ${data?.error || 'Server error'}`);
            }
        } catch (err) {
            console.error('Error applying decision:', err);
        } finally {
            setLoading(false);
        }
    };

    // Release Funds Execution
    const handleReleaseFunds = async () => {
        if (!selectedMilestone) return;
        setLoading(true);
        try {
            const { ok, data } = await safeJsonFetch<any>(`${BACKEND_URL}/api/fund-release`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: projectData.project.id,
                    milestoneId: selectedMilestone.id,
                    authorizedBy: 'TechCorp CSR Director'
                })
            });
            if (ok && data?.success) {
                setShowReleaseModal(false);
                await fetchProjectData();
                setActionMsg('🎉 MILESTONE VERIFIED — NEXT FUNDING STAGE UNLOCKED!');
            } else {
                setActionMsg(`❌ ${data?.error || 'Fund release failed'}`);
            }
        } catch (err) {
            console.error('Error releasing funds:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !projectData) {
        return (
            <div className="p-12 text-center">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 font-medium text-sm">Loading Verified Milestone Funding Engine...</p>
            </div>
        );
    }

    const { project, summary, milestones, riskFlags, fundReleases, auditTrail } = projectData;

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            {/* Action Banner / Notification */}
            {actionMsg && (
                <div className={`p-3.5 rounded-xl font-semibold text-xs shadow-sm flex items-center justify-between transition-all ${actionMsg.includes('🚨') || actionMsg.includes('❌') ? 'bg-red-50 border border-red-200 text-red-800' :
                        actionMsg.includes('✅') || actionMsg.includes('🎉') ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' :
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

            {/* FRAUD DEMO CONTROL BAR */}
            <Card className="border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-sm overflow-hidden">
                <CardContent className="p-4 md:p-5">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                                <h3 className="font-bold text-sm text-white">Interactive Fraud Demo Mode</h3>
                                <Badge className="bg-amber-500/30 text-amber-300 border-amber-400/40 text-[10px] px-2 py-0.5">Live Testing</Badge>
                            </div>
                            <p className="text-slate-300 text-xs">
                                Test FINX automated fraud detection engine. Simulate fake GPS photos or duplicate image uploads to verify fund locking.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <button
                                onClick={() => handleTriggerDemo('gps_mismatch')}
                                disabled={demoLoading}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50">
                                {t('btn_demo_gps')}
                            </button>
                            <button
                                onClick={() => handleTriggerDemo('duplicate_image')}
                                disabled={demoLoading}
                                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50">
                                {t('btn_demo_dup')}
                            </button>
                            <button
                                onClick={() => handleTriggerDemo('valid_verification')}
                                disabled={demoLoading}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50">
                                {t('btn_demo_valid')}
                            </button>
                            <button
                                onClick={() => handleTriggerDemo('reset')}
                                disabled={demoLoading}
                                className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium px-3 py-2 rounded-lg transition-colors flex items-center gap-1">
                                <RefreshCw className="w-3.5 h-3.5" /> {t('btn_reset')}
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* MILESTONE FUNDING CONTROL PANEL */}
            <Card className="border border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-900 text-white pb-6 pt-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-indigo-500/30 text-indigo-200 border-indigo-400">{t('nav_verified_milestones')}</Badge>
                                <span className="text-slate-400 text-xs font-mono">ID: {project.id}</span>
                            </div>
                            <CardTitle className="text-2xl text-white font-bold">{project.title}</CardTitle>
                            <CardDescription className="text-slate-300 mt-1 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                                {project.location} (Lat: {project.latitude}, Lng: {project.longitude})
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-right">
                                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{t('metric_approved_budget')}</div>
                                <div className="text-2xl font-bold font-mono text-white">₹{summary.totalBudget.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Central Product Principle Banner */}
                    <div className="mt-6 pt-6 border-t border-slate-800">
                        <div className={`p-4 rounded-xl font-bold text-center text-sm uppercase tracking-wide flex items-center justify-center gap-3 shadow-inner ${summary.currentMilestoneStatus === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                                summary.riskLevel === 'CRITICAL' || summary.currentMilestoneStatus === 'VERIFICATION_FAILED' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                                    'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}>
                            {summary.currentMilestoneStatus === 'VERIFIED' ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    <span>{t('status_verified_banner')}</span>
                                </>
                            ) : summary.riskLevel === 'CRITICAL' || summary.currentMilestoneStatus === 'VERIFICATION_FAILED' ? (
                                <>
                                    <ShieldAlert className="w-5 h-5 text-red-400" />
                                    <span>{t('status_blocked_banner')}</span>
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5 text-amber-400" />
                                    <span>{t('status_locked_banner')}</span>
                                </>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 bg-slate-50/50">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-xs text-slate-500 font-semibold mb-1">Released Amount</div>
                            <div className="text-xl font-bold text-emerald-600 font-mono">₹{summary.releasedAmount.toLocaleString()}</div>
                            <div className="text-xs text-slate-400 mt-1">{((summary.releasedAmount / summary.totalBudget) * 100).toFixed(0)}% of total</div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-xs text-slate-500 font-semibold mb-1">Locked Amount</div>
                            <div className="text-xl font-bold text-slate-900 font-mono">₹{summary.lockedAmount.toLocaleString()}</div>
                            <div className="text-xs text-slate-400 mt-1">Escrow Protected</div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-xs text-slate-500 font-semibold mb-1">Current Stage</div>
                            <div className="text-sm font-bold text-indigo-700 truncate">{summary.currentMilestoneTitle}</div>
                            <div className="text-xs text-slate-400 mt-1">Status: {summary.currentMilestoneStatus}</div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-xs text-slate-500 font-semibold mb-1">Verification Score</div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xl font-bold font-mono ${summary.verificationScore >= 85 ? 'text-emerald-600' : summary.verificationScore >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                                    {summary.verificationScore}%
                                </span>
                                <Badge variant={summary.verificationScore >= 85 ? 'success' : summary.verificationScore >= 70 ? 'warning' : 'danger'}>
                                    {summary.verificationScore >= 85 ? 'High' : 'Review'}
                                </Badge>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">Deterministic AI+GPS</div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-xs text-slate-500 font-semibold mb-1">Risk Level</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Badge variant={summary.riskLevel === 'LOW' ? 'success' : summary.riskLevel === 'MEDIUM' ? 'warning' : 'danger'} className="text-xs font-bold px-2 py-0.5">
                                    {summary.riskLevel}
                                </Badge>
                                {summary.riskLevel !== 'LOW' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">{riskFlags.length} active risk flag(s)</div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-xs text-slate-500 font-semibold mb-1">Physical Progress</div>
                            <div className="text-xl font-bold text-slate-900 font-mono">{summary.projectProgress}%</div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                                <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${summary.projectProgress}%` }}></div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* VISUAL EVIDENCE TIMELINE (BASELINE -> M1 -> M2 -> M3 -> FINAL) */}
            <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <History className="w-5 h-5 text-indigo-600" />
                                Geotagged Evidence Timeline
                            </CardTitle>
                            <CardDescription>Click any stage to inspect physical photo proof, GPS verification & AI analysis scores.</CardDescription>
                        </div>
                        <Badge variant="neutral" className="text-xs">Baseline GPS: {project.latitude}, {project.longitude}</Badge>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                        {/* 1. Baseline Stage */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative group hover:border-indigo-300 transition-all">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Baseline</span>
                                <Badge variant="success" className="text-[10px]">Verified</Badge>
                            </div>
                            <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-200 mb-3 border border-slate-200">
                                <img src={project.baselinePhotoUrl} alt="Baseline inspection" className="object-cover w-full h-full" />
                                <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                                    <MapPin className="w-3 h-3 text-emerald-400" /> GPS Locked
                                </div>
                            </div>
                            <div className="text-xs text-slate-700 font-semibold truncate">{project.baselineInspector}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">Aug 15, 2026 • Baseline Photo</div>
                        </div>

                        {/* Milestones 1 to 4 */}
                        {milestones.map((m: any, idx: number) => {
                            const isSelected = selectedMilestone && selectedMilestone.id === m.id;
                            const isReleased = m.status === 'FUND_RELEASED' || m.status === 'COMPLETED';
                            const isVerified = m.status === 'VERIFIED';
                            const isFailed = m.status === 'VERIFICATION_FAILED' || m.status === 'FLAGGED';

                            return (
                                <div
                                    key={m.id}
                                    onClick={() => setSelectedMilestone(m)}
                                    className={`cursor-pointer rounded-xl p-4 border transition-all relative ${isSelected ? 'border-2 border-indigo-600 bg-indigo-50/40 shadow-sm' :
                                            isReleased ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300' :
                                                isFailed ? 'border-red-200 bg-red-50/20 hover:border-red-300' :
                                                    'border-slate-200 bg-white hover:border-slate-300'
                                        }`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-slate-700">M{m.milestoneNumber} ({m.percentage}%)</span>
                                        <Badge variant={isReleased ? 'success' : isVerified ? 'success' : isFailed ? 'danger' : m.status === 'ACTIVE' ? 'warning' : 'neutral'} className="text-[10px]">
                                            {m.status}
                                        </Badge>
                                    </div>

                                    <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-100 mb-3 border border-slate-200 flex items-center justify-center text-slate-400">
                                        {m.evidence ? (
                                            <img src={m.evidence.photoUrl} alt={`Milestone ${m.milestoneNumber}`} className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="text-center p-2">
                                                <Camera className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                                                <span className="text-[10px] text-slate-400">Awaiting Evidence</span>
                                            </div>
                                        )}
                                        {m.verification && (
                                            <div className={`absolute top-1 right-1 text-white text-[10px] font-bold px-1.5 py-0.5 rounded font-mono shadow-sm ${m.verification.verificationScore >= 85 ? 'bg-emerald-600' : 'bg-red-600'}`}>
                                                {m.verification.verificationScore}%
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-xs font-bold text-slate-900 truncate">{m.title}</div>
                                    <div className="text-xs font-mono text-slate-600 font-semibold mt-0.5">₹{m.amount.toLocaleString()}</div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* MILESTONE SCHEDULE & VERIFICATION ACTION ENGINE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-lg">Project Milestones Schedule</CardTitle>
                                    <CardDescription>Server-validated status machine & fund release controls.</CardDescription>
                                </div>
                                <button
                                    onClick={() => setShowSubmitModal(true)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
                                    <UploadCloud className="w-4 h-4" /> Submit Milestone Evidence
                                </button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {milestones.map((m: any) => {
                                    const isSelected = selectedMilestone && selectedMilestone.id === m.id;

                                    return (
                                        <div
                                            key={m.id}
                                            className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${isSelected ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'}`}>
                                            <div className="flex items-start gap-3.5 flex-1">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm shadow-sm ${m.status === 'FUND_RELEASED' || m.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                                        m.status === 'VERIFIED' ? 'bg-indigo-100 text-indigo-700' :
                                                            m.status === 'VERIFICATION_FAILED' || m.status === 'FLAGGED' ? 'bg-red-100 text-red-700' :
                                                                m.status === 'ACTIVE' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
                                                    }`}>
                                                    M{m.milestoneNumber}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-bold text-slate-900 text-base">{m.title}</h4>
                                                        <Badge variant={
                                                            m.status === 'FUND_RELEASED' || m.status === 'COMPLETED' ? 'success' :
                                                                m.status === 'VERIFIED' ? 'success' :
                                                                    m.status === 'VERIFICATION_FAILED' || m.status === 'FLAGGED' ? 'danger' :
                                                                        m.status === 'ACTIVE' ? 'warning' : 'neutral'
                                                        }>
                                                            {m.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-slate-500 max-w-lg">{m.description}</p>

                                                    {m.verification && (
                                                        <div className="flex items-center gap-3 mt-2 text-xs">
                                                            <span className="font-semibold text-slate-700">
                                                                Verification Score: <span className={m.verification.verificationScore >= 85 ? 'text-emerald-600' : 'text-red-600'}>{m.verification.verificationScore}%</span>
                                                            </span>
                                                            <span className="text-slate-300">•</span>
                                                            <span className="text-slate-500">Distance: {m.verification.distanceMeters}m</span>
                                                            {m.verification.duplicateDetected && (
                                                                <Badge variant="danger" className="text-[10px]">Duplicate Image</Badge>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-right flex items-center gap-3 shrink-0 self-end md:self-center">
                                                <div className="text-right">
                                                    <div className="font-mono font-bold text-slate-900 text-base">₹{m.amount.toLocaleString()}</div>
                                                    <div className="text-xs text-slate-400">{m.percentage}% of total</div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {m.status === 'EVIDENCE_SUBMITTED' || m.status === 'HUMAN_REVIEW' || m.status === 'VERIFIED' || m.verification ? (
                                                        <button
                                                            onClick={() => { setSelectedMilestone(m); setShowReviewModal(true); }}
                                                            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1 shadow-sm">
                                                            <Eye className="w-3.5 h-3.5 text-indigo-600" /> Inspect
                                                        </button>
                                                    ) : null}

                                                    {m.status === 'VERIFIED' && (
                                                        <button
                                                            onClick={() => { setSelectedMilestone(m); setShowReleaseModal(true); }}
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1 shadow-sm">
                                                            <Unlock className="w-3.5 h-3.5" /> Release Funds
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ACTIVE RISK FLAGS & AUDIT TRAIL */}
                <div className="space-y-6">
                    {/* Risk Flags Card */}
                    <Card className="border border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-600" />
                                    Active Risk Flags
                                </CardTitle>
                                <Badge variant={riskFlags.length === 0 ? 'success' : 'danger'}>
                                    {riskFlags.length} Flag(s)
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            {riskFlags.length === 0 ? (
                                <div className="text-center py-6 text-slate-400 text-xs">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                                    No active risk flags. Geolocation & visual verification clear.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {riskFlags.map((flag: any) => (
                                        <div key={flag.id} className="p-3 bg-red-50/60 border border-red-200 rounded-lg text-xs space-y-1">
                                            <div className="flex justify-between items-center">
                                                <Badge variant="danger" className="text-[10px] uppercase font-bold">
                                                    {flag.flag_type}
                                                </Badge>
                                                <span className="text-[10px] text-red-600 font-bold uppercase">{flag.risk_level} RISK</span>
                                            </div>
                                            <p className="text-slate-700 font-medium">{flag.details}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Immutable Audit Log */}
                    <Card className="border border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-3 bg-slate-50/50">
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-600" />
                                Server Verification Audit Trail
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 font-mono text-xs max-h-80 overflow-y-auto">
                            <div className="divide-y divide-slate-100">
                                {auditTrail.map((log: any) => (
                                    <div key={log.id} className="p-3 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                            <span className="font-bold text-indigo-600">{log.actor}</span>
                                            <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <div className="text-slate-700 font-sans font-medium text-xs">{log.action}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* MODAL 1: SUBMIT MILESTONE EVIDENCE */}
            {showSubmitModal && selectedMilestone && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Submit Milestone Evidence</h3>
                                <p className="text-xs text-slate-500">Milestone {selectedMilestone.milestoneNumber}: {selectedMilestone.title}</p>
                            </div>
                            <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                        </div>

                        <form onSubmit={handleSubmitEvidence} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Evidence Photograph URL</label>
                                <input
                                    type="text"
                                    value={evidenceForm.photoUrl}
                                    onChange={(e) => setEvidenceForm({ ...evidenceForm, photoUrl: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Current Latitude</label>
                                    <input
                                        type="text"
                                        value={evidenceForm.latitude}
                                        onChange={(e) => setEvidenceForm({ ...evidenceForm, latitude: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Current Longitude</label>
                                    <input
                                        type="text"
                                        value={evidenceForm.longitude}
                                        onChange={(e) => setEvidenceForm({ ...evidenceForm, longitude: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGetLocation}
                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Fetch Current Geolocation from Device GPS
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Claimed Progress (%)</label>
                                    <input
                                        type="number"
                                        value={evidenceForm.claimedProgress}
                                        onChange={(e) => setEvidenceForm({ ...evidenceForm, claimedProgress: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Reported Expenditure (₹)</label>
                                    <input
                                        type="number"
                                        value={evidenceForm.reportedExpenditure}
                                        onChange={(e) => setEvidenceForm({ ...evidenceForm, reportedExpenditure: e.target.value })}
                                        className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Work Details & Physical Output</label>
                                <textarea
                                    rows={3}
                                    value={evidenceForm.workDescription}
                                    onChange={(e) => setEvidenceForm({ ...evidenceForm, workDescription: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowSubmitModal(false)}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1 shadow-sm">
                                    <ShieldCheck className="w-4 h-4" /> Run Verification Engine
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: CORPORATE REVIEW & HUMAN-IN-THE-LOOP INSPECTION */}
            {showReviewModal && selectedMilestone && selectedMilestone.verification && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="default">Corporate Human-in-the-Loop Review</Badge>
                                    <span className="text-xs text-slate-400 font-mono">Milestone {selectedMilestone.milestoneNumber}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedMilestone.title}</h3>
                            </div>
                            <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                        </div>

                        {/* Side by Side Image Comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Baseline Geotagged Site Photo</div>
                                <div className="h-40 w-full rounded-lg overflow-hidden bg-slate-200 mb-2">
                                    <img src={project.baselinePhotoUrl} alt="Baseline" className="w-full h-full object-cover" />
                                </div>
                                <div className="text-[11px] text-slate-600 font-mono">GPS: {project.latitude}, {project.longitude}</div>
                            </div>

                            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Submitted Milestone Photo</span>
                                    <Badge variant={selectedMilestone.verification.locationStatus === 'VERIFIED' ? 'success' : 'danger'}>
                                        {selectedMilestone.verification.locationStatus}
                                    </Badge>
                                </div>
                                <div className="h-40 w-full rounded-lg overflow-hidden bg-slate-200 mb-2">
                                    <img src={selectedMilestone.evidence.photoUrl} alt="Evidence" className="w-full h-full object-cover" />
                                </div>
                                <div className="text-[11px] text-slate-600 font-mono">
                                    Captured: {selectedMilestone.evidence.latitude}, {selectedMilestone.evidence.longitude} ({selectedMilestone.verification.distanceMeters}m away)
                                </div>
                            </div>
                        </div>

                        {/* Verification Score Breakdown */}
                        <div className="bg-slate-900 text-white p-5 rounded-xl space-y-3">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                <div>
                                    <div className="text-xs text-indigo-400 font-semibold uppercase">Deterministic Score Calculation</div>
                                    <div className="text-2xl font-bold font-mono">
                                        Verification Score: <span className={selectedMilestone.verification.verificationScore >= 85 ? 'text-emerald-400' : 'text-red-400'}>{selectedMilestone.verification.verificationScore}%</span>
                                    </div>
                                </div>
                                <Badge variant={selectedMilestone.verification.finalStatus === 'VERIFIED' ? 'success' : 'danger'} className="text-sm font-bold px-3 py-1">
                                    {selectedMilestone.verification.finalStatus}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                                <div className="bg-slate-800 p-2.5 rounded-lg">
                                    <div className="text-slate-400">GPS Distance (30%)</div>
                                    <div className="font-bold text-white mt-1">{selectedMilestone.verification.distanceMeters}m</div>
                                </div>
                                <div className="bg-slate-800 p-2.5 rounded-lg">
                                    <div className="text-slate-400">AI Visual (25%)</div>
                                    <div className="font-bold text-white mt-1">{selectedMilestone.verification.aiProgressScore}%</div>
                                </div>
                                <div className="bg-slate-800 p-2.5 rounded-lg">
                                    <div className="text-slate-400">Progress Match (20%)</div>
                                    <div className="font-bold text-white mt-1">{selectedMilestone.verification.progressMismatch ? 'Mismatch' : 'Matches'}</div>
                                </div>
                                <div className="bg-slate-800 p-2.5 rounded-lg">
                                    <div className="text-slate-400">Cost Variance (15%)</div>
                                    <div className="font-bold text-white mt-1">+{selectedMilestone.verification.costVariancePercent}%</div>
                                </div>
                                <div className="bg-slate-800 p-2.5 rounded-lg">
                                    <div className="text-slate-400">SHA-256 Hash</div>
                                    <div className="font-bold text-white mt-1">{selectedMilestone.verification.duplicateDetected ? 'DUPLICATE' : 'Unique'}</div>
                                </div>
                            </div>
                        </div>

                        {/* AI Explanation & Notes */}
                        <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl text-xs space-y-1">
                            <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-indigo-600" /> AI Visual Analysis Reason
                            </div>
                            <p className="text-slate-700">{selectedMilestone.verification.aiReason}</p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Officer Audit Notes (Optional)</label>
                            <input
                                type="text"
                                placeholder="Enter approval/revision notes..."
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Decision Action Buttons */}
                        <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
                            <button
                                onClick={() => handleCorporateDecision('REJECT')}
                                className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors">
                                ⛔ Reject Evidence
                            </button>
                            <button
                                onClick={() => handleCorporateDecision('FLAG')}
                                className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors">
                                🔴 Flag for Audit
                            </button>
                            <button
                                onClick={() => handleCorporateDecision('REVISION')}
                                className="bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors">
                                🟡 Request Revision
                            </button>
                            <button
                                onClick={() => handleCorporateDecision('APPROVE')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
                                🟢 Approve Milestone
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 3: RELEASE FUNDS EXECUTION */}
            {showReleaseModal && selectedMilestone && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Unlock className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Authorize Milestone Fund Release</h3>
                            <p className="text-xs text-slate-500 mt-1">Execute verified payment release from escrow ledger.</p>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
                            <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-500">Milestone</span>
                                <span className="font-bold text-slate-900">Milestone {selectedMilestone.milestoneNumber} ({selectedMilestone.percentage}%)</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-500">Release Amount</span>
                                <span className="font-bold text-emerald-600 font-mono text-base">₹{selectedMilestone.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-500">Verification Score</span>
                                <span className="font-bold text-slate-900">{selectedMilestone.verification ? selectedMilestone.verification.verificationScore : 92.5}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Next Stage Unlock</span>
                                <span className="font-bold text-indigo-600">Milestone {selectedMilestone.milestoneNumber + 1} ACTIVE</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowReleaseModal(false)}
                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg text-xs">
                                Cancel
                            </button>
                            <button
                                onClick={handleReleaseFunds}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-xs flex items-center justify-center gap-1 shadow-sm">
                                Confirm & Release Funds
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
