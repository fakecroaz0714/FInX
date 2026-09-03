'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Users, ArrowRight, Plus } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from 'next/link';

export default function PetitionsPage() {
    const { t } = useLanguage();
    const petitions = [
        {
            title: "Clean Water Initiative for Rural Pune",
            location: "Pune, Maharashtra",
            signatures: 1450,
            target: 2000,
            status: "Validated",
            matchedNGO: "Jal Seva NGO",
            description: "Our village lacks access to clean drinking water. We need funds for installing a solar-powered water filtration system."
        },
        {
            title: "School Repair After Floods",
            location: "Guwahati, Assam",
            signatures: 3200,
            target: 5000,
            status: "Needs Review",
            matchedNGO: "Unassigned",
            description: "The primary school building was severely damaged during the recent monsoons. Over 300 students have no place to study."
        },
        {
            title: "Afforestation in Drought Prone Area",
            location: "Kutch, Gujarat",
            signatures: 890,
            target: 1000,
            status: "Verified",
            matchedNGO: "Green Earth Foundation",
            description: "Planting 10,000 indigenous trees to prevent soil erosion and improve groundwater levels."
        }
    ];

    return (
        <div className="p-8 pb-20">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('nav_community_petitions', 'Community Petitions')}</h1>
                    <p className="text-slate-500 mt-1">{t('citizen_portal_sub', 'Discover, support, and track grassroots initiatives.')}</p>
                </div>
                <Link href="/petitions/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
                    <Plus className="w-5 h-5" /> {t('btn_submit_petition', 'Start Petition')}
                </Link>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {petitions.map((petition, idx) => (
                        <Card key={idx} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{petition.title}</h3>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" /> {petition.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" /> {petition.signatures} / {petition.target} Signatures
                                            </span>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={petition.status === 'Validated' || petition.status === 'Verified' ? 'success' : 'warning'}
                                    >
                                        {petition.status}
                                    </Badge>
                                </div>

                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    {petition.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="text-sm">
                                        <span className="text-slate-500">Matched NGO: </span>
                                        <span className="font-semibold text-slate-900">{petition.matchedNGO}</span>
                                    </div>
                                    <button className="text-indigo-600 font-semibold text-sm flex items-center gap-1 hover:underline">
                                        View Details <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="space-y-6">
                    <Card className="border border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                            <CardTitle className="text-lg">Map Overview</CardTitle>
                            <CardDescription>Hotspots of community needs</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="h-64 bg-slate-200 w-full flex flex-col items-center justify-center relative overflow-hidden text-slate-400">
                                <MapPin className="w-8 h-8 mb-2 opacity-50" />
                                <span className="text-sm font-medium">Map Integration Placeholder</span>
                                <span className="text-xs">Interactive Geotagged Petitions</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg">Top NGO Matches</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-900">Jal Seva NGO</span>
                                <Badge variant="success">Verified</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-900">Green Earth</span>
                                <Badge variant="success">Verified</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-900">EduCare Org</span>
                                <Badge variant="warning">Review</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
