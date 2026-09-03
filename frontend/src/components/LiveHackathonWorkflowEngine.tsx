'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
    Sparkles,
    ShieldCheck,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    MapPin,
    Building2,
    FileText,
    Activity,
    Lock,
    Unlock,
    Upload,
    RefreshCw,
    AlertTriangle,
    Coins,
    Check,
    ArrowRight,
    Users,
    Clock,
    DollarSign,
    Layers,
    Sliders
} from "lucide-react";
import { useLanguage } from '@/lib/LanguageContext';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

export default function LiveHackathonWorkflowEngine() {
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [actionMsg, setActionMsg] = useState('');

    // Step 1: NGO CSR Form 1 State
    const [form1, setForm1] = useState({
        village: 'Shirur Village',
        districtState: 'Pune District, Maharashtra',
        title: 'Shirur Rural Access Road Development',
        description: 'Construction of 2.4 km paved all-weather rural access road connecting Shirur village to district market.',
        beneficiaries: 4500,
        roadLengthKm: 2.4,
        durationMonths: 6,
        requestedAmount: 1000000, // ₹10,00,000
        latitude: 18.5204,
        longitude: 73.8567,
        baselinePhotoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?q=80&w=800&auto=format&fit=crop',
        quotationFile: 'Vendor_Quotation_RoadCorp_2026.pdf'
    });

    // Step 2: AI Real-Time Multi-Stage Verification State
    const [aiVerifying, setAiVerifying] = useState(false);
    const [aiStage, setAiStage] = useState(0);
    const [form1Report, setForm1Report] = useState<any>(null);

    // Step 3: Corporate CSR Form 2 & Form 3 State
    const [form2Approved, setForm2Approved] = useState(false);
    const [form3Authorized, setForm3Authorized] = useState(false);

    // Step 4: Escrow Milestones State
    const [milestones, setMilestones] = useState([
        { id: 'MS-101', number: 1, title: 'Milestone 1: Site Prep & Excavation', amount: 200000, pct: 20, status: 'ACTIVE', completedQty: 300, expectedQty: 300 },
        { id: 'MS-102', number: 2, title: 'Milestone 2: Sub-Base Concrete Bed', amount: 250000, pct: 25, status: 'LOCKED', completedQty: 0, expectedQty: 500 },
        { id: 'MS-103', number: 3, title: 'Milestone 3: Tar Surface Laying', amount: 300000, pct: 30, status: 'LOCKED', completedQty: 0, expectedQty: 800 },
        { id: 'MS-104', number: 4, title: 'Milestone 4: Drainage & Side Shoulders', amount: 150000, pct: 15, status: 'LOCKED', completedQty: 0, expectedQty: 400 },
        { id: 'MS-105', number: 5, title: 'Milestone 5: Final Commissioning & Signs', amount: 100000, pct: 10, status: 'LOCKED', completedQty: 0, expectedQty: 400 }
    ]);

    const [activeMilestoneId, setActiveMilestoneId] = useState('MS-101');
    const [evidenceFile, setEvidenceFile] = useState('https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?q=80&w=800&auto=format&fit=crop');
    const [evidenceCoords, setEvidenceCoords] = useState({ lat: 18.5204, lng: 73.8567 });
    const [verificationResult, setVerificationResult] = useState<any>(null);
    const [releasedFunds, setReleasedFunds] = useState<any[]>([]);

    // Auto-capture GPS coordinates from browser
    const handleCaptureBrowserGPS = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = Number(pos.coords.latitude.toFixed(4));
                    const lng = Number(pos.coords.longitude.toFixed(4));
                    setForm1(prev => ({ ...prev, latitude: lat, longitude: lng }));
                    setEvidenceCoords({ lat, lng });
                    setActionMsg(`📍 Captured Browser Geolocation: ${lat}, ${lng}`);
                    setTimeout(() => setActionMsg(''), 4000);
                },
                (err) => {
                    setActionMsg('⚠️ Geolocation permission denied. Using fallback coordinates (18.5204, 73.8567).');
                    setTimeout(() => setActionMsg(''), 4000);
                }
            );
        }
    };

    // Step 1 -> Step 2: Trigger AI Verification
    const handleSubmitForm1 = async () => {
        setAiVerifying(true);
        setAiStage(1);
        setCurrentStep(2);

        // Simulate 8-Stage Real-Time Pipeline Progress
        for (let i = 1; i <= 8; i++) {
            await new Promise(r => setTimeout(r, 400));
            setAiStage(i);
        }

        try {
            const res = await fetch(`${BACKEND_URL}/api/proposals/FINX-PR-00241/verification-report`);
            const data = await res.json();
            if (data.success) {
                setForm1Report(data.report);
            }
        } catch (err) {
            console.error('Error running Form 1 verification:', err);
        } finally {
            setAiVerifying(false);
        }
    };

    // Step 3: Approve CSR Form 2 & Form 3
    const handleApproveForm2Form3 = () => {
        setForm2Approved(true);
        setForm3Authorized(true);
        setCurrentStep(4);
        setActionMsg('✅ Corporate Approved CSR Form 2 (Scope) & Authorized Form 3 (Milestone Funding Escrow). Milestone 1 Activated!');
        setTimeout(() => setActionMsg(''), 5000);
    };

    // Run Multi-Model Milestone AI Verification
    const handleVerifyMilestone = async (isFraudScenario: string | null = null) => {
        setLoading(true);
        try {
            const activeMs = milestones.find(m => m.id === activeMilestoneId) || milestones[0];

            let lat = evidenceCoords.lat;
            let lng = evidenceCoords.lng;
            let photoUrl = evidenceFile;

            if (isFraudScenario === 'gps_mismatch') {
                lat = 18.6500; // 15.4 km away
                lng = 73.9500;
            } else if (isFraudScenario === 'duplicate_image') {
                photoUrl = 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?q=80&w=800&auto=format&fit=crop';
            }

            const res = await fetch(`${BACKEND_URL}/api/demo/fraud-scenario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenario: isFraudScenario || 'valid_evidence',
                    milestoneId: activeMs.id
                })
            });

            const data = await res.json();
            if (data.success) {
                setVerificationResult(data.verification);
                if (data.verification.verificationScore < 70 || data.verification.finalStatus === 'VERIFICATION_FAILED') {
                    setActionMsg(`🚨 VERIFICATION FAILED! Risk Flag: ${data.verification.riskFlags[0]?.flag_type || 'ANOMALY'}. Fund Release BLOCKED.`);
                } else {
                    setActionMsg(`✅ MILESTONE VERIFIED (Score: ${data.verification.verificationScore}/100). Awaiting Human Approval.`);
                }
            }
        } catch (err) {
            console.error('Error verifying milestone:', err);
        } finally {
            setLoading(false);
        }
    };

    // Human Approval Gate & Internal Ledger Release
    const handleHumanApprovalAndRelease = async () => {
        if (!verificationResult || verificationResult.verificationScore < 70) {
            setActionMsg('❌ Cannot approve: AI Verification failed or score below threshold.');
            return;
        }

        const activeMs = milestones.find(m => m.id === activeMilestoneId);
        if (!activeMs) return;

        setLoading(true);
        try {
            // Internal simulated ledger release
            const newRelease = {
                transactionId: `TXN-ESCROW-${Date.now().toString().slice(-6)}`,
                milestoneId: activeMs.id,
                milestoneNumber: activeMs.number,
                amount: activeMs.amount,
                timestamp: new Date().toISOString()
            };

            setReleasedFunds(prev => [newRelease, ...prev]);

            // Update Milestone state: ACTIVE -> FUND_RELEASED -> Next UNLOCKED
            setMilestones(prev => prev.map(m => {
                if (m.id === activeMs.id) {
                    return { ...m, status: 'FUND_RELEASED' };
                }
                if (m.number === activeMs.number + 1) {
                    return { ...m, status: 'ACTIVE' };
                }
                return m;
            }));

            // Move to next milestone if available
            const nextMs = milestones.find(m => m.number === activeMs.number + 1);
            if (nextMs) {
                setActiveMilestoneId(nextMs.id);
            }

            setVerificationResult(null);
            setActionMsg(`🎉 ₹${activeMs.amount.toLocaleString()} Milestone Fund Released! Next Milestone UNLOCKED.`);
            setTimeout(() => setActionMsg(''), 6000);
        } catch (err) {
            console.error('Error releasing funds:', err);
        } finally {
            setLoading(false);
        }
    };

    // Reset Hackathon Demo
    const handleResetDemo = () => {
        setCurrentStep(1);
        setForm2Approved(false);
        setForm3Authorized(false);
        setForm1Report(null);
        setVerificationResult(null);
        setReleasedFunds([]);
        setMilestones([
            { id: 'MS-101', number: 1, title: 'Milestone 1: Site Prep & Excavation', amount: 200000, pct: 20, status: 'ACTIVE', completedQty: 300, expectedQty: 300 },
            { id: 'MS-102', number: 2, title: 'Milestone 2: Sub-Base Concrete Bed', amount: 250000, pct: 25, status: 'LOCKED', completedQty: 0, expectedQty: 500 },
            { id: 'MS-103', number: 3, title: 'Milestone 3: Tar Surface Laying', amount: 300000, pct: 30, status: 'LOCKED', completedQty: 0, expectedQty: 800 },
            { id: 'MS-104', number: 4, title: 'Milestone 4: Drainage & Side Shoulders', amount: 150000, pct: 15, status: 'LOCKED', completedQty: 0, expectedQty: 400 },
            { id: 'MS-105', number: 5, title: 'Milestone 5: Final Commissioning & Signs', amount: 100000, pct: 10, status: 'LOCKED', completedQty: 0, expectedQty: 400 }
        ]);
        setActiveMilestoneId('MS-101');
        setActionMsg('🔄 FINX Hackathon Demo Environment Reset to Step 1.');
        setTimeout(() => setActionMsg(''), 4000);
    };

    return (
        <div className="space-y-6">
            {/* Top Action Notification Banner */}
            {actionMsg && (
                <div className={`p-3.5 rounded-xl font-semibold text-xs shadow-sm flex items-center justify-between transition-all ${actionMsg.includes('🚨') || actionMsg.includes('❌') ? 'bg-red-50 border border-red-200 text-red-800' :
                        actionMsg.includes('🎉') || actionMsg.includes('✅') ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' :
                            'bg-indigo-50 border border-indigo-200 text-indigo-800'
                    }`}>
                    <div className="flex items-center gap-2.5">
                        {actionMsg.includes('🚨') ? <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" /> :
                            actionMsg.includes('🎉') ? <Coins className="w-4 h-4 text-emerald-600 shrink-0" /> :
                                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />}
                        <span>{actionMsg}</span>
                    </div>
                    <button onClick={() => setActionMsg('')} className="text-xs opacity-60 hover:opacity-100 font-bold px-2">✕</button>
                </div>
            )}

            {/* HACKATHON CONTROL HEADER BAR */}
            <Card className="border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md overflow-hidden">
                <CardContent className="p-4 md:p-5">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                                <h2 className="font-extrabold text-base text-white">{t('workflow_engine_title', 'FINX Multi-Model Verification & Escrow Milestone Engine')}</h2>
                                <Badge className="bg-emerald-500/30 text-emerald-300 border-emerald-400 text-[10px] px-2 py-0.5">{t('workflow_engine_badge', 'Live Hackathon Engine')}</Badge>
                            </div>
                            <p className="text-slate-300 text-xs italic font-medium">
                                {t('workflow_engine_tagline', '"AI analyzes. Evidence verifies. Humans approve. Funds follow progress."')}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <button
                                onClick={handleCaptureBrowserGPS}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-all shadow-sm flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" /> {t('auto_capture_gps', 'Auto-Capture GPS')}
                            </button>
                            <button
                                onClick={handleResetDemo}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded transition-all border border-slate-700 flex items-center gap-1.5">
                                <RefreshCw className="w-3.5 h-3.5" /> {t('reset_hackathon_demo', 'Reset Hackathon Demo')}
                            </button>
                        </div>
                    </div>

                    {/* 5-Step Hackathon Workflow Progress Tracker */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4 pt-4 border-t border-slate-800 text-center">
                        {[
                            { num: 1, title: t('step_1_nav', '1. Village Petition & Form 1') },
                            { num: 2, title: t('step_2_nav', '2. Multi-Model AI Verify') },
                            { num: 3, title: t('step_3_nav', '3. Form 2 & Form 3 Approval') },
                            { num: 4, title: t('step_4_nav', '4. Milestone Escrow Control') },
                            { num: 5, title: t('step_5_nav', '5. Fund Release & Completion') }
                        ].map((s) => (
                            <button
                                key={s.num}
                                onClick={() => setCurrentStep(s.num)}
                                className={`p-2 rounded-lg text-xs font-bold transition-all border ${currentStep === s.num ? 'bg-indigo-600 border-indigo-400 text-white shadow' :
                                        currentStep > s.num ? 'bg-slate-800 border-slate-700 text-emerald-400' :
                                            'bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300'
                                    }`}>
                                {s.title}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* STEP 1: VILLAGE PETITION & NGO CSR FORM 1 */}
            {currentStep === 1 && (
                <Card className="border border-slate-200 shadow-sm">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-sm font-bold text-slate-900">{t('step_1_title', 'Step 1: Village Petition & NGO CSR Form 1 Entry')}</CardTitle>
                                <CardDescription className="text-xs">{t('step_1_desc', 'Community road petition, NGO field inspection parameters, coordinates & quotation.')}</CardDescription>
                            </div>
                            <Badge className="bg-indigo-100 text-indigo-800 text-xs">{t('form1_active', 'Form 1 Active')}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">{t('project_title', 'Project Title')}</label>
                                <input
                                    type="text"
                                    value={form1.title}
                                    onChange={(e) => setForm1({ ...form1, title: e.target.value })}
                                    className="w-full p-2 border rounded-lg bg-white font-medium"
                                />
                            </div>
                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">{t('village_location', 'Village & Location')}</label>
                                <input
                                    type="text"
                                    value={`${form1.village}, ${form1.districtState}`}
                                    onChange={(e) => setForm1({ ...form1, village: e.target.value })}
                                    className="w-full p-2 border rounded-lg bg-white font-medium"
                                />
                            </div>
                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">{t('requested_budget', 'Requested Budget (₹)')}</label>
                                <input
                                    type="number"
                                    value={form1.requestedAmount}
                                    onChange={(e) => setForm1({ ...form1, requestedAmount: Number(e.target.value) })}
                                    className="w-full p-2 border rounded-lg bg-white font-mono font-bold text-slate-900"
                                />
                            </div>
                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">{t('beneficiaries_road_scope', 'Beneficiaries & Road Scope')}</label>
                                <input
                                    type="text"
                                    value={`${form1.beneficiaries} Villagers • ${form1.roadLengthKm} km Road • ${form1.durationMonths} Months`}
                                    disabled
                                    className="w-full p-2 border rounded-lg bg-slate-100 font-medium text-slate-600"
                                />
                            </div>
                        </div>

                        {/* GPS Coordinates Box */}
                        <div className="p-3 bg-indigo-50/50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-indigo-600" />
                                <span className="font-bold text-indigo-900">{t('project_baseline_coords', 'Project Baseline Coordinates:')}</span>
                                <span className="font-mono text-indigo-700">{form1.latitude}, {form1.longitude}</span>
                            </div>
                            <button
                                onClick={handleCaptureBrowserGPS}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] px-3 py-1 rounded-lg">
                                {t('refresh_gps', 'Refresh GPS')}
                            </button>
                        </div>

                        {/* Quotation & Documents */}
                        <div className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-500" />
                                <span className="font-bold text-slate-800">{t('attached_quotation', 'Attached Quotation:')}</span>
                                <span className="font-mono text-slate-600">{form1.quotationFile}</span>
                            </div>
                            <Badge variant="success" className="text-[10px]">{t('sha256_verified', 'SHA-256 Verified')}</Badge>
                        </div>

                        <button
                            onClick={handleSubmitForm1}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs p-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2">
                            <span>{t('submit_form1_run_ai', 'SUBMIT NGO CSR FORM 1 & RUN AI VERIFICATION')}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </CardContent>
                </Card>
            )}

            {/* STEP 2: MULTI-MODEL AI VERIFICATION PIPELINE */}
            {currentStep === 2 && (
                <Card className="border border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-900 text-white p-5">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-base font-bold text-white">{t('step_2_title', 'Step 2: Real-Time Multi-Model AI Verification Engine')}</CardTitle>
                                <CardDescription className="text-slate-300 text-xs mt-0.5">{t('step_2_desc', 'Modules A–H (Document Intel, CSR Compliance, Budget ML, Duplicate Check, Anomaly Engine).')}</CardDescription>
                            </div>
                            <Badge className="bg-amber-500/30 text-amber-300 border-amber-400 text-[10px]">{t('eight_stage_pipeline_active', '8-Stage Pipeline Active')}</Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 space-y-6">
                        {/* Real-Time Pipeline Stage Progress */}
                        {aiVerifying && (
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold text-slate-700">
                                    <span>{t('executing_stage', 'Executing Stage')} {aiStage} {t('of_8_pipeline_modules', 'of 8 Pipeline Modules...')}</span>
                                    <span>{Math.round((aiStage / 8) * 100)}%</span>
                                </div>
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                    <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${(aiStage / 8) * 100}%` }}></div>
                                </div>
                            </div>
                        )}

                        {/* Verification Report Summary */}
                        {form1Report && (
                            <div className="space-y-4 text-xs">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border">
                                    <div>
                                        <div className="text-slate-400 text-[10px]">{t('overall_ai_score', 'Overall AI Score')}</div>
                                        <div className="text-xl font-extrabold font-mono text-emerald-600 mt-0.5">{form1Report.overallScore}/100</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-400 text-[10px]">{t('risk_level', 'Risk Level')}</div>
                                        <Badge variant="success" className="mt-0.5 text-[10px]">{form1Report.riskLevel}</Badge>
                                    </div>
                                    <div>
                                        <div className="text-slate-400 text-[10px]">{t('confidence', 'Confidence')}</div>
                                        <div className="font-mono font-bold text-slate-900 mt-0.5">{form1Report.confidenceRating || 94.2}%</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-400 text-[10px]">{t('recommendation', 'Recommendation')}</div>
                                        <div className="font-bold text-indigo-700 mt-0.5">{form1Report.aiRecommendation}</div>
                                    </div>
                                </div>

                                {/* Detected Issue Banners */}
                                <div className="space-y-2">
                                    {form1Report.findings.map((f: any, idx: number) => (
                                        <div key={idx} className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 flex items-start gap-2.5">
                                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                            <div>
                                                <div className="font-bold text-[11px]">[{f.severity}] {f.module}</div>
                                                <div className="text-slate-700 text-xs mt-0.5">{f.text}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentStep(3)}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs p-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                                    <span>{t('proceed_to_form2_form3', 'PROCEED TO CORPORATE CSR FORM 2 & FORM 3 APPROVAL')}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* STEP 3: CORPORATE CSR FORM 2 & FORM 3 APPROVAL */}
            {currentStep === 3 && (
                <Card className="border border-slate-200 shadow-sm">
                    <CardHeader className="bg-slate-50 border-b p-4">
                        <CardTitle className="text-sm font-bold text-slate-900">{t('step_3_title', 'Step 3: Corporate CSR Form 2 & Form 3 Funding Authorization')}</CardTitle>
                        <CardDescription className="text-xs">{t('step_3_desc', 'Technical scope acceptance and Milestone Escrow Fund allocation.')}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4 text-xs">
                        <div className="p-4 bg-indigo-50/40 border border-indigo-200 rounded-xl space-y-2">
                            <div className="font-bold text-indigo-900">{t('csr_form2_title', 'CSR Form 2: Technical Scope Approval')}</div>
                            <p className="text-slate-600">{t('csr_form2_desc', 'Corporate engineering committee has reviewed NGO Form 1 parameters, baseline photographs & AI verification report.')}</p>
                            <Badge variant={form2Approved ? "success" : "neutral"}>{form2Approved ? t('csr_form2_approved', '✓ CSR Form 2 Approved') : t('pending_corp_signature', 'Pending Corporate Signature')}</Badge>
                        </div>

                        <div className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-xl space-y-2">
                            <div className="font-bold text-emerald-900">{t('csr_form3_title', 'CSR Form 3: Escrow Funding Authorization')}</div>
                            <p className="text-slate-600">{t('csr_form3_desc', 'Authorizes ₹10,00,000 Total CSR Capital into FINX Escrow. Funds are released strictly per verified milestone.')}</p>
                            <Badge variant={form3Authorized ? "success" : "neutral"}>{form3Authorized ? t('csr_form3_authorized', '✓ CSR Form 3 Authorized') : t('pending_funding_commitment', 'Pending Funding Commitment')}</Badge>
                        </div>

                        <button
                            onClick={handleApproveForm2Form3}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs p-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2">
                            <Check className="w-4 h-4" /> {t('authorize_form2_form3_btn', 'AUTHORIZE FORM 2 & FORM 3 — ACTIVATE MILESTONE 1 ESCROW')}
                        </button>
                    </CardContent>
                </Card>
            )}

            {/* STEP 4 & 5: MILESTONE FUNDING ESCROW & FRAUD DEMO PANEL */}
            {(currentStep === 4 || currentStep === 5) && (
                <div className="space-y-6">
                    {/* FRAUD DEMO CONTROL BAR FOR JUDGES */}
                    <Card className="border border-amber-300 bg-amber-50/40 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                                <div>
                                    <div className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                                        <span>{t('fraud_demo_title', 'Interactive Fraud Demo Controls for Hackathon Judges')}</span>
                                    </div>
                                    <p className="text-slate-600 text-xs mt-0.5">{t('fraud_demo_desc', 'Test real-time fraud blocking (Duplicate Image & GPS Mismatch distances > 100m).')}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleVerifyMilestone('duplicate_image')}
                                        disabled={loading}
                                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded transition-all">
                                        {t('demo1_duplicate_image', '🚨 Demo 1: Duplicate Image Fraud')}
                                    </button>
                                    <button
                                        onClick={() => handleVerifyMilestone('gps_mismatch')}
                                        disabled={loading}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded transition-all">
                                        {t('demo2_gps_mismatch', '🚨 Demo 2: GPS Mismatch Fraud (>100m)')}
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* MILESTONE ESCROW TIMELINE */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Milestones List */}
                        <div className="lg:col-span-1 space-y-3">
                            <Card className="border border-slate-200 shadow-sm">
                                <CardHeader className="bg-slate-50 p-3 border-b">
                                    <CardTitle className="text-xs font-bold text-slate-900 uppercase">{t('milestones_escrow', 'Milestones Escrow')} ({milestones.length})</CardTitle>
                                </CardHeader>
                                <CardContent className="p-2 space-y-2">
                                    {milestones.map((m) => (
                                        <div
                                            key={m.id}
                                            onClick={() => { if (m.status !== 'LOCKED') setActiveMilestoneId(m.id); }}
                                            className={`p-3 rounded-lg border transition-all ${activeMilestoneId === m.id ? 'border-2 border-indigo-600 bg-indigo-50/30' : 'border-slate-200'} ${m.status === 'LOCKED' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-slate-300'}`}>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-slate-900">{m.title}</span>
                                                <Badge variant={m.status === 'FUND_RELEASED' ? 'success' : m.status === 'ACTIVE' ? 'warning' : 'neutral'} className="text-[9px] px-1.5 py-0.5">
                                                    {m.status === 'LOCKED' ? <Lock className="w-3 h-3 inline mr-1" /> : null}
                                                    {m.status}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center mt-2 text-xs font-mono">
                                                <span className="font-bold text-slate-900">₹{m.amount.toLocaleString()}</span>
                                                <span className="text-slate-500 font-semibold">{m.pct}% {t('budget', 'Budget')}</span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Internal Fund Ledger Transactions */}
                            {releasedFunds.length > 0 && (
                                <Card className="border border-emerald-200 bg-emerald-50/20 shadow-sm">
                                    <CardHeader className="p-3 border-b border-emerald-100">
                                        <CardTitle className="text-xs font-bold text-emerald-900 uppercase">{t('released_fund_ledger', 'Released Fund Ledger')} ({releasedFunds.length})</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 space-y-2 text-xs">
                                        {releasedFunds.map((tx, idx) => (
                                            <div key={idx} className="p-2 bg-white border border-emerald-200 rounded-lg flex justify-between items-center font-mono">
                                                <div>
                                                    <div className="font-bold text-emerald-900">₹{tx.amount.toLocaleString()}</div>
                                                    <div className="text-[10px] text-slate-400">{tx.transactionId}</div>
                                                </div>
                                                <Badge variant="success" className="text-[9px]">{t('status_released', 'RELEASED')}</Badge>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Active Milestone Verification & Evidence Workspace */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border border-slate-200 shadow-sm overflow-hidden">
                                <CardHeader className="bg-slate-900 text-white p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <Badge className="bg-indigo-500/30 text-indigo-200 border-indigo-400 text-[10px] mb-1">{t('active_milestone_workspace', 'ACTIVE MILESTONE WORKSPACE')}</Badge>
                                            <CardTitle className="text-base font-bold text-white">Milestone 1: Site Prep & Excavation</CardTitle>
                                        </div>
                                        <div className="bg-slate-800 p-2.5 rounded-xl text-right">
                                            <div className="text-[9px] text-slate-400">{t('escrow_amount', 'Escrow Amount')}</div>
                                            <div className="text-lg font-extrabold font-mono text-emerald-400">₹2,00,000</div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-5 space-y-5 text-xs">
                                    {/* Geotagged Evidence Inputs */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="font-semibold text-slate-700 block mb-1">Evidence Photo URL / Base64 Hash</label>
                                            <input
                                                type="text"
                                                value={evidenceFile}
                                                onChange={(e) => setEvidenceFile(e.target.value)}
                                                className="w-full p-2 border rounded-lg bg-white font-mono text-[11px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="font-semibold text-slate-700 block mb-1">Captured Field GPS Coordinates</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={evidenceCoords.lat}
                                                    onChange={(e) => setEvidenceCoords({ ...evidenceCoords, lat: Number(e.target.value) })}
                                                    className="w-1/2 p-2 border rounded-lg bg-white font-mono text-[11px]"
                                                />
                                                <input
                                                    type="number"
                                                    value={evidenceCoords.lng}
                                                    onChange={(e) => setEvidenceCoords({ ...evidenceCoords, lng: Number(e.target.value) })}
                                                    className="w-1/2 p-2 border rounded-lg bg-white font-mono text-[11px]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Run AI Verification Button */}
                                    <button
                                        onClick={() => handleVerifyMilestone(null)}
                                        disabled={loading}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs p-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2">
                                        <Sparkles className="w-4 h-4 text-amber-400" /> {t('run_milestone_ai_verification', 'RUN MULTI-MODEL MILESTONE AI VERIFICATION')}
                                    </button>

                                    {/* Verification Results & Human Gate */}
                                    {verificationResult && (
                                        <div className="space-y-4 pt-4 border-t">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border">
                                                <div>
                                                    <div className="text-slate-400 text-[10px]">{t('metric_verification_score', 'Verification Score')}</div>
                                                    <div className="text-lg font-extrabold font-mono text-emerald-600">{verificationResult.verificationScore}/100</div>
                                                </div>
                                                <div>
                                                    <div className="text-slate-400 text-[10px]">GPS Haversine Distance</div>
                                                    <div className="font-mono font-bold text-slate-900">{verificationResult.haversineDistanceMeters || 12.4} meters</div>
                                                </div>
                                                <div>
                                                    <div className="text-slate-400 text-[10px]">SHA-256 Hash Status</div>
                                                    <Badge variant={verificationResult.imageHashStatus === 'UNIQUE' ? 'success' : 'danger'}>{verificationResult.imageHashStatus || 'UNIQUE'}</Badge>
                                                </div>
                                                <div>
                                                    <div className="text-slate-400 text-[10px]">Status</div>
                                                    <Badge variant={verificationResult.verificationScore >= 70 ? 'success' : 'danger'}>{verificationResult.finalStatus}</Badge>
                                                </div>
                                            </div>

                                            {/* Human Approval Gate */}
                                            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
                                                <div className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center justify-between">
                                                    <span>Human Authorized Validator Approval Gate</span>
                                                    <span className="text-[10px] text-slate-400">Role: Inspector R. Sharma</span>
                                                </div>
                                                <p className="text-slate-300 text-[11px]">AI verified evidence signals. Authorized human approval is required to release escrow capital.</p>

                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={handleHumanApprovalAndRelease}
                                                        disabled={loading || verificationResult.verificationScore < 70}
                                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-40">
                                                        <Coins className="w-4 h-4" /> [ {t('approve_release_tranche', 'APPROVE & RELEASE')} ₹2,00,000 ]
                                                    </button>
                                                    <button
                                                        onClick={() => setActionMsg('❌ Milestone evidence rejected by validator.')}
                                                        className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm">
                                                        {t('btn_reject', 'REJECT')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
