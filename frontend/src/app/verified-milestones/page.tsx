import VerifiedMilestonesEngine from '@/components/VerifiedMilestonesEngine';

export default function VerifiedMilestonesPage() {
    return (
        <div className="p-8 pb-20 max-w-7xl mx-auto space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Verified Milestone Funding Engine</h1>
                    <p className="text-slate-500 mt-1">
                        Conditional CSR fund release system backed by geotagged evidence, SHA-256 duplicate image hashing, and AI progress analysis.
                    </p>
                </div>
            </header>

            <VerifiedMilestonesEngine />
        </div>
    );
}
