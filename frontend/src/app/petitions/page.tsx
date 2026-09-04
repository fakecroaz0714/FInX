'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Users, ArrowRight, Plus, CheckCircle2, ShieldCheck, X, Heart, Sparkles, Building2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from 'next/link';

interface Petition {
    id: string;
    title: string;
    location: string;
    coordinates: [number, number]; // [lat, lng]
    signatures: number;
    target: number;
    status: 'Validated' | 'Needs Review' | 'Verified';
    matchedNGO: string;
    ngoTrustScore: number;
    category: string;
    description: string;
    keyImpact: string;
}

const INITIAL_PETITIONS: Petition[] = [
    {
        id: "PET-PUN-01",
        title: "Clean Water Initiative for Rural Pune",
        location: "Pune, Maharashtra",
        coordinates: [18.5204, 73.8567],
        signatures: 1450,
        target: 2000,
        status: "Validated",
        matchedNGO: "Jal Seva NGO",
        ngoTrustScore: 94,
        category: "Water & Sanitation",
        description: "Our village lacks reliable access to potable drinking water. Groundwater contains dangerous fluoride concentrations. We are petitioning for a 2,000 LPH community solar-powered water filtration system.",
        keyImpact: "Provides fluorosis-free water for 450 rural households & 2 primary schools."
    },
    {
        id: "PET-GAU-02",
        title: "School Repair After Floods",
        location: "Guwahati, Assam",
        coordinates: [26.1445, 91.7362],
        signatures: 3200,
        target: 5000,
        status: "Needs Review",
        matchedNGO: "EduCare Org",
        ngoTrustScore: 88,
        category: "Education Infrastructure",
        description: "The primary school building and boundary wall were severely compromised during the recent Brahmaputra monsoons. Over 300 students have had to study under open plastic tarpaulins.",
        keyImpact: "Restores weatherproof classrooms and sanitation blocks for 300 students."
    },
    {
        id: "PET-KUT-03",
        title: "Afforestation in Drought Prone Area",
        location: "Kutch, Gujarat",
        coordinates: [23.242, 69.6669],
        signatures: 890,
        target: 1000,
        status: "Verified",
        matchedNGO: "Green Earth Foundation",
        ngoTrustScore: 91,
        category: "Environment & Soil",
        description: "Planting 10,000 indigenous drought-hardy saplings along pastoral grazing lands to prevent salinity ingress, soil erosion, and replenish groundwater tables.",
        keyImpact: "Increases vegetation cover by 40 hectares and sequesters 180 tonnes of carbon."
    }
];

