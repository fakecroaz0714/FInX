'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Search, ShieldAlert, FileCheck2, Building2, MapPin, Eye, AlertTriangle, CheckCircle2, FileText, AlertCircle, RefreshCw } from 'lucide-react';

const mockNGOs = [
    {
        id: "NGO-1004", name: "Jal Seva NGO", type: "Trust", regNum: "TR-2015-893",
        csr1: "Valid", sec12a: "Valid", sec80g: "Valid", pan: "AAATJ9999K",
        location: "Pune, Maharashtra", score: 94, status: "Verified",
        documents: ["Registration Deed", "PAN Card", "CSR-1 Certificate", "Bank Details Validation", "Past Audit Report"]
    },
    {
        id: "NGO-1082", name: "Green Earth Foundation", type: "Section 8 Company", regNum: "U85300MH2020NPL348231",
        csr1: "Valid", sec12a: "Pending", sec80g: "Valid", pan: "ABCDE1234F",
        location: "Nagpur, Maharashtra", score: 68, status: "Needs Review",
        documents: ["MoA & AoA", "PAN Card", "CSR-1 Certificate", "Bank Mandate"]
    },
    {
        id: "NGO-1105", name: "Urban Health Initiative", type: "Society", regNum: "MH-12345/2019",
        csr1: "Missing", sec12a: "Expired", sec80g: "Expired", pan: "BXYZP5678H",
        location: "Mumbai, Maharashtra", score: 22, status: "High Risk",
        documents: ["Society Registration", "PAN Card"]
    }
];

