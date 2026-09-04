'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import DashboardChart from "@/components/DashboardChart";
import { 
    Trees, Droplets, Users, BookOpen, Download, FileCheck, 
    ExternalLink, CheckCircle2, X, Sparkles, MapPin, ShieldCheck,
    BarChart3, Activity
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface ImpactAuditModalData {
    title: string;
    value: string;
    sub: string;
    telemetryTitle: string;
    metrics: { label: string; val: string }[];
    validationMethod: string;
    onChainHash: string;
    locations: string[];
}

export default function ImpactPage() {
    const { t } = useLanguage();
    const [selectedMetric, setSelectedMetric] = useState<ImpactAuditModalData | null>(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);

    const metricDetails: Record<string, ImpactAuditModalData> = {
        water: {
            title: "Clean Drinking Water Verified",
            value: "12,500 Beneficiaries",
            sub: "Rural communities across Haveli, Shirur, and Baramati",
            telemetryTitle: "IoT Smart Flow-Meter & Water Purity Telemetry",
            metrics: [
                { label: "Total Potable Liters Dispensed", val: "4,820,000 L" },
                { label: "Average Water TDS Reduction", val: "780 ppm ➔ 82 ppm" },
                { label: "Active Solar RO Kiosks", val: "14 Units" },
                { label: "NABL Lab Quality Cert", val: "ISO 10500:2012 Certified" }
            ],
            validationMethod: "Autonomous daily telemetry sync from IoT flow-sensors with tamper-proof hashing.",
            onChainHash: "0x3a9f...c891e4b0",
            locations: ["Haveli, Pune", "Shirur Village", "Baramati Zilla"]
        },
        trees: {
            title: "Verified Afforestation & Biomass",
            value: "45,000 Native Trees",
            sub: "Western Ghats catchment & community agroforestry zones",
            telemetryTitle: "Sentinel-2 Satellite NDVI Biomass Telemetry",
            metrics: [
                { label: "Hectares Restored", val: "120 Hectares" },
                { label: "NDVI Vegetation Index Gain", val: "+0.34 ΔNDVI" },
                { label: "Sapling Survival Rate", val: "94.2% Verified" },
                { label: "Carbon Offset Equivalent", val: "900 MT CO2e / yr" }
            ],
            validationMethod: "Bi-weekly ESA Sentinel-2 multispectral satellite imagery verified by Forest Department GIS.",
            onChainHash: "0x89ab...d72049fa",
            locations: ["Velhe Tehsil", "Katol Forest Belt", "Khed Watershed"]
        },
        education: {
            title: "Students Empowered via STEM & Solar",
            value: "3,200 Rural Students",
            sub: "42 Zilla Parishad & Tribal Welfare Schools",
            telemetryTitle: "School Attendance & Digital Lab Utilization Log",
            metrics: [
                { label: "Smart Solar Classrooms Built", val: "42 Classrooms" },
                { label: "Digital STEM Kits Distributed", val: "840 Kits" },
                { label: "STEM Activity Attendance Rate", val: "98.6%" },
                { label: "Science Fair Participation", val: "18 Gram Panchayats" }
            ],
            validationMethod: "Principal biometric sign-offs combined with geotagged tablet photo audits.",
            onChainHash: "0x12dc...f99014ba",
            locations: ["Pune Rural", "Nagpur Tribal Belt", "Satara District"]
        },
        communities: {
            title: "Self-Governing Gram Panchayats",
            value: "24 Rural Panchayats",
            sub: "Participating in FINX decentralised citizen monitoring",
            telemetryTitle: "Citizen Attestation & Social Audit Registry",
            metrics: [
                { label: "Active Citizen Verifiers", val: "1,420 Residents" },
                { label: "Public Grievance Resolution", val: "96.4%" },
                { label: "Escrow Multi-Sig Approvals", val: "68 Tranches" },
                { label: "Zero Discrepancy Rate", val: "98.8% Accurate" }
            ],
            validationMethod: "Citizen photo attestations checked with reverse image search and geotag coordinates.",
            onChainHash: "0x44cd...b10938ee",
            locations: ["Maharashtra Statewide", "Haveli Tehsil", "Nashik Division"]
        }
    };

    const handleExportAudit = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            setExportSuccess(true);
            setTimeout(() => {
                setExportSuccess(false);
                setIsExportModalOpen(false);
            }, 2500);
        }, 1500);
    };

    return (
        <div className="p-8 pb-20 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('impact_reports_title', 'Impact Reports')}</h1>
                    <p className="text-slate-500 mt-1">{t('impact_reports_sub', 'Aggregated platform outcomes, telemetry proofs, and statutory CSR audits.')}</p>
                </div>
                <button
                    onClick={() => setIsExportModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition shadow-sm flex items-center gap-2 cursor-pointer"
                >
                    <Download className="w-4 h-4" /> Export Audited ESG Report
                </button>
            </header>

            {/* Clickable KPI Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card 
                    onClick={() => setSelectedMetric(metricDetails.water)}
                    className="border border-blue-200 shadow-sm leading-normal bg-blue-50/50 hover:border-blue-400 hover:shadow-md transition cursor-pointer group"
                >
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                                <Droplets className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                Inspect Proof <ExternalLink className="w-3 h-3" />
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">12,500</div>
                        <div className="text-sm font-medium text-slate-600">{t('impact_clean_water', 'People got clean water')}</div>
                        <div className="text-[11px] text-slate-400 mt-2">IoT Flow-meter verified</div>
                    </CardContent>
                </Card>

                <Card 
                    onClick={() => setSelectedMetric(metricDetails.trees)}
                    className="border border-emerald-200 shadow-sm leading-normal bg-emerald-50/50 hover:border-emerald-400 hover:shadow-md transition cursor-pointer group"
                >
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
                                <Trees className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                Inspect Proof <ExternalLink className="w-3 h-3" />
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">45,000</div>
                        <div className="text-sm font-medium text-slate-600">{t('impact_trees_planted', 'Trees planted verified')}</div>
                        <div className="text-[11px] text-slate-400 mt-2">Satellite NDVI confirmed</div>
                    </CardContent>
                </Card>

                <Card 
                    onClick={() => setSelectedMetric(metricDetails.education)}
                    className="border border-indigo-200 shadow-sm leading-normal bg-indigo-50/50 hover:border-indigo-400 hover:shadow-md transition cursor-pointer group"
                >
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                Inspect Proof <ExternalLink className="w-3 h-3" />
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">3,200</div>
                        <div className="text-sm font-medium text-slate-600">{t('impact_students_supported', 'Students empowered')}</div>
                        <div className="text-[11px] text-slate-400 mt-2">42 Digital STEM labs</div>
                    </CardContent>
                </Card>

                <Card 
                    onClick={() => setSelectedMetric(metricDetails.communities)}
                    className="border border-amber-200 shadow-sm leading-normal bg-amber-50/50 hover:border-amber-400 hover:shadow-md transition cursor-pointer group"
                >
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
                                <Users className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                Inspect Proof <ExternalLink className="w-3 h-3" />
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">24</div>
                        <div className="text-sm font-medium text-slate-600">{t('impact_funds_verified', 'Communities supported')}</div>
                        <div className="text-[11px] text-slate-400 mt-2">1,420 Citizen Verifiers</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg">{t('sdg_alignment', 'Sustainable Development Goals (SDG) Alignment')}</CardTitle>
                        <CardDescription>Verified CSR capital allocation mapped to UN SDG Targets.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {[
                                { name: t('sdg_1', 'No Poverty (SDG 1)'), percent: 65, color: "bg-red-500", allocation: "₹18.4M" },
                                { name: t('sdg_4', 'Quality Education (SDG 4)'), percent: 80, color: "bg-rose-500", allocation: "₹24.6M" },
                                { name: t('sdg_6', 'Clean Water & Sanitation (SDG 6)'), percent: 92, color: "bg-cyan-500", allocation: "₹38.2M" },
                                { name: t('sdg_13', 'Climate Action (SDG 13)'), percent: 75, color: "bg-emerald-500", allocation: "₹29.1M" },
                            ].map((goal, i) => (
                                <div key={i} className="group cursor-pointer">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-semibold text-slate-800">{goal.name}</span>
                                        <span className="text-slate-500 font-mono text-xs">{goal.allocation} • {goal.percent}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                        <div className={`${goal.color} h-full rounded-full transition-all duration-500 group-hover:brightness-110`} style={{ width: `${goal.percent}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg">{t('sdg_funds_vs_impact', 'Funds Disbursed vs Impact Generated (MoM)')}</CardTitle>
                        <CardDescription>Audited milestone release tranches vs verified beneficiary reach.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <DashboardChart />
                    </CardContent>
                </Card>
            </div>

            {/* METRIC INSPECTION MODAL */}
            {selectedMetric && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
                            <div>
                                <Badge variant="neutral" className="bg-indigo-50 text-indigo-700 text-[10px] mb-1">
                                    Independent Telemetry Verification
                                </Badge>
                                <h3 className="text-xl font-bold text-slate-900">{selectedMetric.title}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">{selectedMetric.sub}</p>
                            </div>
                            <button onClick={() => setSelectedMetric(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                                <div className="font-bold text-slate-800 text-sm">{selectedMetric.telemetryTitle}</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {selectedMetric.metrics.map((m, mIdx) => (
                                        <div key={mIdx} className="p-2 bg-white rounded-lg border border-slate-200">
                                            <div className="text-slate-400 text-[10px]">{m.label}</div>
                                            <div className="font-bold text-slate-900 text-xs font-mono mt-0.5">{m.val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                                <span className="font-bold text-slate-700 block">Verification Protocol</span>
                                <p className="text-slate-600 leading-relaxed">{selectedMetric.validationMethod}</p>
                            </div>

                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center font-mono">
                                <span className="text-slate-500">On-Chain Attestation Hash</span>
                                <span className="text-indigo-600 font-bold">{selectedMetric.onChainHash}</span>
                            </div>

                            <div>
                                <span className="font-bold text-slate-700 block mb-1">Active Pilot Catchments</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedMetric.locations.map((loc, lIdx) => (
                                        <Badge key={lIdx} variant="neutral" className="text-xs bg-slate-100 text-slate-700">
                                            <MapPin className="w-3 h-3 mr-1 inline" /> {loc}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setSelectedMetric(null)}
                                className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition text-xs cursor-pointer"
                            >
                                Close Audit Proof
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EXPORT CSR AUDIT DOSSIER MODAL */}
            {isExportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Export Audited CSR Impact Report</h3>
                                <p className="text-xs text-slate-500">MCA Section 135 & Schedule VII compliant dossier</p>
                            </div>
                            <button onClick={() => setIsExportModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {exportSuccess ? (
                            <div className="py-6 text-center space-y-3">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div className="font-bold text-slate-900">Dossier Generated & Downloaded!</div>
                                <div className="text-xs text-slate-500 font-mono">FINX-CSR-Audit-FY24-Q4-Signed.pdf</div>
                            </div>
                        ) : (
                            <div className="space-y-4 text-xs">
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Reporting Period</span>
                                        <span className="font-bold text-slate-800">FY 2024-25 (Annual)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Audited CSR Capital</span>
                                        <span className="font-mono font-bold text-slate-900">₹82,500,000</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Compliance Standard</span>
                                        <span className="font-semibold text-emerald-600">Companies Act Section 135</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Auditor Attestation</span>
                                        <span className="font-mono text-slate-700">DSC SHA-256 #9021-AF</span>
                                    </div>
                                </div>

                                <p className="text-slate-500 text-[11px]">
                                    Includes complete cryptographic proof logs, drone survey timestamps, supplier GST tax invoices, and NABL water test lab certificates.
                                </p>

                                <div className="pt-2 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsExportModalOpen(false)}
                                        className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition text-xs cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleExportAudit}
                                        disabled={isExporting}
                                        className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg shadow-sm transition text-xs flex items-center gap-2 cursor-pointer"
                                    >
                                        {isExporting ? (
                                            <>
                                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Compiling Audit PDF...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-4 h-4" /> Download Signed Report
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

