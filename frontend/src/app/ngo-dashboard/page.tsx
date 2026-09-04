'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
    HeartHandshake,
    ShieldCheck,
    FileCheck2,
    Users,
    MapPin,
    Building2,
    Camera,
    Briefcase,
    FileText,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import { useAuth, NGOProfile } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';

export default function NGODashboardPage() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('Overview');

    const ngoProfile = (user?.profile as NGOProfile) || {};

    const ngoName = ngoProfile.organizationName || user?.name || 'Jal Seva Foundation';
    const regNum = ngoProfile.registrationNumber || 'TR-2015-893';
    const regType = ngoProfile.registrationType || 'Trust';
    const focusArea = ngoProfile.primaryFocusArea || 'Clean Water & Sanitation';
    const reach = ngoProfile.beneficiaryReach ? Number(ngoProfile.beneficiaryReach).toLocaleString() : '45,000+';
    const experience = ngoProfile.yearsOfExperience ? `${ngoProfile.yearsOfExperience} Years` : '9 Years';
    const verificationStatus = ngoProfile.verificationStatus || 'Verified';

    const complianceItems = [
        { label: t('reg_number', 'Registration Number'), value: regNum, status: 'Verified' },
        { label: t('reg_type', 'Registration Type'), value: regType, status: 'Verified' },
        { label: t('pan_number', 'PAN Number'), value: ngoProfile.pan || 'AAATJ9999K', status: 'Valid' },
        { label: t('cert_12a', '12A Certificate'), value: ngoProfile.registration12A || '12A-PUN-2016-778', status: 'Valid' },
        { label: t('cert_80g', '80G Tax Exemption'), value: ngoProfile.registration80G || '80G-PUN-2016-992', status: 'Valid' },
        { label: t('darpan_id', 'Darpan NGO ID'), value: ngoProfile.darpanId || 'MH/2016/0109283', status: 'Verified' },
        { label: t('state_district', 'State / District'), value: `${ngoProfile.district || 'Pune'}, ${ngoProfile.state || 'Maharashtra'}`, status: 'Active' },
        { label: t('official_website', 'Official Website'), value: ngoProfile.website || 'https://jalseva.org', status: 'Linked' }
    ];

    const assignedProjects = [
        {
            title: 'Clean Water Borewells - Shirur Village',
            corporate: 'TechCorp India Ltd',
            budget: '₹40,00,000',
            stage: 'Milestone 2: Deep Drilling',
            status: 'Evidence Needed',
            progress: 60
        },
        {
            title: 'Solar Water Filtration - Haveli District',
            corporate: 'GreenFuture Energy',
            budget: '₹25,00,000',
            stage: 'Milestone 1: Solar Mounting',
            status: 'Verified',
            progress: 100
        },
        {
            title: 'Community Sanitation Facility - Baramati',
            corporate: 'PharmaCare CSR',
            budget: '₹15,00,000',
            stage: 'Milestone 1: Site Prep',
            status: 'Active',
            progress: 30
        }
    ];

    return (
        <div className="p-4 md:p-8 pb-20 max-w-7xl mx-auto space-y-6 md:space-y-8">
            {/* Header */}
            <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="success" className="text-xs">
                            <ShieldCheck className="w-3 h-3 inline mr-1" />
                            {t('ngo_portal_badge', 'Verified NGO Workspace')}
                        </Badge>
                        <span className="text-xs text-indigo-300 font-mono">PAN: {ngoProfile.pan || 'AAATJ9999K'}</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">{ngoName}</h1>
                    <p className="text-indigo-100 text-xs md:text-sm mt-1 max-w-2xl font-medium">
                        {t('ngo_dashboard_subhead', 'Track assigned milestone projects, manage compliance certificates, and upload geotagged field evidence.')}
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                    <Link
                        href="/verified-milestones"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2 whitespace-nowrap"
                    >
                        <Camera className="w-4 h-4" /> {t('btn_submit_field_evidence', 'Submit Field Evidence')}
                    </Link>
                    <Link
                        href="/csr"
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 whitespace-nowrap"
                    >
                        <Briefcase className="w-4 h-4" /> {t('nav_csr_matches', 'CSR Matches')}
                    </Link>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
                {[
                    { id: 'Overview', key: 'tab_overview', label: 'Overview' },
                    { id: 'Compliance & Registration', key: 'tab_compliance_docs', label: 'Compliance & Registration' },
                    { id: 'Active Projects', key: 'tab_active_milestones', label: 'Active Projects' },
                    { id: 'Document Archive', key: 'tab_org_profile', label: 'Document Archive' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 rounded-t-lg font-bold text-xs md:text-sm whitespace-nowrap transition-colors ${
                            activeTab === tab.id
                                ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                    >
                        {t(tab.key, tab.label)}
                    </button>
                ))}
            </nav>

            {/* Tab 1: Overview */}
            {activeTab === 'Overview' && (
                <div className="space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        <Card className="border border-slate-200 shadow-sm">
                            <CardContent className="p-4">
                                <div className="text-xs font-semibold text-slate-500 mb-1">{t('kpi_assigned_projects', 'Assigned Projects')}</div>
                                <div className="text-2xl font-black text-slate-900">3 {t('status_active', 'Active')}</div>
                                <div className="text-[10px] text-indigo-600 font-semibold mt-1">₹80L Allocated</div>
                            </CardContent>
                        </Card>

                        <Card className="border border-slate-200 shadow-sm">
                            <CardContent className="p-4">
                                <div className="text-xs font-semibold text-slate-500 mb-1">{t('kpi_trust_score', 'Trust Score')}</div>
                                <div className="text-2xl font-black text-emerald-600">94 / 100</div>
                                <div className="text-[10px] text-emerald-600 font-semibold mt-1">{t('high_credibility', 'High Credibility')}</div>
                            </CardContent>
                        </Card>

                        <Card className="border border-slate-200 shadow-sm">
                            <CardContent className="p-4">
                                <div className="text-xs font-semibold text-slate-500 mb-1">{t('kpi_beneficiary_reach', 'Beneficiary Reach')}</div>
                                <div className="text-2xl font-black text-slate-900 font-mono">{reach}</div>
                                <div className="text-[10px] text-slate-500 mt-1">{t('documented_impact', 'Documented Impact')}</div>
                            </CardContent>
                        </Card>

                        <Card className="border border-slate-200 shadow-sm">
                            <CardContent className="p-4">
                                <div className="text-xs font-semibold text-slate-500 mb-1">{t('kpi_track_record', 'Track Record')}</div>
                                <div className="text-2xl font-black text-slate-900">{experience}</div>
                                <div className="text-[10px] text-slate-500 mt-1">{t('community_delivery', 'Community Delivery')}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Active Milestone Projects Table */}
                    <Card className="border border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-4 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-bold text-slate-900">{t('table_assigned_milestones', 'Assigned CSR Milestone Projects')}</CardTitle>
                                <p className="text-xs text-slate-500 mt-0.5">{t('table_assigned_milestones_sub', 'Projects matched with corporate funding awaiting milestone proofs.')}</p>
                            </div>
                            <Link href="/verified-milestones" className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1">
                                {t('open_proof_engine', 'Open Proof Engine')} <ArrowRight className="w-3 h-3" />
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <table className="w-full text-left text-xs min-w-[600px]">
                                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200">
                                    <tr>
                                        <th className="p-3.5">{t('th_project_title_funder', 'Project Title & Funder')}</th>
                                        <th className="p-3.5">{t('th_current_stage', 'Current Stage')}</th>
                                        <th className="p-3.5 text-right">{t('th_escrow_budget', 'Escrow Budget')}</th>
                                        <th className="p-3.5 text-center">{t('th_status', 'Status')}</th>
                                        <th className="p-3.5 text-right">{t('th_action', 'Action')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                    {assignedProjects.map((p, i) => (
                                        <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="p-3.5">
                                                <div className="font-bold text-slate-900">{p.title}</div>
                                                <div className="text-[11px] text-slate-400 font-normal">{t('th_funder', 'Funder')}: {p.corporate}</div>
                                            </td>
                                            <td className="p-3.5 font-mono text-slate-800">{p.stage}</td>
                                            <td className="p-3.5 text-right font-bold text-slate-900">{p.budget}</td>
                                            <td className="p-3.5 text-center">
                                                <Badge
                                                    variant={p.status === 'Tranche Verified' || p.status === 'Completed' || p.status === 'Verified' ? 'success' : 'warning'}
                                                    className="text-[10px]"
                                                >
                                                    {p.status === 'Evidence Needed' ? t('evidence_needed', 'Evidence Needed') : p.status === 'Verified' ? t('status_verified', 'Verified') : t('status_active', 'Active')}
                                                </Badge>
                                            </td>
                                            <td className="p-3.5 text-right">
                                                <Link
                                                    href="/verified-milestones"
                                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition"
                                                >
                                                    <Camera className="w-3.5 h-3.5" /> {t('btn_submit_proof', 'Submit Proof')}
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Tab 2: Compliance & Registration */}
            {activeTab === 'Compliance & Registration' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-4">
                            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-indigo-600" /> {t('compliance_title', 'Statutory Verification & Legal Compliance')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-xs text-left">
                                <tbody className="divide-y divide-slate-100">
                                    {complianceItems.map((item, i) => (
                                        <tr key={i} className="hover:bg-slate-50/60">
                                            <td className="p-3.5 font-semibold text-slate-600 w-1/2">{item.label}</td>
                                            <td className="p-3.5 font-mono text-slate-900">{item.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    <Card className="border border-slate-200 shadow-sm space-y-4 p-5">
                        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                            <Users className="w-4 h-4 text-indigo-600" /> {t('tab_org_profile', 'Operational Scope')}
                        </h3>
                        <div className="space-y-3 text-xs">
                            <div>
                                <span className="font-semibold text-slate-500 block mb-0.5">{t('category_label', 'Primary Focus Area')}:</span>
                                <span className="font-bold text-slate-900 text-sm">{focusArea}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-slate-500 block mb-0.5">{t('state_district', 'Areas of Operation')}:</span>
                                <span className="text-slate-800 font-medium">{ngoProfile.areasOfOperation || 'Pune, Solapur, Ahmednagar districts'}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-slate-500 block mb-0.5">{t('kpi_track_record', 'Track Record')}:</span>
                                <span className="text-slate-800 font-medium">{ngoProfile.previousProjects || 'Clean water borewells across 18 gram panchayats with CSR support.'}</span>
                            </div>
                        </div>

                        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5 mt-4">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold">{t('status_verified', 'Government Verification Active')}</p>
                                <p className="text-[11px] text-emerald-700 mt-0.5">
                                    {t('compliance_sub', 'Verified against MCA21, NGO Darpan, and Income Tax Department portals.')}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Tab 3: Active Projects */}
            {activeTab === 'Active Projects' && (
                <div className="space-y-4">
                    {assignedProjects.map((p, i) => (
                        <Card key={i} className="border border-slate-200 shadow-sm p-5 hover:border-indigo-200 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="default" className="text-[10px]">{p.status}</Badge>
                                        <span className="text-xs font-mono text-slate-400">Escrow: {p.budget}</span>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 mt-1">{p.title}</h3>
                                    <p className="text-xs text-slate-500">Corporate Funder: <strong className="text-slate-700">{p.corporate}</strong></p>
                                </div>
                                <Link
                                    href="/verified-milestones"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow-sm"
                                >
                                    <Camera className="w-3.5 h-3.5" /> {t('btn_submit_proof', 'Submit Proof')}
                                </Link>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                <span>{t('th_current_stage', 'Current Phase')}: <strong className="text-slate-800">{p.stage}</strong></span>
                                <span className="font-mono">{p.progress}% Complete</span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Tab 4: Document Archive */}
            {activeTab === 'Document Archive' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { title: t('reg_number', 'Registration Certificate'), file: ngoProfile.documents?.registrationCert || 'Registration_Deed_Signed.pdf' },
                        { title: t('pan_number', 'PAN Certificate'), file: ngoProfile.documents?.panCert || 'PAN_Card_Attested.pdf' },
                        { title: t('cert_12a', '12A Income Tax Certificate'), file: ngoProfile.documents?.cert12A || '12A_Certification_Valid.pdf' },
                        { title: t('cert_80g', '80G Exemption Certificate'), file: ngoProfile.documents?.cert80G || '80G_Tax_Exemption.pdf' },
                        { title: t('darpan_id', 'Government Darpan Proof'), file: ngoProfile.documents?.govProof || 'NITI_Aayog_Affidavit.pdf' }
                    ].map((doc, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900">{doc.title}</p>
                                    <p className="text-[11px] font-mono text-slate-500">{doc.file}</p>
                                </div>
                            </div>
                            <Badge variant="success" className="text-[10px]">{t('status_verified', 'Verified')}</Badge>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
