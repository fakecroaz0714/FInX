'use client';

import AIProposalVerificationPanel from "@/components/AIProposalVerificationPanel";
import { Building2, Activity } from "lucide-react";
import Link from 'next/link';

export default function CorporatePage() {
    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Corporate Funding Panel</h1>
                    <p className="text-xs md:text-sm text-slate-500 mt-1">AI NGO Proposal Verification Engine, Validator Panel & CSR Milestone Controls.</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <Link href="/verified-milestones" className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm">
                        <Activity className="w-4 h-4 text-indigo-400" /> Milestone Funding Engine
                    </Link>
                </div>
            </header>

            {/* AI NGO PROPOSAL VERIFICATION ENGINE MODULE */}
            <AIProposalVerificationPanel />
        </div>
    );
}
