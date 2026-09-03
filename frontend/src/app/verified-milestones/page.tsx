'use client';

import LiveHackathonWorkflowEngine from '@/components/LiveHackathonWorkflowEngine';
import VerifiedMilestonesEngine from '@/components/VerifiedMilestonesEngine';
import { useState } from 'react';
import { Sparkles, Layers } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function VerifiedMilestonesPage() {
    const { t } = useLanguage();
    const [viewMode, setViewMode] = useState<'HACKATHON_DEMO' | 'MILESTONE_CONTROL'>('HACKATHON_DEMO');

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                        {t('verified_milestones_page_title', 'FINX Verified Milestone Funding Engine')}
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 mt-1">
                        {t('verified_milestones_page_desc', 'Conditional CSR fund release system backed by geotagged evidence, SHA-256 duplicate image hashing, and Multi-Model AI analysis.')}
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-bold shrink-0">
                    <button
                        onClick={() => setViewMode('HACKATHON_DEMO')}
                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${viewMode === 'HACKATHON_DEMO' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" /> {t('tab_hackathon_demo', 'Live Hackathon Demo Engine')}
                    </button>
                    <button
                        onClick={() => setViewMode('MILESTONE_CONTROL')}
                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${viewMode === 'MILESTONE_CONTROL' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                        <Layers className="w-3.5 h-3.5" /> {t('tab_escrow_milestones', 'Escrow Milestone Controls')}
                    </button>
                </div>
            </header>

            {viewMode === 'HACKATHON_DEMO' ? (
                <LiveHackathonWorkflowEngine />
            ) : (
                <VerifiedMilestonesEngine />
            )}
        </div>
    );
}
