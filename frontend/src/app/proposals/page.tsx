'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProposals, Proposal } from '@/lib/ProposalContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
    FileText, Plus, CheckCircle2, Clock, ShieldCheck, MapPin, 
    Building2, Eye, Calendar, ArrowRight, X, Sparkles, Filter
} from 'lucide-react';
import { useLanguage } from "@/lib/LanguageContext";

export default function ProposalsDirectoryPage() {
    const { t } = useLanguage();
    const { proposals } = useProposals();
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

    const filteredProposals = statusFilter === 'All' 
        ? proposals 
        : proposals.filter(p => p.status === statusFilter);

    const counts = {
        total: proposals.length,
        active: proposals.filter(p => p.status === 'Active' || p.status === 'Escrow Funded').length,
        approved: proposals.filter(p => p.status === 'Approved').length,
        submitted: proposals.filter(p => p.status === 'Submitted' || p.status === 'NGO Validated').length,
        draft: proposals.filter(p => p.status === 'Draft').length
    };

    return (
        <div className="p-8 pb-24 max-w-7xl mx-auto space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">CSR Project Proposals</h1>
                    <p className="text-slate-500 mt-1">Directory of standardized milestone-based funding proposals.</p>
                </div>
                <Link
                    href="/proposals/new"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold transition shadow-sm flex items-center gap-2 cursor-pointer text-sm"
                >
                    <Plus className="w-4 h-4" /> Create New Proposal
                </Link>
            </header>

            {/* Quick Metrics & Filter Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card 
                    onClick={() => setStatusFilter('All')} 
                    className={`cursor-pointer transition border ${statusFilter === 'All' ? 'ring-2 ring-indigo-500 border-indigo-300 bg-indigo-50/20' : 'border-slate-200 hover:border-slate-300'}`}
                >
                    <CardContent className="p-5">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Proposals</div>
                        <div className="text-2xl font-bold text-slate-900 mt-1">{counts.total}</div>
                        <div className="text-[11px] text-indigo-600 font-medium mt-1">Show all</div>
                    </CardContent>
                </Card>

                <Card 
                    onClick={() => setStatusFilter('Active')} 
                    className={`cursor-pointer transition border ${statusFilter === 'Active' ? 'ring-2 ring-emerald-500 border-emerald-300 bg-emerald-50/20' : 'border-slate-200 hover:border-slate-300'}`}
                >
                    <CardContent className="p-5">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active & Escrowed</div>
                        <div className="text-2xl font-bold text-emerald-600 mt-1">{counts.active}</div>
                        <div className="text-[11px] text-emerald-600 font-medium mt-1">In execution</div>
                    </CardContent>
                </Card>

                <Card 
                    onClick={() => setStatusFilter('Submitted')} 
                    className={`cursor-pointer transition border ${statusFilter === 'Submitted' ? 'ring-2 ring-amber-500 border-amber-300 bg-amber-50/20' : 'border-slate-200 hover:border-slate-300'}`}
                >
                    <CardContent className="p-5">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted / Audit</div>
                        <div className="text-2xl font-bold text-amber-500 mt-1">{counts.submitted}</div>
                        <div className="text-[11px] text-amber-600 font-medium mt-1">Pending validation</div>
                    </CardContent>
                </Card>

                <Card 
                    onClick={() => setStatusFilter('Draft')} 
                    className={`cursor-pointer transition border ${statusFilter === 'Draft' ? 'ring-2 ring-slate-500 border-slate-300 bg-slate-100' : 'border-slate-200 hover:border-slate-300'}`}
                >
                    <CardContent className="p-5">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Saved Drafts</div>
                        <div className="text-2xl font-bold text-slate-700 mt-1">{counts.draft}</div>
                        <div className="text-[11px] text-slate-500 font-medium mt-1">Unsubmitted</div>
                    </CardContent>
                </Card>
            </div>

            {/* Proposals List */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900">
                        Proposals ({filteredProposals.length})
                    </h2>
                    {statusFilter !== 'All' && (
                        <button 
                            onClick={() => setStatusFilter('All')}
                            className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                        >
                            Reset Filter (Show All)
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredProposals.map((proposal) => (
                        <Card key={proposal.id} className="border border-slate-200 hover:border-indigo-300 transition shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <Badge variant="neutral" className="bg-indigo-50 text-indigo-700 text-xs">
                                        {proposal.category}
                                    </Badge>
                                    <Badge variant={
                                        proposal.status === 'Active' || proposal.status === 'Escrow Funded' ? 'success' :
                                        proposal.status === 'Approved' ? 'success' :
                                        proposal.status === 'Submitted' || proposal.status === 'NGO Validated' ? 'warning' :
                                        proposal.status === 'Draft' ? 'neutral' : 'danger'
                                    }>
                                        {proposal.status}
                                    </Badge>
                                </div>

                                <h3 className="font-bold text-slate-900 text-base mb-1">{proposal.title}</h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                                    <Building2 className="w-3.5 h-3.5" /> {proposal.ngoName} • <MapPin className="w-3.5 h-3.5" /> {proposal.location}
                                </p>

                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1.5 mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Total Funding Ask:</span>
                                        <span className="font-mono font-bold text-slate-900">₹{(proposal.totalFunding || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Target Beneficiaries:</span>
                                        <span className="font-semibold text-slate-800">{(proposal.beneficiaries || 0).toLocaleString()} people</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Escrow Tranches:</span>
                                        <span className="font-semibold text-indigo-600">{proposal.milestones?.length || 0} Milestones</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedProposal(proposal)}
                                    className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <Eye className="w-3.5 h-3.5" /> View Proposal Dossier
                                </button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* PROPOSAL DOSSIER MODAL */}
            {selectedProposal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="neutral" className="bg-indigo-50 text-indigo-700">{selectedProposal.category}</Badge>
                                    <Badge variant={selectedProposal.status === 'Active' || selectedProposal.status === 'Approved' ? 'success' : 'warning'}>
                                        {selectedProposal.status}
                                    </Badge>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedProposal.title}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">By {selectedProposal.ngoName} (Reg: {selectedProposal.ngoRegNum || 'MH/2021/0109'}) • {selectedProposal.location}</p>
                            </div>
                            <button onClick={() => setSelectedProposal(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                    <span className="text-slate-400 block mb-0.5">Total Funding Ask</span>
                                    <span className="text-lg font-mono font-bold text-slate-900">₹{(selectedProposal.totalFunding || 0).toLocaleString()}</span>
                                </div>
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                    <span className="text-slate-400 block mb-0.5">Direct Beneficiaries</span>
                                    <span className="text-lg font-bold text-indigo-600">{(selectedProposal.beneficiaries || 0).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                                <div className="font-bold text-slate-700">Problem Statement</div>
                                <p className="text-slate-600 leading-relaxed">{selectedProposal.problem || "Acute community need reported via citizen petitions."}</p>
                            </div>

                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                                <div className="font-bold text-slate-700">Proposed Solution</div>
                                <p className="text-slate-600 leading-relaxed">{selectedProposal.solution || "Technical deployment with milestone verification."}</p>
                            </div>

                            <div>
                                <div className="font-bold text-slate-700 mb-2">Milestone Tranche Breakdown</div>
                                <div className="space-y-2">
                                    {selectedProposal.milestones?.map((m, mIdx) => (
                                        <div key={mIdx} className="p-3 bg-white border border-slate-200 rounded-lg flex justify-between items-center">
                                            <div>
                                                <div className="font-semibold text-slate-800">M{mIdx + 1}: {m.title}</div>
                                                <div className="text-slate-400 text-[11px]">Tranche Allocation: {m.percentage}%</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono font-bold text-slate-900">₹{(m.amount || 0).toLocaleString()}</div>
                                                <Badge variant={m.status === 'Approved' ? 'success' : 'neutral'} className="text-[10px]">
                                                    {m.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setSelectedProposal(null)}
                                className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition text-xs cursor-pointer"
                            >
                                Close Dossier
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
