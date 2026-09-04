'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
    Briefcase, Map, Target, Leaf, Plus, Sparkles, Building2, 
    X, CheckCircle2, ShieldCheck, Clock, FileText, ArrowRight, Check
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface ProjectMatch {
    id: string;
    project: string;
    ngo: string;
    ngoStatus: string;
    alignmentScore: number;
    fundingRequired: string;
    fundingAmountNum: number;
    theme: string;
    location: string;
    status?: 'Exploring' | 'Proposal Reviewed' | 'Escrow Active';
    txHash?: string;
}

const initialMatches: ProjectMatch[] = [
    {
        id: "CSR-M1",
        project: "Clean Water Initiative for Rural Pune",
        ngo: "Jal Seva NGO",
        ngoStatus: "Verified",
        alignmentScore: 94,
        fundingRequired: "₹50,000",
        fundingAmountNum: 50000,
        theme: "Clean Water",
        location: "Pune, Maharashtra",
        status: "Exploring"
    },
    {
        id: "CSR-M2",
        project: "Solar Panel Installation - Rural Tech",
        ngo: "Green Earth Foundation",
        ngoStatus: "Verified",
        alignmentScore: 88,
        fundingRequired: "₹120,000",
        fundingAmountNum: 120000,
        theme: "Renewable Energy",
        location: "Nagpur, Maharashtra",
        status: "Exploring"
    }
];

