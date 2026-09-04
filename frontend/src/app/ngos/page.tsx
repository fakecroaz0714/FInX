'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FileCheck, Activity, Users, ShieldAlert, CheckCircle, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function NGOsPage() {
    const { t } = useLanguage();
    const ngos = [
        {
            name: "Jal Seva NGO",
            focus: "Water & Sanitation",
            status: "Verified",
            trustScore: 92,
            activeProjects: 3,
            totalFunds: "₹250,000"
        },
        {
            name: "Green Earth Foundation",
            focus: "Environment",
            status: "Verified",
            trustScore: 88,
            activeProjects: 5,
            totalFunds: "₹1.2M"
        },
        {
            name: "EduCare Org",
            focus: "Education",
            status: "Needs Review",
            trustScore: 45,
            activeProjects: 0,
            totalFunds: "₹0"
        },
        {
            name: "Urban Health Initiative",
            focus: "Healthcare",
            status: "High Risk",
            trustScore: 12,
            activeProjects: 0,
            totalFunds: "₹0"
        }
    ];

    return (
        <div className="p-8 pb-20">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('ngo_network_title', 'NGO Network')}</h1>
                    <p className="text-slate-500 mt-1">{t('validator_dashboard_sub', 'Directory of partner NGOs and validation status.')}</p>
                </div>
                <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
                    {t('step_reg', 'Register NGO')}
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="border border-slate-200 shadow-sm leading-normal">
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-slate-500 mb-1">{t('total_registered', 'Total Registered')}</div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">142</div>
                        <div className="text-xs text-slate-400">On the network</div>
                    </CardContent>
                </Card>
                <Card className="border border-slate-200 shadow-sm leading-normal">
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-slate-500 mb-1">{t('verified_ngos', 'Verified NGOs')}</div>
                        <div className="text-3xl font-bold text-emerald-600 mb-1">89</div>
                        <div className="text-xs text-slate-400">Ready for CSR matching</div>
                    </CardContent>
                </Card>
                <Card className="border border-slate-200 shadow-sm leading-normal">
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-slate-500 mb-1">{t('pending_review', 'Pending Review')}</div>
                        <div className="text-3xl font-bold text-amber-500 mb-1">45</div>
                        <div className="text-xs text-slate-400">Documents submitted</div>
                    </CardContent>
                </Card>
                <Card className="border border-slate-200 shadow-sm leading-normal">
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-slate-500 mb-1">{t('high_risk', 'High Risk')}</div>
                        <div className="text-3xl font-bold text-red-500 mb-1">8</div>
                        <div className="text-xs text-slate-400">Suspended / Rejected</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                    <CardTitle className="text-lg">{t('nav_ngo_dir', 'NGO Directory')}</CardTitle>
                    <CardDescription>Filter and manage non-governmental organizations.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">{t('th_ngo_focus', 'NGO Name & Focus')}</th>
                                    <th className="px-6 py-4 font-semibold">{t('th_validation_status', 'Validation Status')}</th>
                                    <th className="px-6 py-4 font-semibold">{t('th_trust_score', 'Trust Score')}</th>
                                    <th className="px-6 py-4 font-semibold">{t('th_active_projects', 'Active Projects')}</th>
                                    <th className="px-6 py-4 font-semibold">{t('th_total_escrowed', 'Total Funds Escrowed')}</th>
                                    <th className="px-6 py-4 font-semibold text-right">{t('th_action', 'Action')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {ngos.map((ngo, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900">{ngo.name}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">{ngo.focus}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant={ngo.status === 'Verified' ? 'success' : ngo.status === 'Needs Review' ? 'warning' : 'danger'}
                                            >
                                                {ngo.status === 'Verified' && <CheckCircle className="w-3 h-3 mr-1 inline" />}
                                                {ngo.status === 'High Risk' && <ShieldAlert className="w-3 h-3 mr-1 inline" />}
                                                {ngo.status === 'Verified' ? t('status_verified', 'Verified') : ngo.status === 'Needs Review' ? t('status_needs_review', 'Needs Review') : t('status_high_risk', 'High Risk')}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${ngo.trustScore > 80 ? 'bg-emerald-500' : ngo.trustScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                        style={{ width: `${ngo.trustScore}%` }}
                                                    />
                                                </div>
                                                <span className="font-medium text-slate-900">{ngo.trustScore}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{ngo.activeProjects}</td>
                                        <td className="px-6 py-4 font-medium">{ngo.totalFunds}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 ml-auto">
                                                {t('view_profile', 'View Profile')} <ExternalLink className="w-3 h-3" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