export default function ValidatorDashboard() {
    const [selectedNGO, setSelectedNGO] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState('Overview');

    if (selectedNGO) {
        return (
            <div className="p-8 pb-24 max-w-7xl mx-auto space-y-6">
                <button onClick={() => setSelectedNGO(null)} className="text-sm text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-2 mb-4">
                    &larr; Back to Validation Queue
                </button>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{selectedNGO.name}</h1>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {selectedNGO.type}</span>
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {selectedNGO.location}</span>
                            <span>ID: <span className="font-mono text-slate-900">{selectedNGO.regNum}</span></span>
                        </div>
                    </div>
                    <Badge variant={selectedNGO.status === 'Verified' ? 'success' : selectedNGO.status === 'Needs Review' ? 'warning' : 'danger'} className="text-sm px-4 py-1.5 shadow-sm">
                        {selectedNGO.status}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: NGO Details & Docs */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between pb-4">
                                <CardTitle className="text-lg text-slate-800">Compliance & Registrations</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <table className="w-full text-sm text-left">
                                    <tbody className="divide-y divide-slate-100">
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-4 font-semibold text-slate-700 w-1/3">PAN Number</td>
                                            <td className="p-4 font-mono text-slate-900">{selectedNGO.pan}</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-4 font-semibold text-slate-700">CSR-1 Registration</td>
                                            <td className="p-4 text-slate-900"><Badge variant={selectedNGO.csr1 === 'Valid' ? 'success' : 'danger'}>{selectedNGO.csr1}</Badge></td>
                                        </tr>
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-4 font-semibold text-slate-700">12A Certificate</td>
                                            <td className="p-4 text-slate-900"><Badge variant={selectedNGO.sec12a === 'Valid' ? 'success' : 'warning'}>{selectedNGO.sec12a}</Badge></td>
                                        </tr>
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-4 font-semibold text-slate-700">80G Certificate</td>
                                            <td className="p-4 text-slate-900"><Badge variant={selectedNGO.sec80g === 'Valid' ? 'success' : selectedNGO.sec80g === 'Expired' ? 'danger' : 'neutral'}>{selectedNGO.sec80g}</Badge></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>

                        <Card className="border border-slate-200">
                            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg text-slate-800">Uploaded Evidence & Documents</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 grid grid-cols-2 gap-4">
                                {selectedNGO.documents.map((doc: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer transition-colors group">
                                        <FileText className="w-5 h-5 text-indigo-500" />
                                        <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-900">{doc}</span>
                                        <Eye className="w-4 h-4 text-slate-400 ml-auto group-hover:text-indigo-600" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Risk Score & Validation Actions */}
                    <div className="space-y-6">
                        <Card className="border-indigo-100">
                            <CardHeader className="bg-indigo-50/50 border-b border-indigo-50 pb-4">
                                <CardTitle className="text-sm text-indigo-900 uppercase tracking-wider flex items-center justify-between">
                                    Trust / Risk Score
                                    <ShieldAlert className="w-4 h-4 text-indigo-500" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 text-center">
                                <div className="text-6xl font-bold font-mono tracking-tighter" style={{ color: selectedNGO.score > 80 ? '#10b981' : selectedNGO.score > 50 ? '#f59e0b' : '#ef4444' }}>
                                    {selectedNGO.score}
                                </div>
                                <p className="text-xs text-slate-500 mt-2 font-medium">Assisted Transparency Score</p>

                                <div className="mt-6 space-y-3 text-sm text-left">
                                    <div className="flex justify-between items-center"><span className="text-slate-600">Document Completeness</span> <span className="font-semibold">{selectedNGO.score > 50 ? 'High' : 'Low'}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-slate-600">Financial History</span> <span className="font-semibold">{selectedNGO.score > 80 ? 'Verified' : 'Flagged'}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-slate-600">Location Auth</span> <span className="font-semibold">GPS Matched</span></div>
                                </div>
                                <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded mt-4 border border-amber-200 text-left flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>FINX analytics provide an assistance score. Final approval requires human validator review.</span>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Validator Actions</h3>
                            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                                <CheckCircle2 className="w-4 h-4" /> Approve Application
                            </button>
                            <button className="w-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 p-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                                <RefreshCw className="w-4 h-4" /> Request Clarification
                            </button>
                            <button className="w-full bg-white border border-amber-300 text-amber-700 hover:bg-amber-50 p-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                                <AlertTriangle className="w-4 h-4" /> Flag Suspicious
                            </button>
                            <button className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 p-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                                <AlertCircle className="w-4 h-4" /> Reject Organization
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 pb-20 max-w-7xl mx-auto space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">NGO Validator Dashboard</h1>
                    <p className="text-slate-500 mt-2 font-medium">Government-grade compliance and document auditing hub.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total NGOs</div>
                        <div className="text-3xl font-bold text-slate-900 mt-2">1,248</div>
                    </CardContent>
                </Card>
                <Card className="border border-slate-200 shadow-sm border-b-4 border-b-emerald-500">
                    <CardContent className="p-6">
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Verified</div>
                        <div className="text-3xl font-bold text-emerald-600 mt-2">892</div>
                    </CardContent>
                </Card>
                <Card className="border border-slate-200 shadow-sm border-b-4 border-b-amber-500">
                    <CardContent className="p-6">
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Needs Review</div>
                        <div className="text-3xl font-bold text-amber-600 mt-2">312</div>
                    </CardContent>
                </Card>
                <Card className="border border-slate-200 shadow-sm border-b-4 border-b-red-500">
                    <CardContent className="p-6">
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">High Risk</div>
                        <div className="text-3xl font-bold text-red-600 mt-2">44</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row justify-between items-center pb-4">
                    <div className="flex gap-4">
                        {['Overview', 'Validation Queue', 'Risk Assessment', 'Project Proposals', 'Audit Logs'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-sm font-medium pb-2 transition-colors ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input type="text" placeholder="Search NGO PAN or ID..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-indigo-600 outline-none" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {activeTab === 'Project Proposals' ? (
                        <div className="p-6 space-y-6">
                            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl relative">
                                <Badge variant="warning" className="absolute top-4 right-4">Awaiting Validator Review</Badge>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left: Citizen Petition */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">1. Citizen Petition</h3>
                                        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm">
                                            <h4 className="font-bold text-slate-900">Build Primary School Roof</h4>
                                            <div className="text-xs text-slate-500 mt-2 flex gap-3">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Pune, MH</span>
                                                <span>Beneficiaries: <strong className="text-slate-700">250 Children</strong></span>
                                            </div>
                                            <p className="text-sm mt-3 text-slate-600 italic border-l-2 border-slate-200 pl-3">"Currently studying under open sun. Monsoons destroy books every year."</p>
                                        </div>
                                    </div>

                                    {/* Right: NGO Proposal */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">2. NGO Funding Proposal</h3>
                                        <div className="bg-white p-4 border border-indigo-100 rounded-lg shadow-sm">
                                            <h4 className="font-bold text-indigo-900 border-b border-indigo-50 pb-2 mb-2">EduCare Org (Verified)</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                                                <div><span className="text-slate-500 block">Requested Fund</span><span className="font-bold font-mono">₹800,000</span></div>
                                                <div><span className="text-slate-500 block">Timeline</span><span className="font-bold">3 Months</span></div>
                                            </div>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <Badge variant="neutral">Milestone Plan Attached</Badge>
                                                <Badge variant="neutral">Contractors Vetted</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 border-t border-slate-200 pt-6 flex justify-between items-center">
                                    <div className="text-sm font-medium text-slate-600">Review documents and field reports before forwarding to CSR matching.</div>
                                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition shadow-sm">
                                        <CheckCircle2 className="w-5 h-5" /> Verify & Forward to Corporate Funder
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="p-4">Organization</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">State</th>
                                    <th className="p-4">Risk Score</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {mockNGOs.map((ngo, idx) => (
                                    <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900">{ngo.name}</div>
                                            <div className="font-mono text-xs text-slate-500 mt-1">{ngo.id}</div>
                                        </td>
                                        <td className="p-4 text-slate-600 font-medium">{ngo.type}</td>
                                        <td className="p-4 text-slate-600">{ngo.location.split(',')[0]}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden w-20">
                                                    <div className="h-full rounded-full" style={{ width: `${ngo.score}%`, backgroundColor: ngo.score > 80 ? '#10b981' : ngo.score > 50 ? '#f59e0b' : '#ef4444' }}></div>
                                                </div>
                                                <span className="font-mono text-xs font-bold">{ngo.score}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge variant={ngo.status === 'Verified' ? 'success' : ngo.status === 'Needs Review' ? 'warning' : 'danger'}>
                                                {ngo.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => setSelectedNGO(ngo)}
                                                className="text-indigo-600 font-semibold hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded transition-colors"
                                            >
                                                Audit Docs
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