export default function CSRPage() {
    const { t } = useLanguage();
    const [matches, setMatches] = useState<ProjectMatch[]>(initialMatches);
    const [budgetStats, setBudgetStats] = useState({
        total: 2500000,
        committed: 1200000,
        themes: ["Environment", "Education", "Water"]
    });

    // Modals
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const [reviewingMatch, setReviewingMatch] = useState<ProjectMatch | null>(null);
    const [escrowMatch, setEscrowMatch] = useState<ProjectMatch | null>(null);
    const [escrowStep, setEscrowStep] = useState<'review' | 'deploying' | 'completed'>('review');
    const [notification, setNotification] = useState<string | null>(null);

    // Goal Form State
    const [goalForm, setGoalForm] = useState({
        theme: 'Healthcare',
        budget: '',
        targetRegion: '',
        targetBeneficiaries: '',
        fyQuarter: 'FY 2024-25 Q4'
    });

    const prefillGoalForm = () => {
        setGoalForm({
            theme: 'Healthcare & Mobile Clinics',
            budget: '600000',
            targetRegion: 'Marathwada & Western Maharashtra',
            targetBeneficiaries: '8500',
            fyQuarter: 'FY 2024-25 Q4'
        });
    };

    const handleGoalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const addedBudget = Number(goalForm.budget) || 0;
        setBudgetStats(prev => ({
            ...prev,
            total: prev.total + addedBudget,
            committed: prev.committed + addedBudget,
            themes: prev.themes.includes(goalForm.theme) ? prev.themes : [...prev.themes, goalForm.theme]
        }));
        setIsGoalModalOpen(false);
        setNotification(`Successfully created CSR Mandate "${goalForm.theme}" with ₹${addedBudget.toLocaleString('en-IN')} budget allocation.`);
        setTimeout(() => setNotification(null), 5000);
    };

    const addAiSuggestion = (suggestion: ProjectMatch) => {
        if (!matches.find(m => m.id === suggestion.id)) {
            setMatches([suggestion, ...matches]);
            setNotification(`Added "${suggestion.project}" to your curated CSR pipeline.`);
            setTimeout(() => setNotification(null), 5000);
        }
        setIsSuggestionsOpen(false);
    };

    const handleConfirmEscrow = (match: ProjectMatch) => {
        setEscrowStep('deploying');
        setTimeout(() => {
            const fakeTx = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
            setMatches(prev => prev.map(m => m.id === match.id ? { ...m, status: 'Escrow Active', txHash: fakeTx } : m));
            setEscrowStep('completed');
            setNotification(`Milestone Escrow contract deployed on Polygon PoS! 30% initial mobilization tranche locked.`);
            setTimeout(() => setNotification(null), 6000);
        }, 1200);
    };

    return (
        <div className="p-8 pb-20 max-w-7xl mx-auto">
            {notification && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-sm font-semibold shadow-sm animate-in fade-in">
                    <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        {notification}
                    </span>
                    <button onClick={() => setNotification(null)} className="text-emerald-600 hover:text-emerald-900">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('corporate_csr_dashboard', 'Corporate CSR Dashboard')}</h1>
                    <p className="text-slate-500 mt-1">{t('impact_reports_sub', 'Manage budgets, discover aligned projects, and track portfolio.')}</p>
                </div>
                <button 
                    onClick={() => setIsGoalModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                >
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
                                <div className="text-sm font-medium text-slate-500">Total CSR Budget (FY 24-25)</div>
                                <div className="text-2xl font-bold text-slate-900">₹{(budgetStats.total / 1000000).toFixed(2)}M</div>
                            </div>
                        </div>
                        <div className="mt-4 text-xs font-semibold text-slate-500 flex justify-between">
                            <span>Committed: ₹{(budgetStats.committed / 1000000).toFixed(2)}M</span>
                            <span className="text-emerald-600">Available: ₹{((budgetStats.total - budgetStats.committed) / 1000000).toFixed(2)}M</span>
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
                                <div className="text-sm font-medium text-slate-500">Active Mandate Themes</div>
                                <div className="text-2xl font-bold text-slate-900">{budgetStats.themes.length} Domains</div>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                            {budgetStats.themes.map((theme, i) => (
                                <Badge key={i} variant="neutral" className="text-xs bg-slate-100 text-slate-700">{theme}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-indigo-100 shadow-sm bg-gradient-to-br from-indigo-50/80 to-white">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-indigo-700 font-bold mb-2">
                            <Sparkles className="w-5 h-5 text-indigo-600" /> AI Matchmaker Active
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                            FINX has discovered 3 high-affinity grassroots projects matching your corporate SDG mandate.
                        </p>
                        <button 
                            onClick={() => setIsSuggestionsOpen(true)}
                            className="text-indigo-600 text-sm font-bold hover:underline cursor-pointer flex items-center gap-1"
                        >
                            View Suggestions <ArrowRight className="w-4 h-4" />
                        </button>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" /> Curated Project Matches
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {matches.map((match) => (
                    <Card key={match.id} className="border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <Badge variant="neutral" className="bg-indigo-50 text-indigo-700 border-indigo-100 inline-flex">
                                        {match.theme}
                                    </Badge>
                                    {match.status === 'Escrow Active' && (
                                        <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                            <ShieldCheck className="w-3 h-3 mr-1 inline" /> Escrow Active
                                        </Badge>
                                    )}
                                </div>
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
                                    <span className="font-bold text-slate-900 font-mono">{match.fundingRequired}</span>
                                </div>
                                {match.txHash && (
                                    <div className="flex justify-between text-xs pt-2 border-t border-slate-200 text-slate-500">
                                        <span>On-chain Escrow</span>
                                        <span className="font-mono text-indigo-600 font-semibold">{match.txHash.slice(0, 12)}...</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-5 flex gap-3">
                                <button 
                                    onClick={() => setReviewingMatch(match)}
                                    className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-sm cursor-pointer"
                                >
                                    Review Proposal
                                </button>
                                <button 
                                    onClick={() => {
                                        setEscrowMatch(match);
                                        setEscrowStep('review');
                                    }}
                                    disabled={match.status === 'Escrow Active'}
                                    className="flex-1 bg-indigo-600 disabled:bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {match.status === 'Escrow Active' ? (
                                        <><ShieldCheck className="w-4 h-4" /> Escrow Funded</>
                                    ) : (
                                        <><Briefcase className="w-4 h-4" /> Start Escrow</>
                                    )}
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* NEW CSR GOAL MODAL */}
            {isGoalModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Define New CSR Goal / Mandate</h3>
                                <p className="text-xs text-slate-500">Establish corporate thematic priorities and budget tranche</p>
                            </div>
                            <button onClick={() => setIsGoalModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <button
                                type="button"
                                onClick={prefillGoalForm}
                                className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 flex items-center justify-center gap-2 transition"
                            >
                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                ⚡ Pre-fill Sample Mandate (Healthcare & Mobile Clinics)
                            </button>
                        </div>

                        <form onSubmit={handleGoalSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Focus Theme</label>
                                <select
                                    value={goalForm.theme}
                                    onChange={(e) => setGoalForm({ ...goalForm, theme: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-600 outline-none"
                                >
                                    <option>Healthcare & Mobile Clinics</option>
                                    <option>Clean Drinking Water & Sanitation</option>
                                    <option>Solar Energy & Rural Electrification</option>
                                    <option>Quality Education & STEM Labs</option>
                                    <option>Women Livelihood & Self Help Groups</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Fiscal Quarter</label>
                                    <input
                                        type="text"
                                        value={goalForm.fyQuarter}
                                        onChange={(e) => setGoalForm({ ...goalForm, fyQuarter: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Allocated Budget (₹) *</label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="e.g. 600000"
                                        value={goalForm.budget}
                                        onChange={(e) => setGoalForm({ ...goalForm, budget: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-600 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Geographic Region</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Marathwada, MH"
                                        value={goalForm.targetRegion}
                                        onChange={(e) => setGoalForm({ ...goalForm, targetRegion: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Beneficiaries</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 5000"
                                        value={goalForm.targetBeneficiaries}
                                        onChange={(e) => setGoalForm({ ...goalForm, targetBeneficiaries: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsGoalModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
                                >
                                    Create Goal & Match
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* AI SUGGESTIONS MODAL */}
            {isSuggestionsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-indigo-600" /> AI-Curated Strategic Matches
                                </h3>
                                <p className="text-xs text-slate-500">Grassroots projects filtered by Section 135 compliance and geographic priority</p>
                            </div>
                            <button onClick={() => setIsSuggestionsOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {[
                                {
                                    id: "AI-1",
                                    project: "Solar Drinking Water RO Plant - Baramati",
                                    ngo: "Jal Seva NGO",
                                    ngoStatus: "Verified",
                                    alignmentScore: 96,
                                    fundingRequired: "₹280,000",
                                    fundingAmountNum: 280000,
                                    theme: "Clean Water",
                                    location: "Baramati, Maharashtra"
                                },
                                {
                                    id: "AI-2",
                                    project: "Maternal Health Clinic Solar Microgrid - Ambegaon",
                                    ngo: "Green Earth Foundation",
                                    ngoStatus: "Verified",
                                    alignmentScore: 93,
                                    fundingRequired: "₹450,000",
                                    fundingAmountNum: 450000,
                                    theme: "Healthcare",
                                    location: "Ambegaon, Maharashtra"
                                },
                                {
                                    id: "AI-3",
                                    project: "Smart Digital Anganwadi Classroom - Shirur",
                                    ngo: "EduCare Org",
                                    ngoStatus: "Verified",
                                    alignmentScore: 89,
                                    fundingRequired: "₹150,000",
                                    fundingAmountNum: 150000,
                                    theme: "Education",
                                    location: "Shirur, Maharashtra"
                                }
                            ].map((sug) => (
                                <div key={sug.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-300 transition">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="neutral" className="bg-indigo-50 text-indigo-700 text-[10px]">{sug.theme}</Badge>
                                            <span className="text-xs font-bold text-emerald-600">{sug.alignmentScore}% Match</span>
                                        </div>
                                        <div className="font-bold text-slate-900 text-sm">{sug.project}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">By {sug.ngo} • {sug.location}</div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="font-mono font-bold text-slate-900 text-sm">{sug.fundingRequired}</div>
                                        <button
                                            onClick={() => addAiSuggestion(sug)}
                                            className="mt-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Commit to Portfolio
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setIsSuggestionsOpen(false)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* REVIEW PROPOSAL MODAL */}
            {reviewingMatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="neutral" className="bg-indigo-50 text-indigo-700">{reviewingMatch.theme}</Badge>
                                    <span className="text-xs font-bold text-indigo-600">{reviewingMatch.alignmentScore}% Match</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mt-1">{reviewingMatch.project}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Submitted by {reviewingMatch.ngo} • {reviewingMatch.location}</p>
                            </div>
                            <button onClick={() => setReviewingMatch(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Problem & Proposed Solution</div>
                                <p className="text-slate-700 leading-relaxed text-xs">
                                    Rural community of over 1,200 households currently relies on high-salinity groundwater borewells. 
                                    This proposal deploys a solar-powered multi-stage RO purification unit with 24/7 smart dispenser cards 
                                    and IoT water quality sensors monitored on the FINX public telemetry dashboard.
                                </p>
                            </div>

                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Milestone Escrow Tranche Schedule</div>
                                <div className="space-y-2">
                                    <div className="p-3 bg-white border border-slate-200 rounded-lg flex justify-between items-center text-xs">
                                        <div>
                                            <div className="font-bold text-slate-800">Tranche 1: Site Survey, Borewell Depth & Foundation</div>
                                            <div className="text-slate-400">Trigger: Geotagged RTK coordinates + Panchayat NOC</div>
                                        </div>
                                        <div className="font-mono font-bold text-slate-900">30% (₹{((reviewingMatch.fundingAmountNum * 0.3)).toLocaleString()})</div>
                                    </div>
                                    <div className="p-3 bg-white border border-slate-200 rounded-lg flex justify-between items-center text-xs">
                                        <div>
                                            <div className="font-bold text-slate-800">Tranche 2: RO Unit & Solar Array Installation</div>
                                            <div className="text-slate-400">Trigger: Supplier Tax Invoice + Field Photo Verification</div>
                                        </div>
                                        <div className="font-mono font-bold text-slate-900">40% (₹{((reviewingMatch.fundingAmountNum * 0.4)).toLocaleString()})</div>
                                    </div>
                                    <div className="p-3 bg-white border border-slate-200 rounded-lg flex justify-between items-center text-xs">
                                        <div>
                                            <div className="font-bold text-slate-800">Tranche 3: Water Purity Lab Test & Community Handover</div>
                                            <div className="text-slate-400">Trigger: NABL Accredited Lab Certificate + 50 Citizen Sign-offs</div>
                                        </div>
                                        <div className="font-mono font-bold text-slate-900">30% (₹{((reviewingMatch.fundingAmountNum * 0.3)).toLocaleString()})</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2">
                            <button
                                onClick={() => setReviewingMatch(null)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    const m = reviewingMatch;
                                    setReviewingMatch(null);
                                    setEscrowMatch(m);
                                    setEscrowStep('review');
                                }}
                                className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition flex items-center gap-2"
                            >
                                <Briefcase className="w-4 h-4" /> Proceed to Escrow
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* START ESCROW MODAL */}
            {escrowMatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-indigo-600" /> Deploy Milestone Escrow
                                </h3>
                                <p className="text-xs text-slate-500">Lock CSR funds in a multi-signature smart contract</p>
                            </div>
                            <button onClick={() => setEscrowMatch(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {escrowStep === 'review' && (
                            <div className="space-y-4 text-xs">
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Project</span>
                                        <span className="font-bold text-slate-900">{escrowMatch.project}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Beneficiary NGO</span>
                                        <span className="font-bold text-slate-900">{escrowMatch.ngo}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Total Committed Amount</span>
                                        <span className="font-mono font-bold text-slate-900">{escrowMatch.fundingRequired}</span>
                                    </div>
                                    <div className="flex justify-between text-indigo-600 font-semibold pt-1 border-t border-slate-200">
                                        <span>Initial Tranche 1 Lock (30%)</span>
                                        <span className="font-mono">₹{((escrowMatch.fundingAmountNum * 0.3)).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-indigo-900 text-[11px] leading-relaxed">
                                    ℹ️ <strong>Release Mechanism:</strong> Funds remain securely locked in the smart contract. 
                                    Neither the NGO nor Corporate can unilaterally withdraw. Releases occur solely when field photos, 
                                    GPS geotags, and invoices pass automated validation.
                                </div>

                                <div className="pt-2 flex justify-end gap-2">
                                    <button
                                        onClick={() => setEscrowMatch(null)}
                                        className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleConfirmEscrow(escrowMatch)}
                                        className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition flex items-center gap-2"
                                    >
                                        <Briefcase className="w-4 h-4" /> Sign & Lock Tranche Funds
                                    </button>
                                </div>
                            </div>
                        )}

                        {escrowStep === 'deploying' && (
                            <div className="py-8 text-center space-y-3">
                                <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                <div className="font-bold text-slate-900 text-sm">Deploying Tranche Escrow Contract...</div>
                                <div className="text-xs text-slate-500">Broadcasting transaction to Polygon Network...</div>
                            </div>
                        )}

                        {escrowStep === 'completed' && (
                            <div className="py-6 text-center space-y-4">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                    <Check className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-base">Escrow Successfully Activated!</div>
                                    <div className="text-xs text-slate-500 mt-1">Smart contract state initialized with 3 milestones.</div>
                                </div>
                                <button
                                    onClick={() => setEscrowMatch(null)}
                                    className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition text-xs"
                                >
                                    Return to CSR Dashboard
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