export default function PetitionsPage() {
    const { t } = useLanguage();
    const [petitionsList, setPetitionsList] = useState<Petition[]>(INITIAL_PETITIONS);
    const [selectedPetition, setSelectedPetition] = useState<Petition | null>(null);
    const [signedPetitions, setSignedPetitions] = useState<Record<string, boolean>>({});
    const [selectedNGOPreview, setSelectedNGOPreview] = useState<any | null>(null);
    const [activeHotspotId, setActiveHotspotId] = useState<string>("PET-PUN-01");
    const [notification, setNotification] = useState<string | null>(null);

    const handleSignPetition = (petitionId: string) => {
        if (signedPetitions[petitionId]) return;

        setPetitionsList(prev => prev.map(p => {
            if (p.id === petitionId) {
                return { ...p, signatures: p.signatures + 1 };
            }
            return p;
        }));

        setSignedPetitions(prev => ({ ...prev, [petitionId]: true }));
        setNotification(`You signed petition "${petitionsList.find(p => p.id === petitionId)?.title}"! Signature recorded on-chain.`);
        setTimeout(() => setNotification(null), 4500);

        if (selectedPetition && selectedPetition.id === petitionId) {
            setSelectedPetition(prev => prev ? { ...prev, signatures: prev.signatures + 1 } : null);
        }
    };

    const topNGOs = [
        { name: "Jal Seva NGO", status: "Verified", score: 94, location: "Pune, Maharashtra", activeProjects: 4 },
        { name: "Green Earth Foundation", status: "Verified", score: 91, location: "Nashik, Maharashtra", activeProjects: 6 },
        { name: "EduCare Org", status: "Verified", score: 88, location: "Pune, Maharashtra", activeProjects: 3 }
    ];

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

            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="default" className="text-[10px] font-bold">Community Governance</Badge>
                        <span className="text-xs text-slate-400 font-medium">Grassroots Impact Mandates</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('nav_community_petitions', 'Community Petitions')}</h1>
                    <p className="text-slate-500 mt-1 text-xs sm:text-sm font-medium">{t('citizen_portal_sub', 'Discover, support, and track grassroots initiatives directly connected to CSR funds.')}</p>
                </div>
                <Link
                    href="/petitions/new"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-sm flex items-center gap-2 text-xs sm:text-sm cursor-pointer shrink-0"
                >
                    <Plus className="w-4 h-4" /> {t('btn_submit_petition', 'Start Petition')}
                </Link>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Left: Petitions List */}
                <div className="lg:col-span-2 space-y-6">
                    {petitionsList.map((petition) => {
                        const isSigned = !!signedPetitions[petition.id];
                        const progressPercent = Math.min(100, Math.round((petition.signatures / petition.target) * 100));

                        return (
                            <Card key={petition.id} className="border border-slate-200 shadow-sm hover:shadow-md transition">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{petition.id}</span>
                                                <Badge variant="neutral" className="text-[10px]">{petition.category}</Badge>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900">{petition.title}</h3>
                                            <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {petition.location}
                                                </span>
                                                <span className="flex items-center gap-1 font-mono font-bold text-slate-700">
                                                    <Users className="w-3.5 h-3.5 text-slate-400" /> {petition.signatures.toLocaleString()} / {petition.target.toLocaleString()} {t('signatures_label', 'Signatures')}
                                                </span>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={petition.status === 'Validated' || petition.status === 'Verified' ? 'success' : 'warning'}
                                            className="text-xs"
                                        >
                                            {petition.status === 'Validated' ? t('status_validated', 'Validated') : petition.status === 'Verified' ? t('status_verified', 'Verified') : t('status_needs_review', 'Needs Review')}
                                        </Badge>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
                                        <div
                                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>

                                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                                        {petition.description}
                                    </p>

                                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                            <span className="text-slate-400">{t('matched_ngo_label', 'Matched NGO')}:</span>
                                            <button
                                                onClick={() => setSelectedNGOPreview(topNGOs.find(n => n.name === petition.matchedNGO) || { name: petition.matchedNGO, status: 'Verified', score: petition.ngoTrustScore, location: petition.location, activeProjects: 2 })}
                                                className="font-bold text-indigo-600 hover:underline cursor-pointer"
                                            >
                                                {petition.matchedNGO}
                                            </button>
                                            <span className="text-[10px] font-mono text-emerald-600 font-bold">({petition.ngoTrustScore}/100)</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleSignPetition(petition.id)}
                                                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                                                    isSigned
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                                                }`}
                                            >
                                                <Heart className={`w-3.5 h-3.5 ${isSigned ? 'fill-emerald-600 text-emerald-600' : 'text-indigo-600'}`} />
                                                {isSigned ? 'Signed ✓' : 'Sign Petition'}
                                            </button>

                                            <button
                                                onClick={() => setSelectedPetition(petition)}
                                                className="text-indigo-600 font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer px-2 py-1.5"
                                            >
                                                {t('view_details', 'View Details')} <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Right Column: Hotspot Map Overview + Top NGOs */}
                <div className="space-y-6">
                    {/* Live Community Hotspots Map Card */}
                    <Card className="border border-slate-200 shadow-sm overflow-hidden text-xs">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-indigo-600" /> {t('tab_active_projects_map', 'Map Overview')}
                                    </CardTitle>
                                    <CardDescription className="text-[11px] text-slate-500">
                                        Hotspots of community needs &bull; Click to inspect
                                    </CardDescription>
                                </div>
                                <Badge variant="neutral" className="text-[10px]">3 Hotspots</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {/* Stylized Visual Map / Pin Selector */}
                            <div className="bg-slate-900 rounded-xl p-4 text-white space-y-2 relative overflow-hidden">
                                <div className="text-[10px] uppercase font-mono font-bold text-indigo-300">National Priority Grid</div>
                                <div className="space-y-2 pt-1">
                                    {petitionsList.map(p => (
                                        <div
                                            key={p.id}
                                            onClick={() => {
                                                setActiveHotspotId(p.id);
                                                setSelectedPetition(p);
                                            }}
                                            className={`p-2.5 rounded-lg border transition cursor-pointer flex items-center justify-between ${
                                                activeHotspotId === p.id
                                                    ? 'bg-indigo-950/80 border-indigo-400 text-white'
                                                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300'
                                            }`}
                                        >
                                            <div className="truncate min-w-0 pr-2">
                                                <div className="font-bold truncate text-xs">{p.location}</div>
                                                <div className="text-[10px] text-slate-400 truncate">{p.title}</div>
                                            </div>
                                            <span className="font-mono font-bold text-[10px] text-indigo-400 shrink-0">
                                                {p.signatures} sigs
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top NGO Matches Card */}
                    <Card className="border border-slate-200 shadow-sm text-xs">
                        <CardHeader className="border-b border-slate-100 p-4">
                            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" /> {t('top_ngo_matches', 'Top NGO Matches')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2.5">
                            {topNGOs.map((ngo, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedNGOPreview(ngo)}
                                    className="p-3 bg-slate-50 hover:bg-indigo-50/40 rounded-xl border border-slate-200/80 transition cursor-pointer flex justify-between items-center"
                                >
                                    <div>
                                        <div className="font-bold text-slate-900">{ngo.name}</div>
                                        <div className="text-[11px] text-slate-400 mt-0.5">{ngo.location} &bull; {ngo.activeProjects} projects</div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <Badge variant="success" className="text-[10px]">Verified</Badge>
                                        <div className="text-[10px] font-mono font-bold text-emerald-700 mt-1">
                                            Score: {ngo.score}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* =========================================================================
                PETITION DETAILS MODAL
               ========================================================================= */}
            {selectedPetition && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{selectedPetition.id}</span>
                                    <Badge variant={selectedPetition.status === 'Validated' || selectedPetition.status === 'Verified' ? 'success' : 'warning'}>
                                        {selectedPetition.status}
                                    </Badge>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">{selectedPetition.title}</h3>
                                <div className="flex items-center gap-2 text-slate-500 mt-0.5">
                                    <MapPin className="w-3.5 h-3.5" /> {selectedPetition.location}
                                </div>
                            </div>
                            <button onClick={() => setSelectedPetition(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Detailed Description</span>
                            <p className="text-slate-700 text-xs leading-relaxed">{selectedPetition.description}</p>
                        </div>

                        <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Projected Community Impact</span>
                            <p className="font-semibold text-xs">{selectedPetition.keyImpact}</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Signatures Collected</span>
                                <div className="font-mono font-bold text-sm text-slate-900 mt-0.5">{selectedPetition.signatures.toLocaleString()}</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Threshold Target</span>
                                <div className="font-mono font-bold text-sm text-slate-900 mt-0.5">{selectedPetition.target.toLocaleString()}</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 col-span-2 sm:col-span-1">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Assigned NGO</span>
                                <div className="font-bold text-xs text-indigo-700 mt-0.5 truncate">{selectedPetition.matchedNGO}</div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                            <button
                                onClick={() => handleSignPetition(selectedPetition.id)}
                                className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
                                    signedPetitions[selectedPetition.id]
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                                }`}
                            >
                                <Heart className={`w-4 h-4 ${signedPetitions[selectedPetition.id] ? 'fill-emerald-700' : ''}`} />
                                {signedPetitions[selectedPetition.id] ? 'Signature Verified ✓' : 'Sign Petition Now'}
                            </button>
                            <button
                                onClick={() => setSelectedPetition(null)}
                                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================================
                NGO PREVIEW MODAL
               ========================================================================= */}
            {selectedNGOPreview && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-xs">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">{selectedNGOPreview.name}</h3>
                                    <p className="text-[11px] text-slate-400">{selectedNGOPreview.location}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedNGOPreview(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-center">
                            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                <span className="text-[10px] uppercase font-bold text-emerald-700">Transparency Score</span>
                                <div className="text-2xl font-mono font-extrabold text-emerald-800 mt-1">{selectedNGOPreview.score} / 100</div>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                <span className="text-[10px] uppercase font-bold text-indigo-700">Active Projects</span>
                                <div className="text-2xl font-mono font-extrabold text-indigo-800 mt-1">{selectedNGOPreview.activeProjects} Escrow</div>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 leading-relaxed text-[11px]">
                            Verified 12A/80G status, Darpan registered with statutory audited balance sheets on file. Cleared for CSR escrow matching.
                        </div>

                        <button
                            onClick={() => setSelectedNGOPreview(null)}
                            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition"
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
