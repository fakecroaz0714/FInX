'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
    LayoutDashboard, Briefcase, FileSignature, Users, PieChart,
    Coins, MapPin, Building2, TrendingUp, ShieldCheck, FileCheck2, Filter, ChevronRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';

export default function CorporateDashboard() {
    const [activeTab, setActiveTab] = useState('Overview');

    const budgetData = [
        { name: 'Education', value: 4000000, color: '#3b82f6' },
        { name: 'Environment', value: 3000000, color: '#10b981' },
        { name: 'Healthcare', value: 2500000, color: '#8b5cf6' },
        { name: 'Remaining', value: 500000, color: '#e2e8f0' }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Budget Planning':
                return (
                    <div className="space-y-6">
                        <Card className="border-indigo-100">
                            <CardHeader className="bg-indigo-50/50 border-b border-indigo-50">
                                <CardTitle className="text-lg text-indigo-900">FY 2024 CSR Strategy</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700">Total Annual Budget (₹)</label>
                                        <input type="text" value="₹10,000,000" disabled className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 font-mono text-lg mt-1" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Region Focus</label>
                                            <select className="w-full p-2.5 border border-slate-200 rounded-lg mt-1 bg-white">
                                                <option>Maharashtra & Gujarat</option>
                                                <option>Pan-India</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700">Beneficiary Group</label>
                                            <select className="w-full p-2.5 border border-slate-200 rounded-lg mt-1 bg-white">
                                                <option>Rural Youth</option>
                                                <option>Women Empowerment</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition">
                                        Update Allocation Policies
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
                                            <RechartsTooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                                        </RechartsPie>
                                    </ResponsiveContainer>
                                    <div className="text-sm text-slate-500 font-medium mt-2 flex gap-4">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Education</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Environment</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-200"></span> Unallocated</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'Compare NGOs':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div>
                                <h3 className="font-bold text-slate-900">Project: Rural Solar Electrification</h3>
                                <p className="text-sm text-slate-500">Comparing 2 shortlisted NGOs for ₹2.5M grant</p>
                            </div>
                            <div className="flex gap-3">
                                <Badge variant="neutral">Filter by FINX Score &gt; 90</Badge>
                                <Badge variant="neutral">Auto-Match Tags</Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* NGO A */}
                            <Card className="border-emerald-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">Recommended</div>
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold text-slate-900 mb-1">Green Earth Foundation</h2>
                                    <div className="flex gap-2 mb-4">
                                        <Badge variant="success">Verified Validator</Badge>
                                        <Badge variant="neutral">ESG Compliant</Badge>
                                    </div>
                                    <table className="w-full text-sm">
                                        <tbody className="divide-y divide-slate-100">
                                            <tr><td className="py-2 text-slate-500">FINX Score</td><td className="py-2 font-mono font-bold text-emerald-600">94/100</td></tr>
                                            <tr><td className="py-2 text-slate-500">Proposed Cost</td><td className="py-2 font-mono font-bold">₹2,400,000</td></tr>
                                            <tr><td className="py-2 text-slate-500">Target Beneficiaries</td><td className="py-2 font-semibold">1,200 Households</td></tr>
                                            <tr><td className="py-2 text-slate-500">Cost per Beneficiary</td><td className="py-2 font-semibold">₹2,000</td></tr>
                                            <tr><td className="py-2 text-slate-500">Past Performance</td><td className="py-2 font-semibold text-emerald-600">Excellent (4 Projects)</td></tr>
                                        </tbody>
                                    </table>
                                    <div className="flex gap-3 mt-6">
                                        <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition">Approve & Fund</button>
                                        <button className="px-4 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition">View Proposal</button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* NGO B */}
                            <Card className="border-slate-200 shadow-sm">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold text-slate-900 mb-1">Solar Future Org</h2>
                                    <div className="flex gap-2 mb-4">
                                        <Badge variant="warning">Needs Review</Badge>
                                        <Badge variant="neutral">New Organization</Badge>
                                    </div>
                                    <table className="w-full text-sm">
                                        <tbody className="divide-y divide-slate-100">
                                            <tr><td className="py-2 text-slate-500">FINX Score</td><td className="py-2 font-mono font-bold text-amber-500">68/100</td></tr>
                                            <tr><td className="py-2 text-slate-500">Proposed Cost</td><td className="py-2 font-mono font-bold">₹1,900,000</td></tr>
                                            <tr><td className="py-2 text-slate-500">Target Beneficiaries</td><td className="py-2 font-semibold">800 Households</td></tr>
                                            <tr><td className="py-2 text-slate-500">Cost per Beneficiary</td><td className="py-2 font-semibold">₹2,375</td></tr>
                                            <tr><td className="py-2 text-slate-500">Past Performance</td><td className="py-2 font-semibold text-slate-400">N/A (First Project)</td></tr>
                                        </tbody>
                                    </table>
                                    <div className="flex gap-3 mt-6">
                                        <button className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2 rounded-lg transition">Request Clarification</button>
                                        <button className="px-4 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium transition">Reject</button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );
            case 'Escrow Control':
                return (
                    <Card className="border-slate-200">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg">Active Escrow Contracts</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                                    <tr><th className="p-4">Contract ID</th><th className="p-4">NGO Partner</th><th className="p-4">Total Value</th><th className="p-4">Released</th><th className="p-4">Next Action</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr className="hover:bg-slate-50">
                                        <td className="p-4 font-mono font-bold text-indigo-600">0xESC...8A92</td>
                                        <td className="p-4">EduCare Org</td>
                                        <td className="p-4 font-mono">₹4,000,000</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 bg-slate-200 rounded-full h-2"><div className="bg-emerald-500 w-1/2 h-full rounded-full"></div></div>
                                                <span className="font-mono text-xs">50%</span>
                                            </div>
                                        </td>
                                        <td className="p-4"><Badge variant="warning">Awaiting Milestone 3 Proof</Badge></td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="p-4 font-mono font-bold text-indigo-600">0xESC...B4C1</td>
                                        <td className="p-4">Jal Seva NGO</td>
                                        <td className="p-4 font-mono">₹1,500,000</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 bg-slate-200 rounded-full h-2"></div>
                                                <span className="font-mono text-xs">0%</span>
                                            </div>
                                        </td>
                                        <td className="p-4"><button className="text-xs bg-slate-900 text-white px-3 py-1 rounded">Deposit Funds</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                );
            case 'Impact Reports':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                            <Card className="bg-emerald-50 border-emerald-200"><CardContent className="p-6"><div className="text-emerald-700 font-bold mb-1">Total Beneficiaries</div><div className="text-3xl font-bold font-mono">14,500+</div></CardContent></Card>
                            <Card className="bg-indigo-50 border-indigo-200"><CardContent className="p-6"><div className="text-indigo-700 font-bold mb-1">Fund Utilization</div><div className="text-3xl font-bold font-mono">92%</div></CardContent></Card>
                            <Card className="bg-amber-50 border-amber-200"><CardContent className="p-6"><div className="text-amber-700 font-bold mb-1">Active Regions</div><div className="text-3xl font-bold font-mono">8 States</div></CardContent></Card>
                        </div>
                        <Card>
                            <CardHeader><CardTitle>Before & After Evidence (School Rebuilding)</CardTitle></CardHeader>
                            <CardContent className="p-6 grid grid-cols-2 gap-6">
                                <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 flex flex-col items-center justify-center h-48 uppercase text-slate-400 font-bold tracking-widest relative">
                                    <span className="absolute top-2 left-2 bg-slate-800 text-white text-xs px-2 py-1 rounded">BEFORE: Aug 2023</span>
                                    [Uploaded Photo of Dilapidated Building]
                                </div>
                                <div className="border border-slate-200 rounded-lg p-2 bg-indigo-50 flex flex-col items-center justify-center h-48 uppercase text-indigo-400 font-bold tracking-widest relative">
                                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded">AFTER: Jan 2024</span>
                                    [Uploaded Photo of Renovated Classrooms]
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="md:col-span-1 shadow-sm border-slate-200">
                            <CardContent className="p-6">
                                <div className="p-3 bg-indigo-100 rounded-lg w-max mb-4"><Coins className="w-6 h-6 text-indigo-600" /></div>
                                <div className="text-sm font-semibold text-slate-500">Remaining Budget</div>
                                <div className="text-3xl font-bold text-slate-900 mt-1 font-mono">₹{budgetData[3].value.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-1 shadow-sm border-slate-200">
                            <CardContent className="p-6">
                                <div className="p-3 bg-emerald-100 rounded-lg w-max mb-4"><ShieldCheck className="w-6 h-6 text-emerald-600" /></div>
                                <div className="text-sm font-semibold text-slate-500">Active Projects</div>
                                <div className="text-3xl font-bold text-slate-900 mt-1 font-mono">12</div>
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-1 shadow-sm border-slate-200">
                            <CardContent className="p-6">
                                <div className="p-3 bg-amber-100 rounded-lg w-max mb-4"><FileSignature className="w-6 h-6 text-amber-600" /></div>
                                <div className="text-sm font-semibold text-slate-500">Pending Applications</div>
                                <div className="text-3xl font-bold text-slate-900 mt-1 font-mono">4</div>
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-1 shadow-sm border-slate-200">
                            <CardContent className="p-6">
                                <div className="p-3 bg-blue-100 rounded-lg w-max mb-4"><Users className="w-6 h-6 text-blue-600" /></div>
                                <div className="text-sm font-semibold text-slate-500">Impact Reach</div>
                                <div className="text-3xl font-bold text-slate-900 mt-1 font-mono">14K+</div>
                            </CardContent>
                        </Card>
                    </div>
                );
        }
    };

    return (
        <div className="p-8 pb-20 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Corporate CSR Dashboard</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage budgets, securely deploy funds, and track verifiable impact.</p>
                </div>
                <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2">
                    <FileSignature className="w-5 h-5" /> Publish New Opportunity
                </button>
            </header>

            <nav className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 border-b border-slate-200 hide-scrollbar">
                {['Overview', 'Budget Planning', 'Compare NGOs', 'Escrow Control', 'Impact Reports'].map(tab => (
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
        </div>
    );
}
