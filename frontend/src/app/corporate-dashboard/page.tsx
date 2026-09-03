'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
    LayoutDashboard, Briefcase, FileSignature, Users, PieChart,
    Coins, MapPin, Building2, TrendingUp, ShieldCheck, FileCheck2, Filter, ChevronRight, CheckCircle2, AlertCircle, X, Sparkles
} from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { CorporateActiveProjectsMap } from '@/components/maps/CorporateActiveProjectsMap';
import { useProposals } from '@/lib/ProposalContext';
import { useAuth, CorporateProfile } from '@/lib/AuthContext';
import ImpactEvidenceUploader from '@/components/ImpactEvidenceUploader';

export default function CorporateDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Overview');
    const { proposals, approveFunding } = useProposals();

    const corpProfile = (user?.profile as CorporateProfile) || {};
    const companyName = corpProfile.companyName || user?.name || 'TechCorp India Ltd';
    const rawBudget = corpProfile.csrBudget ? Number(corpProfile.csrBudget) : 10000000;
    const formattedBudget = '₹' + rawBudget.toLocaleString('en-IN');
    const preferredCategories = corpProfile.csrCategories && corpProfile.csrCategories.length > 0
        ? corpProfile.csrCategories
        : ['Education', 'Environment', 'Healthcare'];
    const preferredLocations = corpProfile.preferredLocations || 'Maharashtra, Karnataka, Telangana';

    // Publish Opportunity Modal State
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [oppTitle, setOppTitle] = useState('');
    const [oppCategory, setOppCategory] = useState(preferredCategories[0] || 'Education');
    const [oppBudget, setOppBudget] = useState('2500000');
    const [oppLocation, setOppLocation] = useState(preferredLocations.split(',')[0]?.trim() || 'Maharashtra');
    const [oppDescription, setOppDescription] = useState('');
    const [publishedNotification, setPublishedNotification] = useState<string | null>(null);

    const budgetData = [
        { name: 'Education', value: Math.round(rawBudget * 0.4), color: '#3b82f6' },
        { name: 'Environment', value: Math.round(rawBudget * 0.3), color: '#10b981' },
        { name: 'Healthcare', value: Math.round(rawBudget * 0.25), color: '#8b5cf6' },
        { name: 'Remaining', value: Math.round(rawBudget * 0.05), color: '#e2e8f0' }
    ];

    const handlePublishOpportunity = (e: React.FormEvent) => {
        e.preventDefault();
        if (!oppTitle.trim()) return;

        setPublishedNotification(`Opportunity "${oppTitle}" successfully published under ${companyName}! Verified NGOs can now apply.`);
        setShowPublishModal(false);
        setOppTitle('');
        setOppDescription('');

        setTimeout(() => {
            setPublishedNotification(null);
        }, 6000);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Budget Planning':
                return (
                    <div className="space-y-6">
                        <Card className="border-indigo-100 shadow-sm">
                            <CardHeader className="bg-indigo-50/50 border-b border-indigo-50">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg text-indigo-900">FY 2024 CSR Strategy: {companyName}</CardTitle>
                                    <Badge variant="default" className="text-xs">Active Mandate</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Annual Declared CSR Budget</label>
                                            <span className="text-[11px] text-emerald-600 font-bold">Auto-synced from Corporate Profile</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={formattedBudget}
                                            disabled
                                            className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 font-mono text-xl font-bold text-slate-900"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700">Preferred Regions</label>
                                            <input
                                                type="text"
                                                value={preferredLocations}
                                                disabled
                                                className="w-full p-2.5 border border-slate-200 rounded-lg mt-1 bg-slate-50 text-xs font-medium text-slate-800"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700">Corporate CIN</label>
                                            <input
                                                type="text"
                                                value={corpProfile.registrationNumber || 'L72200MH2005PLC154872'}
                                                disabled
                                                className="w-full p-2.5 border border-slate-200 rounded-lg mt-1 bg-slate-50 text-xs font-mono text-slate-800"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Mandate Categories</label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {preferredCategories.map(cat => (
                                                <Badge key={cat} variant="neutral" className="text-xs px-2.5 py-1">
                                                    {cat}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowPublishModal(true)}
                                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-200 text-sm flex items-center justify-center gap-2"
                                    >
                                        <FileSignature className="w-4 h-4" /> Publish New CSR Opportunity
                                    </button>
                                </div>
                                <div className="h-64 flex flex-col items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPie>
                                            <Pie data={budgetData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                {budgetData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                                        </RechartsPie>
                                    </ResponsiveContainer>
                                    <div className="text-xs text-slate-500 font-medium mt-2 flex gap-4">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Education</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Environment</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Healthcare</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-200"></span> Buffer</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'Compare NGOs':
                const validatedProposals = proposals.filter(p => p.status === 'NGO Validated');

                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div>
                                <h3 className="font-bold text-slate-900">Validated NGO Proposals</h3>
                                <p className="text-sm text-slate-500">Awaiting your CSR budget approval and escrow locking.</p>
                            </div>
                            <div className="flex gap-3">
                                <Badge variant="neutral">Filter by FINX Score &gt; 90</Badge>
                                <Badge variant="neutral">Auto-Match Tags</Badge>
                            </div>
                        </div>

                        {validatedProposals.length === 0 ? (
                            <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500 font-medium border border-slate-200">
                                No new validated proposals awaiting your review right now.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {validatedProposals.map((p) => (
                                    <Card key={p.id} className="border-emerald-200 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">Recommended</div>
                                        <CardContent className="p-6">
                                            <h2 className="text-xl font-bold text-slate-900 mb-1">{p.ngoName}</h2>
                                            <div className="text-xs text-slate-500 mb-4">{p.title}</div>
                                            <div className="flex gap-2 mb-4">
                                                <Badge variant="success">Verified Validator</Badge>
                                                <Badge variant="neutral">{p.category}</Badge>
                                            </div>
                                            <table className="w-full text-sm">
                                                <tbody className="divide-y divide-slate-100">
                                                    <tr><td className="py-2 text-slate-500">Proposed Cost</td><td className="py-2 font-mono font-bold">₹{p.totalFunding.toLocaleString('en-IN')}</td></tr>
                                                    <tr><td className="py-2 text-slate-500">Target Beneficiaries</td><td className="py-2 font-semibold">{p.beneficiaries}</td></tr>
                                                    <tr><td className="py-2 text-slate-500">Cost per Beneficiary</td><td className="py-2 font-semibold text-emerald-600">₹{p.beneficiaries ? Math.round(p.totalFunding / p.beneficiaries) : 0}</td></tr>
                                                    <tr><td className="py-2 text-slate-500">Location</td><td className="py-2 font-semibold">{p.location}</td></tr>
                                                    <tr><td className="py-2 text-slate-500">Milestones</td><td className="py-2 font-semibold">Total {p.milestones.length} Stages</td></tr>
                                                </tbody>
                                            </table>
                                            <div className="flex gap-3 mt-6">
                                                <button onClick={() => approveFunding(p.id, companyName)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition">Approve & Fund</button>
                                                <button className="px-4 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition">Reject</button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'Escrow Control':
                const escrowProposals = proposals.filter(p => ['Escrow Funded', 'Active', 'Completed'].includes(p.status));

                return (
                    <Card className="border-slate-200">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg">Active Escrow Contracts for {companyName}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {escrowProposals.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 font-medium">No active escrow contracts found.</div>
                            ) : (
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                                        <tr><th className="p-4">Contract ID</th><th className="p-4">NGO Partner</th><th className="p-4">Total Value</th><th className="p-4">Released</th><th className="p-4">Next Action</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {escrowProposals.map(p => {
                                            const releasedSum = p.milestones.filter(m => m.status === 'Released').reduce((s, m) => s + m.amount, 0);
                                            const progress = p.totalFunding ? Math.round((releasedSum / p.totalFunding) * 100) : 0;
                                            return (
                                                <tr key={p.id} className="hover:bg-slate-50">
                                                    <td className="p-4 font-mono font-bold text-indigo-600">{p.escrowId || '0xESC...'}</td>
                                                    <td className="p-4">{p.ngoName}</td>
                                                    <td className="p-4 font-mono">₹{p.totalFunding.toLocaleString('en-IN')}</td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-20 bg-slate-200 rounded-full h-2"><div className="bg-emerald-500 h-full rounded-full" style={{ width: `${progress}%` }}></div></div>
                                                            <span className="font-mono text-xs">{progress}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge variant={p.status === 'Completed' ? 'success' : 'warning'}>{p.status === 'Completed' ? 'Closed' : 'Awaiting Milestones'}</Badge>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </CardContent>
                    </Card>
                );
            case 'Impact Reports':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-emerald-50 border-emerald-200"><CardContent className="p-6"><div className="text-emerald-700 font-bold mb-1">Total Beneficiaries</div><div className="text-3xl font-bold font-mono">14,500+</div></CardContent></Card>
                            <Card className="bg-indigo-50 border-indigo-200"><CardContent className="p-6"><div className="text-indigo-700 font-bold mb-1">Fund Utilization</div><div className="text-3xl font-bold font-mono">92%</div></CardContent></Card>
                            <Card className="bg-amber-50 border-amber-200"><CardContent className="p-6"><div className="text-amber-700 font-bold mb-1">Active Regions</div><div className="text-3xl font-bold font-mono">8 States</div></CardContent></Card>
                        </div>
                        <ImpactEvidenceUploader />
                    </div>
                );
            case 'Active Projects Map':
                return <CorporateActiveProjectsMap />;
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="md:col-span-1 shadow-sm border-slate-200">
                            <CardContent className="p-6">
                                <div className="p-3 bg-indigo-100 rounded-lg w-max mb-4"><Coins className="w-6 h-6 text-indigo-600" /></div>
                                <div className="text-sm font-semibold text-slate-500">Declared CSR Budget</div>
                                <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">{formattedBudget}</div>
                                <div className="text-[11px] text-slate-400 mt-1">Available for matching</div>
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-1 shadow-sm border-slate-200">
                            <CardContent className="p-6">
                                <div className="p-3 bg-emerald-100 rounded-lg w-max mb-4"><ShieldCheck className="w-6 h-6 text-emerald-600" /></div>
                                <div className="text-sm font-semibold text-slate-500">Active Projects</div>
                                <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">12</div>
                                <div className="text-[11px] text-emerald-600 font-medium mt-1">100% On-Chain escrow</div>
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-1 shadow-sm border-slate-200">
                            <CardContent className="p-6">
                                <div className="p-3 bg-amber-100 rounded-lg w-max mb-4"><FileSignature className="w-6 h-6 text-amber-600" /></div>
                                <div className="text-sm font-semibold text-slate-500">Pending Applications</div>
                                <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">4</div>
                                <div className="text-[11px] text-amber-600 font-medium mt-1">NGO verified proofs</div>
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-1 shadow-sm border-slate-200">
                            <CardContent className="p-6">
                                <div className="p-3 bg-blue-100 rounded-lg w-max mb-4"><Users className="w-6 h-6 text-blue-600" /></div>
                                <div className="text-sm font-semibold text-slate-500">Impact Reach</div>
                                <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">14K+</div>
                                <div className="text-[11px] text-blue-600 font-medium mt-1">Direct rural beneficiaries</div>
                            </CardContent>
                        </Card>

                        {/* Interactive Corporate Map Spotlight Banner */}
                        <div className="md:col-span-4 mt-2">
                            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-white border border-blue-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm ring-4 ring-blue-100">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm md:text-base">Active Corporate CSR Investment Map</h4>
                                        <p className="text-xs text-slate-600 mt-0.5">
                                            Track smart escrow deployments, released tranches, and SDG outcomes across 5 regional project sites.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveTab('Active Projects Map')}
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs whitespace-nowrap flex items-center gap-1.5"
                                >
                                    Open Portfolio Map &rarr;
                                </button>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="p-8 pb-20 max-w-7xl mx-auto space-y-8">
            {publishedNotification && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between shadow-sm animate-in fade-in">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-sm font-bold text-emerald-900">{publishedNotification}</span>
                    </div>
                    <button onClick={() => setPublishedNotification(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">Dismiss</button>
                </div>
            )}

            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="default" className="text-[11px]">Corporate Funder Portal</Badge>
                        <span className="text-xs font-mono text-slate-400">Budget: {formattedBudget}</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{companyName}</h1>
                    <p className="text-slate-500 mt-1 font-medium text-xs md:text-sm">
                        Manage budgets, securely deploy funds, and track verifiable milestone impact.
                    </p>
                </div>
                <button
                    onClick={() => setShowPublishModal(true)}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition flex items-center gap-2 shadow-md shadow-indigo-200 cursor-pointer shrink-0"
                >
                    <FileSignature className="w-4 h-4" /> Publish New Opportunity
                </button>
            </header>

            <nav className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 border-b border-slate-200 hide-scrollbar">
                {['Overview', 'Active Projects Map', 'Budget Planning', 'Compare NGOs', 'Escrow Control', 'Impact Reports'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2.5 rounded-t-lg font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                    >
                        {tab}
                    </button>
                ))}
            </nav>

            <div className="pt-2">
                {renderTabContent()}
            </div>

            {/* =========================================================================
                PUBLISH NEW OPPORTUNITY MODAL (Uses logged-in Corporate Profile Name)
               ========================================================================= */}
            {showPublishModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-indigo-600" /> Publish CSR Opportunity
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">Publish funding mandate for verified NGOs to submit milestone proposals.</p>
                            </div>
                            <button onClick={() => setShowPublishModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handlePublishOpportunity} className="space-y-4 text-xs">
                            {/* Company Name (Auto-populated from logged-in profile) */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Corporate Sponsor Name</label>
                                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">Auto-filled from Profile</span>
                                </div>
                                <input
                                    type="text"
                                    value={companyName}
                                    disabled
                                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg bg-slate-50 font-bold text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Opportunity / Project Title <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Rural Clean Water & Solar Infrastructure Initiative"
                                    value={oppTitle}
                                    onChange={e => setOppTitle(e.target.value)}
                                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-semibold text-slate-700 block mb-1">Target Category</label>
                                    <select
                                        value={oppCategory}
                                        onChange={e => setOppCategory(e.target.value)}
                                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                    >
                                        {preferredCategories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="font-semibold text-slate-700 block mb-1">Total Allocated Budget (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="2500000"
                                        value={oppBudget}
                                        onChange={e => setOppBudget(e.target.value)}
                                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Target Location</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Pune & Satara Districts, Maharashtra"
                                    value={oppLocation}
                                    onChange={e => setOppLocation(e.target.value)}
                                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Project Scope & Guidelines</label>
                                <textarea
                                    rows={3}
                                    placeholder="Specify goals, required milestones, and NGO eligibility criteria..."
                                    value={oppDescription}
                                    onChange={e => setOppDescription(e.target.value)}
                                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowPublishModal(false)}
                                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-200 flex items-center gap-1.5"
                                >
                                    <FileSignature className="w-3.5 h-3.5" /> Publish to Verified NGOs
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
