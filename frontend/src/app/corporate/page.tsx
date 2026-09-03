import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Building2, ExternalLink, Activity } from "lucide-react";

export default function CorporatePage() {
    const corporates = [
        { name: "TechCorp India", budget: "₹1.5M", sector: "Technology", status: "Active Matching" },
        { name: "GreenFuture Energy", budget: "₹4.0M", sector: "Energy", status: "Reviewing NGOs" },
        { name: "GlobalRetail", budget: "₹800K", sector: "Retail", status: "Escrow Locked" },
    ];

    return (
        <div className="p-8 pb-20">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Corporate Partners</h1>
                <p className="text-slate-500 mt-1">Directory of participating CSR funders.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {corporates.map((corp, i) => (
                    <Card key={i} className="border border-slate-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">{corp.name}</h3>
                                    <div className="text-sm text-slate-500">{corp.sector}</div>
                                </div>
                            </div>

                            <div className="space-y-3 mt-4 pt-4 border-t border-slate-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Declared Budget</span>
                                    <span className="font-bold text-slate-900">{corp.budget}</span>
                                </div>
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-slate-500">Status</span>
                                    <Badge variant={corp.status === 'Active Matching' ? 'success' : 'neutral'}>
                                        {corp.status}
                                    </Badge>
                                </div>
                            </div>

                            <button className="w-full mt-6 flex justify-center items-center gap-2 bg-indigo-50 text-indigo-700 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors">
                                View CSR Mandate <ExternalLink className="w-4 h-4" />
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
