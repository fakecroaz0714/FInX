'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Briefcase, Map, Target, Leaf, Plus, Sparkles, Building2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function CSRPage() {
    const { t } = useLanguage();
    const matches = [
        {
            project: "Clean Water Initiative for Rural Pune",
            ngo: "Jal Seva NGO",
            ngoStatus: "Verified",
            alignmentScore: 94,
            fundingRequired: "₹50,000",
            theme: "Clean Water",
            location: "Pune, Maharashtra"
        },
        {
            project: "Solar Panel Installation - Rural Tech",
            ngo: "Green Earth Foundation",
            ngoStatus: "Verified",
            alignmentScore: 88,
            fundingRequired: "₹120,000",
            theme: "Renewable Energy",
            location: "Nagpur, Maharashtra"
        }
    ];

    return (
        <div className="p-8 pb-20">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('corporate_csr_dashboard', 'Corporate CSR Dashboard')}</h1>
                    <p className="text-slate-500 mt-1">{t('impact_reports_sub', 'Manage budgets, discover aligned projects, and track portfolio.')}</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
                    <Plus className="w-5 h-5" /> {t('new_csr_goal', 'New CSR Goal')}
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-slate-500">Total CSR Budget (FY 24)</div>
                                <div className="text-2xl font-bold text-slate-900">₹2.5M</div>
                            </div>
                        </div>
                        <div className="mt-4 text-xs font-semibold text-slate-500 flex justify-between">
                            <span>Committed: ₹1.2M</span>
                            <span>Remaining: ₹1.3M</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <Leaf className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-slate-500">Active Themes</div>
                                <div className="text-2xl font-bold text-slate-900">3 Domains</div>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Badge variant="neutral">Environment</Badge>
                            <Badge variant="neutral">Education</Badge>
                            <Badge variant="neutral">Water</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 shadow-sm bg-gradient-to-br from-indigo-50 to-white">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-2">
                            <Sparkles className="w-5 h-5" /> AI Matchmaker Active
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                            FINX has found 2 new projects aligning with your SDG goals in Maharashtra.
                        </p>
                        <button className="text-indigo-600 text-sm font-bold hover:underline">
                            View Suggestions
                        </button>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" /> Curated Project Matches
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {matches.map((match, idx) => (
                    <Card key={idx} className="border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <Badge variant="neutral" className="bg-indigo-50 text-indigo-700 border-indigo-100 mb-2 inline-flex">
                                    {match.theme}
                                </Badge>
                                <div className="text-right">
                                    <div className="text-xs text-slate-500 font-medium">Alignment Score</div>
                                    <div className="text-2xl font-black text-indigo-600">{match.alignmentScore}%</div>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{match.project}</h3>

                            <div className="space-y-2 mt-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Implementing NGO</span>
                                    <span className="font-semibold text-slate-900 flex items-center gap-2">
                                        {match.ngo} <Badge variant="success" className="px-1.5 py-0 text-[10px]">Verified</Badge>
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Location</span>
                                    <span className="font-semibold text-slate-900 flex items-center gap-1">
                                        <Map className="w-3 h-3" /> {match.location}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                                    <span className="text-slate-500 font-medium">Funding Ask</span>
                                    <span className="font-bold text-slate-900">{match.fundingRequired}</span>
                                </div>
                            </div>

                            <div className="mt-5 flex gap-3">
                                <button className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-sm">
                                    Review Proposal
                                </button>
                                <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm flex items-center justify-center gap-2">
                                    <Briefcase className="w-4 h-4" /> Start Escrow
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
