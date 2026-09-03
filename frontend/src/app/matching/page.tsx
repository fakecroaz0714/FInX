'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
    Network, ArrowRight, CheckCircle2, Zap, BrainCircuit, X, Check,
    Building2, MapPin, Target, Sparkles, ShieldCheck
} from 'lucide-react';

export default function MatchingEngine() {
    const [matches, setMatches] = useState([
        {
            id: 1,
            petition: { title: "Rural Solar Pumps", location: "Nagpur, MH", category: "Environment" },
            ngo: { name: "Green Earth Foundation", rating: 94, verified: true },
            corporate: { name: "GreenFuture Energy", budget: "₹4.0M", matchScore: 98 },
            status: 'pending'
        },
        {
            id: 2,
            petition: { title: "Primary School Roof", location: "Pune, MH", category: "Education" },
            ngo: { name: "EduCare Org", rating: 88, verified: true },
            corporate: { name: "TechCorp India", budget: "₹1.5M", matchScore: 92 },
            status: 'pending'
        },
        {
            id: 3,
            petition: { title: "Clinic Medical Supplies", location: "Mumbai, MH", category: "Healthcare" },
            ngo: { name: "Urban Health Initiative", rating: 45, verified: false },
            corporate: { name: "GlobalRetail", budget: "₹800K", matchScore: 61 },
            status: 'pending' // Due to low NGO rating, perhaps skip
        }
    ]);

    const handleAction = (id: number, action: 'approve' | 'reject') => {
        setMatches(matches.map(m => m.id === id ? { ...m, status: action } : m));
    };

    return (
        <div className="p-4 md:p-8 pb-20 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-slate-900 via-indigo-900 p-8 rounded-2xl text-white shadow-lg overflow-hidden relative">

                {/* Decorative background visual */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-10 right-10 flex gap-4">
                        <Network className="w-48 h-48 animate-pulse text-indigo-400" />
                    </div>
                </div>

                <div className="relative z-10 w-full mb-4 md:mb-0">
                    <div className="flex items-center gap-2 mb-2">
                        <BrainCircuit className="w-6 h-6 text-indigo-400 mb-1" />
                        <span className="text-sm font-bold text-indigo-300 uppercase tracking-widest">AI Workflow Engine</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Smart Mediation</h1>
                    <p className="text-indigo-100 mt-2 font-medium opacity-90 max-w-2xl">
                        Automatically triaging Citizen Petitions &#10230; Verified NGOs &#10230; Corporate CSR Funds based on SDG categories and geographic heuristics.
                    </p>
                </div>
                <button className="relative z-10 bg-indigo-500 text-white border border-indigo-400 px-6 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-600 transition whitespace-nowrap flex items-center gap-2">
                    <Sparkles className="w-5 h-5" /> Run Auto-Match Algorithm
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-6">
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Unresolved Petitions</div>
                        <div className="text-3xl font-bold text-slate-900 mt-2">1,204</div>
                        <div className="mt-2 text-xs font-semibold text-indigo-600 flex items-center gap-1">+42 this week</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-6">
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Available CSR Capital</div>
                        <div className="text-3xl font-bold text-slate-900 mt-2 font-mono">₹82.5M</div>
                        <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">Across 14 Corporates</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-6">
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Workflow Success Rate</div>
                        <div className="text-3xl font-bold text-indigo-600 mt-2">91%</div>
                        <div className="mt-2 text-xs font-semibold text-slate-500 flex items-center gap-1">Matches converting to Escrow</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <h2 className="text-xl font-bold text-slate-900">Suggested Synergy Workflows</h2>
                    <span className="text-sm font-semibold text-slate-500">3 High-Confidence Matches Found</span>
                </div>

                {matches.map((match) => (
                    <Card key={match.id} className={`border ${match.status === 'approve' ? 'border-emerald-300 bg-emerald-50/20' : match.status === 'reject' ? 'border-red-200 opacity-50 bg-slate-50' : 'border-indigo-100'} shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md`}>
                        {match.status === 'approve' && (
                            <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1.5 text-xs font-bold rounded-bl-xl z-20 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Workflow Sent to Escrow
                            </div>
                        )}
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-center gap-4 relative">
                                {/* The Connection Line (desktop only) */}
                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 hidden md:block rounded-full"></div>

                                {/* 1. Citizen Petition */}
                                <div className="flex-1 w-full bg-white border border-slate-200 p-4 rounded-xl shadow-sm relative z-10 hover:border-slate-300 transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="neutral" className="bg-slate-100 text-slate-600">Step 1: Petition</Badge>
                                        <Target className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-sm">{match.petition.title}</h3>
                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {match.petition.location}</div>
                                    <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-3">{match.petition.category}</div>
                                </div>

                                <ArrowRight className="w-6 h-6 text-indigo-300 hidden md:block shrink-0 bg-slate-50 rounded-full" />

                                {/* 2. NGO Agent */}
                                <div className="flex-1 w-full bg-white border border-slate-200 p-4 rounded-xl shadow-sm relative z-10 hover:border-slate-300 transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="neutral" className="bg-slate-100 text-slate-600">Step 2: Execution</Badge>
                                        <Building2 className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-sm">{match.ngo.name}</h3>
                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                        {match.ngo.verified ? <ShieldCheck className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-red-500" />}
                                        {match.ngo.verified ? 'Verified Organization' : 'Pending Verification'}
                                    </div>
                                    <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-3">Validator Score: {match.ngo.rating}</div>
                                </div>

                                <ArrowRight className="w-6 h-6 text-indigo-300 hidden md:block shrink-0 bg-slate-50 rounded-full" />

                                {/* 3. Corporate Funder */}
                                <div className="flex-1 w-full bg-white border border-slate-200 p-4 rounded-xl shadow-sm relative z-10 hover:border-slate-300 transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="neutral" className="bg-slate-100 text-slate-600">Step 3: CSR Capital</Badge>
                                        <Zap className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-sm">{match.corporate.name}</h3>
                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-mono">{match.corporate.budget} Available</div>
                                    <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-3">ESG Match: {match.corporate.matchScore}%</div>
                                </div>
                            </div>

                            {/* Action Footer */}
                            {match.status === 'pending' && (
                                <div className="pt-6 mt-4 border-t border-slate-100 flex justify-end gap-3 w-full">
                                    <div className="mr-auto text-xs font-semibold text-slate-400 self-center">AI Confidence interval matches category logic perfectly.</div>
                                    <button onClick={() => handleAction(match.id, 'reject')} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition text-sm flex items-center gap-2">
                                        <X className="w-4 h-4" /> Decline
                                    </button>
                                    <button onClick={() => handleAction(match.id, 'approve')} className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition text-sm flex items-center gap-2">
                                        <Check className="w-4 h-4" /> Approve Workflow
                                    </button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
