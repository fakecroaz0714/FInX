import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Search, FileText, Check, X, Building, AlertCircle } from "lucide-react";

export default function ValidationPage() {
    const pendingValidations = [
        {
            id: "VAL-8829",
            ngo: "EduCare Org",
            submittedAt: "2 hours ago",
            documents: ["Registration Cert.", "Financial Audit 2024", "Board Resolution"],
            riskLevel: "Medium",
        },
        {
            id: "VAL-8830",
            ngo: "Rural Health Initiative",
            submittedAt: "1 day ago",
            documents: ["Registration Cert.", "Tax Exemption (80G)", "Foreign Contribution (FCRA)"],
            riskLevel: "Low",
        },
        {
            id: "VAL-8831",
            ngo: "Urban Tech Solutions",
            submittedAt: "3 days ago",
            documents: ["Registration Cert.", "Incomplete Audit"],
            riskLevel: "High",
        }
    ];

    return (
        <div className="p-8 pb-20">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">NGO Validation Queue</h1>
                    <p className="text-slate-500 mt-1">Review NGO documentation and compliance before CSR matching.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                        <Search className="w-5 h-5 text-slate-400 ml-3" />
                        <input
                            type="text"
                            placeholder="Search by ID or NGO Name..."
                            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 py-2"
                        />
                    </div>

                    <div className="space-y-4">
                        {pendingValidations.map((item, idx) => (
                            <Card key={idx} className="border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                                <Building className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{item.ngo}</h3>
                                                <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                                                    <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{item.id}</span>
                                                    • Submitted {item.submittedAt}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={item.riskLevel === 'Low' ? 'success' : item.riskLevel === 'High' ? 'danger' : 'warning'}>
                                            Risk: {item.riskLevel}
                                        </Badge>
                                    </div>

                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-6">
                                        <div className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">Submitted Documents</div>
                                        <div className="flex flex-wrap gap-2">
                                            {item.documents.map((doc, docIdx) => (
                                                <div key={docIdx} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-md text-sm text-slate-700">
                                                    <FileText className="w-4 h-4 text-indigo-500" /> {doc}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 justify-end border-t border-slate-100 pt-5">
                                        <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                                            <FileText className="w-4 h-4" /> Request Info
                                        </button>
                                        <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2">
                                            <X className="w-4 h-4" /> Reject
                                        </button>
                                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
                                            <Check className="w-4 h-4" /> Approve NGO
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="border border-slate-200 shadow-sm bg-indigo-900 border-none text-white">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-lg mb-2 text-white">Validation Guidelines</h3>
                            <p className="text-indigo-200 text-sm mb-4 leading-relaxed">
                                Remember: Platform validation does <b>not</b> guarantee government approval.
                                Focus on document authenticity, financial clarity, and track record.
                            </p>
                            <ul className="space-y-3 text-sm text-indigo-100">
                                <li className="flex gap-2 items-start">
                                    <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                    <span>Always cross-check Registration ID with the national portal.</span>
                                </li>
                                <li className="flex gap-2 items-start">
                                    <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                    <span>Audit reports must be from the last financial year.</span>
                                </li>
                                <li className="flex gap-2 items-start">
                                    <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                    <span>Mark "High Risk" if there are discrepancies in board member details.</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
