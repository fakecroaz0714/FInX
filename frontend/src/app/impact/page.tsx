'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import DashboardChart from "@/components/DashboardChart";
import { Trees, Droplets, Users, BookOpen } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function ImpactPage() {
    const { t } = useLanguage();

    return (
        <div className="p-8 pb-20">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('impact_reports_title', 'Impact Reports')}</h1>
                <p className="text-slate-500 mt-1">{t('impact_reports_sub', 'Aggregated platform outcomes and global CSR footprints.')}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border border-slate-200 shadow-sm leading-normal bg-blue-50/50">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Droplets className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">12,500</div>
                        <div className="text-sm font-medium text-slate-500">{t('impact_clean_water', 'People got clean water')}</div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 shadow-sm leading-normal bg-emerald-50/50">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <Trees className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">45,000</div>
                        <div className="text-sm font-medium text-slate-500">{t('impact_trees_planted', 'Trees planted verified')}</div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 shadow-sm leading-normal bg-indigo-50/50">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <BookOpen className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">3,200</div>
                        <div className="text-sm font-medium text-slate-500">{t('impact_students_supported', 'Students empowered')}</div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 shadow-sm leading-normal bg-amber-50/50">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">24</div>
                        <div className="text-sm font-medium text-slate-500">{t('impact_funds_verified', 'Communities supported')}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg">{t('sdg_alignment', 'Sustainable Development Goals (SDG) Alignment')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {[
                                { name: t('sdg_1', 'No Poverty (SDG 1)'), percent: 65, color: "bg-red-500" },
                                { name: t('sdg_4', 'Quality Education (SDG 4)'), percent: 80, color: "bg-rose-500" },
                                { name: t('sdg_6', 'Clean Water & Sanitation (SDG 6)'), percent: 92, color: "bg-cyan-500" },
                                { name: t('sdg_13', 'Climate Action (SDG 13)'), percent: 75, color: "bg-emerald-500" },
                            ].map((goal, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-semibold text-slate-700">{goal.name}</span>
                                        <span className="text-slate-500">{goal.percent}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                        <div className={`${goal.color} h-full rounded-full`} style={{ width: `${goal.percent}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg">{t('sdg_funds_vs_impact', 'Funds Disbursed vs Impact Generated (MoM)')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <DashboardChart />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
