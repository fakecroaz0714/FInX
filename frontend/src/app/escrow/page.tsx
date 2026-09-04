'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FileCheck2, Lock, Unlock, Camera, ArrowRight, ShieldCheck, History, X, CheckCircle2, Copy, Check, FileText, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface EvidencePhoto {
    url: string;
    caption: string;
    gps: string;
    time: string;
    cadastralMatch: string;
}

interface EscrowMilestone {
    id: number;
    title: string;
    amount: number;
    formattedAmount: string;
    status: 'Released' | 'Reviewing' | 'Locked';
    date: string;
    proof: string;
    description: string;
    photos: EvidencePhoto[];
    invoice: {
        url: string;
        number: string;
        supplier: string;
        gstin: string;
        amount: string;
        items: string;
        hsn: string;
    };
    surveyor: {
        name: string;
        id: string;
        hash: string;
    };
}

export default function EscrowPage() {
    const { t } = useLanguage();

    const [milestones, setMilestones] = useState<EscrowMilestone[]>([
        {
            id: 1,
            title: "Initial Feasibility & Setup",
            amount: 12500,
            formattedAmount: "₹12,500",
            status: "Released",
            date: "Oct 12, 2024",
            proof: "Survey Report Verified",
            description: "Soil geotechnical investigation and village cadastral boundary verification completed by field surveyor.",
            photos: [
                {
                    url: "/proofs/val-nsk-112-1.jpg",
                    caption: "Drone Orthomosaic Survey & Cadastral Plot Boundary Mapping",
                    gps: "18.520412° N, 73.856719° E",
                    time: "12-Oct-2024 09:45 AM IST",
                    cadastralMatch: "99.8%"
                },
                {
                    url: "/proofs/val-pun-084-1.jpg",
                    caption: "Geotechnical Borehole Soil Core Investigation & Aquifer Test",
                    gps: "18.520390° N, 73.856730° E",
                    time: "12-Oct-2024 02:15 PM IST",
                    cadastralMatch: "99.4%"
                }
            ],
            invoice: {
                url: "/invoices/gst-tax-invoice-geotech-survey.svg",
                number: "GT-2024-112",
                supplier: "Maharashtra GeoTech Labs & Surveyors",
                gstin: "27AABCM9182C1Z4",
                amount: "₹12,500.00",
                items: "Soil Core Boring (4 Boreholes) + DGPS RTK Survey + NABL Water Lab Profile",
                hsn: "HSN 998341"
            },
            surveyor: {
                name: "Dr. Vikram Deshpande (GeoTech Lead)",
                id: "VAL-GEO-104",
                hash: "0x51b4e9f78...da12"
            }
        },
        {
            id: 2,
            title: "Equipment Procurement & Foundation",
            amount: 25000,
            formattedAmount: "₹25,000",
            status: "Reviewing",
            date: "Submitted 02-Sep-2026",
            proof: "Invoices & Geotags Submitted",
            description: "120 cement bags, TMT Fe550D rebar, and solar submersible pump delivery verified on-site.",
            photos: [
                {
                    url: "/proofs/val-str-047-1.jpg",
                    caption: "Material Staging: 120 Bags UltraTech Cement & Tata Tiscon Fe550D TMT Steel",
                    gps: "18.520432° N, 73.856744° E",
                    time: "02-Sep-2026 11:30 AM IST",
                    cadastralMatch: "99.2%"
                },
                {
                    url: "/proofs/val-mum-209-2.jpg",
                    caption: "Ground Excavation, Trenching & Heavy HDPE Water Pipeline Delivery",
                    gps: "18.520410° N, 73.856760° E",
                    time: "02-Sep-2026 01:15 PM IST",
                    cadastralMatch: "98.9%"
                },
                {
                    url: "/proofs/val-pun-084-1.jpg",
                    caption: "Reinforced Concrete Foundation Slab Pour & Spillway Drainage Bedding",
                    gps: "18.520445° N, 73.856725° E",
                    time: "02-Sep-2026 04:40 PM IST",
                    cadastralMatch: "99.5%"
                }
            ],
            invoice: {
                url: "/invoices/gst-tax-invoice-shree-balaji.svg",
                number: "INV-2024-884",
                supplier: "Shree Balaji Building Materials",
                gstin: "27AAAAA0000A1Z5",
                amount: "₹25,000.00",
                items: "120 Bags UltraTech Cement, 0.8 MT Tata Fe550D TMT Steel, 2 Brass River Sand",
                hsn: "HSN 2523 / 7214 / 2505"
            },
            surveyor: {
                name: "Rajesh Kulkarni (Civil Auditor)",
                id: "VAL-CIVIL-884",
                hash: "0x82f0c11...ba92"
            }
        },
        {
            id: 3,
            title: "Installation, Commissioning & Training",
            amount: 12500,
            formattedAmount: "₹12,500",
            status: "Locked",
            date: "Est. Oct 2026",
            proof: "Pending Milestone 2 completion",
            description: "Solar mounting, reverse osmosis filter installation, and village water user committee training.",
            photos: [
                {
                    url: "/proofs/val-ahm-163-1.jpg",
                    caption: "1.5 HP Solar PV Mounting Array & Smart Variable Frequency Inverter",
                    gps: "18.520460° N, 73.856780° E",
                    time: "Scheduled Oct-2026",
                    cadastralMatch: "Verified Geo-Fence"
                },
                {
                    url: "/proofs/val-mum-209-1.jpg",
                    caption: "500 LPH Multi-Stage RO Filtration Plant & Kiosk Superstructure Framing",
                    gps: "18.520420° N, 73.856750° E",
                    time: "Scheduled Oct-2026",
                    cadastralMatch: "Verified Geo-Fence"
                },
                {
                    url: "/proofs/val-mum-209-3.jpg",
                    caption: "Smart RFID Water Dispenser Valve Manifold & IoT Digital Flow Meter",
                    gps: "18.520435° N, 73.856740° E",
                    time: "Scheduled Oct-2026",
                    cadastralMatch: "Verified Geo-Fence"
                }
            ],
            invoice: {
                url: "/invoices/gst-tax-invoice-solar-ro-filtration.svg",
                number: "ST-2024-509",
                supplier: "SuryaShakti Water & Renewables Pvt Ltd",
                gstin: "27AAACS4921K1ZM",
                amount: "₹12,500.00",
                items: "1.5 HP Solar Submersible Pump, 500 LPH RO Filtration Skid, IoT Flow Dispenser",
                hsn: "HSN 8413 / 8421 / 9026"
            },
            surveyor: {
                name: "Amit Patil (Solar Water Systems Lead)",
                id: "VAL-SOLAR-339",
                hash: "0x44a9e2...cf80"
            }
        }
    ]);

    const [notification, setNotification] = useState<string | null>(null);
    const [showEvidenceModal, setShowEvidenceModal] = useState(false);
    const [showExplorerModal, setShowExplorerModal] = useState(false);
    const [selectedMilestone, setSelectedMilestone] = useState<EscrowMilestone | null>(null);
    const [activeModalTab, setActiveModalTab] = useState<'photos' | 'invoice'>('photos');
    const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number>(0);
    const [copied, setCopied] = useState(false);

    const totalBudget = 50000;
    const releasedSum = milestones.filter(m => m.status === 'Released').reduce((sum, m) => sum + m.amount, 0);
    const remainingSum = totalBudget - releasedSum;
    const progressPercent = Math.round((releasedSum / totalBudget) * 100);

    const handleOpenEvidence = (m: EscrowMilestone, tab: 'photos' | 'invoice' = 'photos') => {
        setSelectedMilestone(m);
        setActiveModalTab(tab);
        setSelectedPhotoIdx(0);
        setShowEvidenceModal(true);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleApproveRelease = (milestoneId: number) => {
        setMilestones(prev => prev.map(m => {
            if (m.id === milestoneId) {
                return {
                    ...m,
                    status: 'Released' as const,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    proof: 'Verified on-chain & Released'
                };
            }
            return m;
        }));

        setShowEvidenceModal(false);
        setNotification(`Milestone ${milestoneId} approved! Tranche ₹25,000 released from smart escrow. Tx Hash: 0x7f83a...91b4`);
        setTimeout(() => setNotification(null), 6000);
    };

    return (
        <div className="p-8 pb-20 max-w-7xl mx-auto space-y-6">
            {notification && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{notification}</span>
                    </div>
                    <button onClick={() => setNotification(null)} className="text-slate-500 hover:text-slate-800">✕</button>
                </div>
            )}

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('smart_escrow_controls_title', 'Smart Escrow Controls')}</h1>
                    <p className="text-slate-500 mt-1 text-xs md:text-sm font-medium">{t('smart_escrow_controls_sub', 'Manage milestone-based fund releases backed by verified impact claims.')}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => setShowExplorerModal(true)}
                        className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                    >
                        <History className="w-3.5 h-3.5 text-indigo-600" /> Contract Explorer
                    </button>
                    <a href="/verified-milestones" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition">
                        <ShieldCheck className="w-4 h-4" /> {t('open_proof_engine', 'Open Proof Engine')}
                    </a>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Left: Contract Header & Milestone List */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-slate-200 shadow-sm overflow-hidden text-sm">
                        <CardHeader className="bg-slate-900 text-white pb-6 pt-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <Badge className="bg-indigo-500/30 text-indigo-200 border-indigo-400 mb-2 text-[11px]">Contract Active</Badge>
                                    <CardTitle className="text-xl text-white">Clean Water Initiative - Pune</CardTitle>
                                    <CardDescription className="text-slate-400 mt-1 flex items-center gap-2 font-mono text-xs">
                                        <span>Contract: 0x8F92a34bc4812f8a9e</span>
                                        <button
                                            onClick={() => handleCopy("0x8F92a34bc4812f8a9e")}
                                            className="text-indigo-400 hover:text-white"
                                            title="Copy Contract Address"
                                        >
                                            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                        </button>
                                    </CardDescription>
                                </div>
                                <div className="text-right">
                                    <div className="text-indigo-200 text-xs uppercase tracking-wider font-semibold mb-1">Total Locked</div>
                                    <div className="text-2xl font-bold font-mono">₹{totalBudget.toLocaleString('en-IN')}</div>
                                </div>
                            </div>

                            <div className="w-full bg-slate-800 rounded-full h-2.5 mt-4 overflow-hidden">
                                <div
                                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                                <span className="text-emerald-400 font-bold">₹{releasedSum.toLocaleString('en-IN')} Released ({progressPercent}%)</span>
                                <span>₹{remainingSum.toLocaleString('en-IN')} Remaining</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {milestones.map((m) => (
                                    <div
                                        key={m.id}
                                        className={`p-6 flex items-start gap-4 transition ${
                                            m.status === 'Reviewing' ? 'bg-amber-50/30' : 'hover:bg-slate-50/60'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                            m.status === 'Released' ? 'bg-emerald-100 text-emerald-600' :
                                            m.status === 'Reviewing' ? 'bg-amber-100 text-amber-600 animate-pulse' :
                                            'bg-slate-100 text-slate-400'
                                        }`}>
                                            {m.status === 'Released' ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-slate-900 text-base">Milestone {m.id}: {m.title}</h4>
                                                <span className="font-mono font-bold text-slate-900">{m.formattedAmount}</span>
                                            </div>

                                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{m.description}</p>

                                            <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs">
                                                <Badge variant={
                                                    m.status === 'Released' ? 'success' :
                                                    m.status === 'Reviewing' ? 'warning' : 'neutral'
                                                }>
                                                    {m.status}
                                                </Badge>
                                                <span className="text-slate-400">&bull;</span>
                                                <span className="text-slate-500 flex items-center gap-1 font-mono">
                                                    <History className="w-3.5 h-3.5 text-slate-400" />
                                                    {m.date}
                                                </span>
                                                <span className="text-slate-400">&bull;</span>
                                                <span className="text-slate-600 font-semibold">{m.proof}</span>
                                            </div>

                                            {/* Action buttons based on status */}
                                            {m.status === 'Released' && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() => handleOpenEvidence(m, 'photos')}
                                                        className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                                                    >
                                                        <Camera className="w-3.5 h-3.5 text-emerald-600" /> View Field Photos ({m.photos.length})
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenEvidence(m, 'invoice')}
                                                        className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                                                    >
                                                        <FileText className="w-3.5 h-3.5 text-indigo-600" /> View Tax Invoice
                                                    </button>
                                                </div>
                                            )}

                                            {/* Proof Submission Actions for Reviewing Milestone */}
                                            {m.status === 'Reviewing' && (
                                                <div className="mt-4 bg-white border border-amber-200 rounded-xl p-4 shadow-2xs space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                                            <Camera className="w-3.5 h-3.5 text-amber-600" /> Proof Submission Awaiting Corporate Sign-Off
                                                        </span>
                                                        <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                            RTK GPS Matched
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-600 text-xs leading-relaxed">
                                                        Implementing NGO Jal Seva has uploaded verified procurement invoices and geocoded site photographs of cement and rebar staging.
                                                    </p>
                                                    <div className="flex gap-2.5 pt-1">
                                                        <button
                                                            onClick={() => handleOpenEvidence(m, 'photos')}
                                                            className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-2 rounded-lg font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                                                        >
                                                            <FileText className="w-3.5 h-3.5 text-indigo-600" /> View Evidence & Invoices
                                                        </button>
                                                        <button
                                                            onClick={() => handleApproveRelease(m.id)}
                                                            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 py-2 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                                                        >
                                                            <ShieldCheck className="w-3.5 h-3.5" /> Approve Tranche Release
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {m.status === 'Locked' && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() => handleOpenEvidence(m, 'photos')}
                                                        className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                                                    >
                                                        <Camera className="w-3.5 h-3.5 text-slate-500" /> Preview Site Plan & Equipment
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenEvidence(m, 'invoice')}
                                                        className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                                                    >
                                                        <FileText className="w-3.5 h-3.5 text-slate-500" /> Purchase Order & Proforma
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Blockchain Prototype Explorer */}
                <div className="space-y-6">
                    <Card className="border border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-bold text-slate-900">Blockchain Prototype</CardTitle>
                                <CardDescription className="text-xs">Solidity Escrow State</CardDescription>
                            </div>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                        </CardHeader>
                        <CardContent className="p-5 font-mono text-xs bg-slate-950 text-slate-300 rounded-b-xl overflow-hidden space-y-2">
                            <div className="text-indigo-400 font-bold">// Network: Hardhat Local / Polygon L2</div>
                            <div className="text-emerald-400 opacity-90">➔ Contract Initialized: 0x8F9...3B1A</div>
                            <div className="text-emerald-400 opacity-90">➔ Fund Deposit Confirmed: 50K INR Escrow</div>
                            <div className="text-emerald-400 opacity-90">➔ Milestone 1 Unlock Event Fired (₹12,500)</div>

                            {milestones.find(m => m.id === 2)?.status === 'Released' ? (
                                <div className="text-emerald-400 font-bold">➔ Milestone 2 Released: ₹25,000 Tx 0x7f8...</div>
                            ) : (
                                <div className="text-amber-400 animate-pulse">➔ Awaiting corporate multisig for M2 (₹25,000)...</div>
                            )}

                            <div
                                onClick={() => setShowExplorerModal(true)}
                                className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-slate-400 hover:text-white cursor-pointer transition text-xs font-semibold"
                            >
                                <span>Inspect Full Block Explorer</span>
                                <ArrowRight className="w-4 h-4 text-indigo-400" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Escrow Terms & Rules */}
                    <Card className="border border-slate-200 shadow-sm p-4 text-xs space-y-2">
                        <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-indigo-600" /> Escrow Security Invariants
                        </h4>
                        <ul className="text-slate-600 space-y-1.5 list-disc pl-4 text-[11px] leading-relaxed">
                            <li>Non-custodial smart contract deployed on EVM.</li>
                            <li>Funds locked until physical and GIS geo-evidence matches cadastral bounds.</li>
                            <li>Multi-sig release requiring both Validator attestation and Corporate CSR authorization.</li>
                        </ul>
                    </Card>
                </div>
            </div>

            {/* =========================================================================
                MODAL 1: EVIDENCE & INVOICE INSPECTION
               ========================================================================= */}
            {showEvidenceModal && (() => {
                const activeM = selectedMilestone || milestones.find(m => m.id === 2) || milestones[0];
                const activePhoto = activeM.photos[selectedPhotoIdx] || activeM.photos[0];

                return (
                    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[92vh] overflow-y-auto text-xs">
                            {/* Modal Header */}
                            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge
                                            variant={
                                                activeM.status === 'Released' ? 'success' :
                                                activeM.status === 'Reviewing' ? 'warning' : 'neutral'
                                            }
                                            className="text-[10px]"
                                        >
                                            {activeM.status} &bull; Milestone {activeM.id}
                                        </Badge>
                                        <span className="font-mono font-bold text-slate-700">{activeM.formattedAmount}</span>
                                        <span className="text-slate-400">&bull;</span>
                                        <span className="text-slate-500 font-mono text-[11px]">Contract 0x8F92...</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">{activeM.title}</h3>
                                </div>
                                <button
                                    onClick={() => setShowEvidenceModal(false)}
                                    className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Dual Tabs Switcher: Photos vs Invoice */}
                            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                                <button
                                    onClick={() => setActiveModalTab('photos')}
                                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                                        activeModalTab === 'photos'
                                            ? 'bg-indigo-600 text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    <Camera className="w-4 h-4" />
                                    <span>Geotagged Site Evidence</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                        activeModalTab === 'photos' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                        {activeM.photos.length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveModalTab('invoice')}
                                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                                        activeModalTab === 'invoice'
                                            ? 'bg-indigo-600 text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>Scanned GST Tax Invoice</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                        activeModalTab === 'invoice' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                        1
                                    </span>
                                </button>
                            </div>

                            {/* TAB 1: FIELD PHOTOS GALLERY */}
                            {activeModalTab === 'photos' && (
                                <div className="space-y-4">
                                    {/* Main Selected Photo View */}
                                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 relative shadow-inner">
                                        <img
                                            src={activePhoto.url}
                                            alt={activePhoto.caption}
                                            className="w-full h-80 object-cover"
                                        />
                                        <div className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[10px] font-bold shadow-xs flex items-center gap-1">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span>RTK DGPS Verified (±1.2m)</span>
                                        </div>
                                        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/85 backdrop-blur-sm text-white px-3.5 py-2 rounded-lg text-[11px] font-mono border border-slate-700 flex flex-wrap items-center justify-between gap-2">
                                            <div>
                                                <span className="text-emerald-400 font-bold">GPS:</span> {activePhoto.gps} &bull; <span className="text-indigo-300 font-bold">Match:</span> {activePhoto.cadastralMatch}
                                            </div>
                                            <div className="text-slate-300">
                                                {activePhoto.time}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Photo Thumbnail Strip */}
                                    <div>
                                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                            Evidence Gallery &bull; Select Photo ({selectedPhotoIdx + 1} of {activeM.photos.length})
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {activeM.photos.map((photo, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedPhotoIdx(idx)}
                                                    className={`relative rounded-xl overflow-hidden border-2 transition text-left cursor-pointer group ${
                                                        selectedPhotoIdx === idx
                                                            ? 'border-indigo-600 shadow-md ring-2 ring-indigo-200'
                                                            : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                                                    }`}
                                                >
                                                    <img
                                                        src={photo.url}
                                                        alt={photo.caption}
                                                        className="w-full h-20 object-cover"
                                                    />
                                                    <div className="p-1.5 bg-white border-t border-slate-100">
                                                        <div className="text-[10px] font-bold text-slate-800 truncate">
                                                            {idx + 1}. {photo.caption}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Photo Metadata Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Observation Description</span>
                                            <div className="font-semibold text-slate-800 text-xs">{activePhoto.caption}</div>
                                            <div className="text-slate-500 text-[11px] mt-1 font-mono">Geo-Fence: Pune Rural &bull; Precision ±1.2m</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Attesting Field Surveyor</span>
                                            <div className="font-bold text-slate-800">{activeM.surveyor.name}</div>
                                            <div className="text-slate-500 text-[11px] mt-0.5">ID: {activeM.surveyor.id} &bull; Digitally Signed</div>
                                            <div className="text-indigo-600 font-mono text-[10px] mt-1 truncate">Hash: {activeM.surveyor.hash}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: SCANNED GST TAX INVOICE */}
                            {activeModalTab === 'invoice' && (
                                <div className="space-y-4">
                                    {/* Invoice Toolbar */}
                                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                            <span className="font-semibold text-slate-800 text-xs">
                                                Supplier: <strong className="text-slate-900">{activeM.invoice.supplier}</strong>
                                            </span>
                                            <span className="text-slate-300">|</span>
                                            <span className="font-mono text-[11px] text-slate-500">GSTIN: {activeM.invoice.gstin}</span>
                                        </div>
                                        <a
                                            href={activeM.invoice.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5 text-indigo-600" /> Open Full-Size Invoice
                                        </a>
                                    </div>

                                    {/* Scanned Invoice SVG Container */}
                                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-inner overflow-hidden max-h-[460px] overflow-y-auto">
                                        <img
                                            src={activeM.invoice.url}
                                            alt={`Scanned GST Tax Invoice - ${activeM.invoice.supplier}`}
                                            className="w-full h-auto rounded border border-slate-100 shadow-xs mx-auto"
                                        />
                                    </div>

                                    {/* Financial Breakdown Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Invoice Number & Code</span>
                                            <div className="font-bold text-slate-800">{activeM.invoice.number}</div>
                                            <div className="text-slate-500 text-[11px] font-mono mt-0.5">{activeM.invoice.hsn}</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Materials / Services Billed</span>
                                            <div className="font-semibold text-slate-800 text-[11px] line-clamp-2">{activeM.invoice.items}</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Audited Total</span>
                                            <div className="font-bold text-emerald-700 text-sm font-mono">{activeM.invoice.amount}</div>
                                            <div className="text-[10px] text-emerald-600 font-medium">100% Matched with Escrow Tranche</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Modal Footer */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Proofs cryptographically anchored to Polygon Smart Escrow.</span>
                                </div>

                                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                                    <button
                                        onClick={() => setShowEvidenceModal(false)}
                                        className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition cursor-pointer"
                                    >
                                        Close
                                    </button>
                                    {activeM.status === 'Reviewing' && (
                                        <button
                                            onClick={() => handleApproveRelease(activeM.id)}
                                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                                        >
                                            <ShieldCheck className="w-4 h-4" /> Approve & Release {activeM.formattedAmount}
                                        </button>
                                    )}
                                    {activeM.status === 'Released' && (
                                        <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-1.5">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Released On-Chain
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* =========================================================================
                MODAL 2: CONTRACT EXPLORER MODAL
               ========================================================================= */}
            {showExplorerModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                    <History className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">FINX Smart Escrow Explorer</h3>
                                    <p className="text-[11px] text-slate-400 font-mono">Contract 0x8F92a34bc4812f8a9e</p>
                                </div>
                            </div>
                            <button onClick={() => setShowExplorerModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] space-y-1.5">
                            <div className="text-emerald-400 font-bold">Block Height: #5,892,104 (Confirmed)</div>
                            <div>Gas Used: 142,390 units (0.0021 MATIC)</div>
                            <div>State: ACTIVE_ESCROW</div>
                            <div className="text-slate-400 truncate">Contract SHA: 0x9f83ac084e892cfa712d98124faee8921</div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Contract Event Logs</span>
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1 text-slate-700">
                                <div>1. MilestoneReleased(id: 1, amount: 12500, to: 0xJalSeva)</div>
                                <div>2. EvidenceSubmitted(id: 2, ipfs: "QmZ4tDuGb...", verified: true)</div>
                                {milestones.find(m => m.id === 2)?.status === 'Released' && (
                                    <div className="text-emerald-600 font-bold">3. MilestoneReleased(id: 2, amount: 25000, to: 0xJalSeva)</div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => setShowExplorerModal(false)}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition"
                        >
                            Close Explorer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
