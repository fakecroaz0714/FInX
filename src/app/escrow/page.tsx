import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FileCheck2, Lock, Unlock, Camera, ArrowRight, ShieldCheck, History } from "lucide-react";

export default function EscrowPage() {
    const milestones = [
        {
            id: 1,
            title: "Initial Feasibility & Setup",
            amount: "$12,500",
            status: "Released",
            date: "Oct 12, 2024",
            proof: "Survey Report Verified"
        },
        {
            id: 2,
            title: "Equipment Procurement",
            amount: "$25,000",
            status: "Reviewing",
            date: "Pending",
            proof: "Invoices Submitted"
        },
        {
            id: 3,
            title: "Installation & Training",
            amount: "$12,500",
            status: "Locked",
            date: "Est. Dec 2024",
            proof: "-"
        }
    ];

    return (
        <div className="p-8 pb-20">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Smart Escrow Controls</h1>
                <p className="text-slate-500 mt-1">Manage milestone-based fund releases backed by verified impact claims.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-slate-200 shadow-sm overflow-hidden text-sm">
                        <CardHeader className="bg-slate-900 text-white pb-6 pt-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <Badge className="bg-indigo-500/30 text-indigo-200 border-indigo-400 mb-2">Contract ACtive</Badge>
                                    <CardTitle className="text-xl text-white">Clean Water Initiative - Pune</CardTitle>
                                    <CardDescription className="text-slate-400 mt-1">Smart Contract: 0x8F9...3B1A</CardDescription>
                                </div>
                                <div className="text-right">
                                    <div className="text-indigo-200 text-xs uppercase tracking-wider font-semibold mb-1">Total Locked</div>
                                    <div className="text-2xl font-bold font-mono">$50,000</div>
                                </div>
                            </div>

                            <div className="w-full bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
                                <div className="bg-indigo-500 h-full w-1/4 rounded-full"></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 mt-2">
                                <span>$12,500 Released</span>
                                <span>$37,500 Remaining</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {milestones.map((m) => (
                                    <div key={m.id} className={`p-6 flex items-start gap-4 ${m.status === 'Reviewing' ? 'bg-amber-50/30' : ''}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${m.status === 'Released' ? 'bg-emerald-100 text-emerald-600' :
                                                m.status === 'Reviewing' ? 'bg-amber-100 text-amber-600' :
                                                    'bg-slate-100 text-slate-400'
                                            }`}>
                                            {m.status === 'Released' ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-slate-900">Milestone {m.id}: {m.title}</h4>
                                                <span className="font-mono font-bold text-slate-700">{m.amount}</span>
                                            </div>

                                            <div className="flex items-center gap-3 mt-2 text-sm">
                                                <Badge variant={
                                                    m.status === 'Released' ? 'success' :
                                                        m.status === 'Reviewing' ? 'warning' : 'neutral'
                                                }>{m.status}</Badge>
                                                <span className="text-slate-400">•</span>
                                                <span className="text-slate-500 flex items-center gap-1">
                                                    {m.status !== 'Locked' ? <History className="w-3.5 h-3.5" /> : null}
                                                    {m.date}
                                                </span>
                                            </div>

                                            {m.status === 'Reviewing' && (
                                                <div className="mt-4 bg-white border border-amber-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="font-semibold text-slate-900 text-xs uppercase tracking-wider">Proof Submission Actions</span>
                                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Camera className="w-3 h-3" /> Geometric verification attached
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-600 text-sm mb-4">NGO has submitted invoice copies and geocoded photographs of equipment delivery at the site.</p>
                                                    <div className="flex gap-2">
                                                        <button className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded font-medium hover:bg-slate-50 text-xs">
                                                            View Evidence
                                                        </button>
                                                        <button className="flex-1 bg-indigo-600 text-white border border-indigo-600 py-2 rounded font-medium hover:bg-indigo-700 text-xs flex items-center justify-center gap-1">
                                                            <ShieldCheck className="w-3.5 h-3.5" /> Approve Release
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg">Blockchain Prototype</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 font-mono text-xs bg-slate-900 text-slate-300 rounded-b-xl overflow-hidden">
                            <div className="text-indigo-400 mb-2">// Network: Hardhat Local</div>
                            <div className="text-emerald-400 opacity-80 mb-1">➔ Contract Initialized: 0x8F9...</div>
                            <div className="text-emerald-400 opacity-80 mb-1">➔ Fund Deposit Confirmed: 50K USDC</div>
                            <div className="text-emerald-400 opacity-80 mb-4">➔ Milestone 1 Unlock Event Fired</div>

                            <div className="text-amber-400 mb-1 animate-pulse">➔ Awaiting approval sig for M2...</div>

                            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-slate-500">
                                <span>View on Explorer</span>
                                <ArrowRight className="w-4 h-4 cursor-pointer hover:text-white" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
