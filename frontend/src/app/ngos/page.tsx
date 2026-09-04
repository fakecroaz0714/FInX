'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
    FileCheck, Activity, Users, ShieldAlert, CheckCircle, ExternalLink, 
    Plus, Sparkles, X, Building2, MapPin, Mail, Award, CheckCircle2,
    Calendar, ShieldCheck, FileText, ChevronRight
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface NGOItem {
    id: string;
    name: string;
    focus: string;
    status: 'Verified' | 'Needs Review' | 'High Risk';
    trustScore: number;
    activeProjects: number;
    totalFunds: string;
    darpanId: string;
    pan: string;
    regDate: string;
    location: string;
    email: string;
    trustees: string;
    complianceScore: number;
    proofIntegrity: number;
    deliveryRate: number;
    projects: { title: string; budget: string; status: string }[];
}

const initialNgos: NGOItem[] = [
    {
        id: "NGO-001",
        name: "Jal Seva NGO",
        focus: "Water & Sanitation",
        status: "Verified",
        trustScore: 92,
        activeProjects: 3,
        totalFunds: "₹250,000",
        darpanId: "MH/2016/0109283",
        pan: "AAATJ9999K",
        regDate: "2015-08-14",
        location: "Pune, Maharashtra",
        email: "contact@jalseva.org",
        trustees: "Dr. Arvind Shinde, Sunita Kulkarni",
        complianceScore: 94,
        proofIntegrity: 91,
        deliveryRate: 95,
        projects: [
            { title: "Clean Water Borewells Haveli", budget: "₹150,000", status: "In Progress" },
            { title: "Village RO Water Plant Shirur", budget: "₹100,000", status: "Verified" }
        ]
    },
    {
        id: "NGO-002",
        name: "Green Earth Foundation",
        focus: "Renewable Energy & Environment",
        status: "Verified",
        trustScore: 88,
        activeProjects: 5,
        totalFunds: "₹1,200,000",
        darpanId: "MH/2018/0204918",
        pan: "AABCG7721L",
        regDate: "2017-03-22",
        location: "Nagpur, Maharashtra",
        email: "programs@greenearth.org",
        trustees: "Vikram Deshmukh, Priya Nair",
        complianceScore: 90,
        proofIntegrity: 89,
        deliveryRate: 86,
        projects: [
            { title: "Solar Micro-Grids Katol", budget: "₹800,000", status: "In Progress" },
            { title: "Community Agroforestry 20k Saplings", budget: "₹400,000", status: "Completed" }
        ]
    },
    {
        id: "NGO-003",
        name: "EduCare Org",
        focus: "Education & Digital Literacy",
        status: "Needs Review",
        trustScore: 45,
        activeProjects: 1,
        totalFunds: "₹75,000",
        darpanId: "MH/2023/0481920",
        pan: "AABCE1192M",
        regDate: "2023-01-10",
        location: "Pune, Maharashtra",
        email: "admin@educare.org",
        trustees: "Rajesh Joshi, Meera Patel",
        complianceScore: 50,
        proofIntegrity: 40,
        deliveryRate: 45,
        projects: [
            { title: "Primary School STEM Kits", budget: "₹75,000", status: "Under Review" }
        ]
    },
    {
        id: "NGO-004",
        name: "Urban Health Initiative",
        focus: "Healthcare & Mobile Clinics",
        status: "High Risk",
        trustScore: 12,
        activeProjects: 0,
        totalFunds: "₹0",
        darpanId: "MH/2020/0038192",
        pan: "AABCU9018P",
        regDate: "2020-11-05",
        location: "Mumbai, Maharashtra",
        email: "contact@urbanhealth.in",
        trustees: "Sanjay Verma",
        complianceScore: 15,
        proofIntegrity: 10,
        deliveryRate: 12,
        projects: []
    }
];

export default function NGOsPage() {
    const { t } = useLanguage();
    const [ngos, setNgos] = useState<NGOItem[]>(initialNgos);
    const [statusFilter, setStatusFilter] = useState<'All' | 'Verified' | 'Needs Review' | 'High Risk'>('All');
    const [selectedNgo, setSelectedNgo] = useState<NGOItem | null>(null);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    // Registration Form State
    const [regForm, setRegForm] = useState({
        name: '',
        focus: 'Water & Sanitation',
        location: '',
        darpanId: '',
        pan: '',
        email: '',
        trustees: ''
    });

    const prefillSampleNgo = () => {
        setRegForm({
            name: "Sahyadri Rural Upliftment Trust",
            focus: "Rural Livelihood & Water Security",
            location: "Satara & Pune, Maharashtra",
            darpanId: "MH/2022/0319482",
            pan: "AAATS4821Q",
            email: "director@sahyadritrust.org",
            trustees: "Anand Gokhale, Vaishali Thorat"
        });
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!regForm.name || !regForm.location) return;

        const newNGO: NGOItem = {
            id: `NGO-${Date.now().toString().slice(-4)}`,
            name: regForm.name,
            focus: regForm.focus,
            status: "Verified",
            trustScore: 89,
            activeProjects: 1,
            totalFunds: "₹350,000",
            darpanId: regForm.darpanId || "MH/2024/0991204",
            pan: regForm.pan || "AAATN5512B",
            regDate: new Date().toISOString().split('T')[0],
            location: regForm.location,
            email: regForm.email || "info@ngo.org",
            trustees: regForm.trustees || "Govind Patil",
            complianceScore: 92,
            proofIntegrity: 90,
            deliveryRate: 88,
            projects: [
                { title: "Watershed Harvesting & Desilting", budget: "₹350,000", status: "Active" }
            ]
        };

        setNgos([newNGO, ...ngos]);
        setIsRegisterOpen(false);
        setRegForm({
            name: '',
            focus: 'Water & Sanitation',
            location: '',
            darpanId: '',
            pan: '',
            email: '',
            trustees: ''
        });
        setNotification(`Successfully registered "${newNGO.name}" on the FINX verified network!`);
        setTimeout(() => setNotification(null), 5000);
    };

    const filteredNgos = statusFilter === 'All' 
        ? ngos 
        : ngos.filter(n => n.status === statusFilter);

    const counts = {
        total: ngos.length,
        verified: ngos.filter(n => n.status === 'Verified').length,
        needsReview: ngos.filter(n => n.status === 'Needs Review').length,
        highRisk: ngos.filter(n => n.status === 'High Risk').length,
    };

    return (
        <div className="p-8 pb-20 max-w-7xl mx-auto">
            {notification && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-sm font-semibold shadow-sm animate-in fade-in">
                    <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        {notification}
                    </span>
                    <button onClick={() => setNotification(null)} className="text-emerald-600 hover:text-emerald-900">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('ngo_network_title', 'NGO Network')}</h1>
                    <p className="text-slate-500 mt-1">{t('validator_dashboard_sub', 'Directory of partner NGOs, trust scores, and validation status.')}</p>
                </div>
                <button 
                    onClick={() => setIsRegisterOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    {t('step_reg', 'Register NGO')}
                </button>
            </header>

            {/* Interactive KPI Filter Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <Card 
                    onClick={() => setStatusFilter('All')}
                    className={`cursor-pointer transition-all duration-200 border ${statusFilter === 'All' ? 'ring-2 ring-indigo-500 border-indigo-300 bg-indigo-50/20' : 'border-slate-200 hover:border-slate-300'}`}
                >
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-slate-500 mb-1">{t('total_registered', 'Total Registered')}</div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">{counts.total}</div>
                        <div className="text-xs text-indigo-600 font-medium">Click to show all</div>
                    </CardContent>
                </Card>

                <Card 
                    onClick={() => setStatusFilter('Verified')}
                    className={`cursor-pointer transition-all duration-200 border ${statusFilter === 'Verified' ? 'ring-2 ring-emerald-500 border-emerald-300 bg-emerald-50/20' : 'border-slate-200 hover:border-slate-300'}`}
                >
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-slate-500 mb-1">{t('verified_ngos', 'Verified NGOs')}</div>
                        <div className="text-3xl font-bold text-emerald-600 mb-1">{counts.verified}</div>
                        <div className="text-xs text-emerald-600 font-medium">Ready for CSR matching</div>
                    </CardContent>
                </Card>

                <Card 
                    onClick={() => setStatusFilter('Needs Review')}
                    className={`cursor-pointer transition-all duration-200 border ${statusFilter === 'Needs Review' ? 'ring-2 ring-amber-500 border-amber-300 bg-amber-50/20' : 'border-slate-200 hover:border-slate-300'}`}
                >
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-slate-500 mb-1">{t('pending_review', 'Pending Review')}</div>
                        <div className="text-3xl font-bold text-amber-500 mb-1">{counts.needsReview}</div>
                        <div className="text-xs text-amber-600 font-medium">Documents submitted</div>
                    </CardContent>
                </Card>

                <Card 
                    onClick={() => setStatusFilter('High Risk')}
                    className={`cursor-pointer transition-all duration-200 border ${statusFilter === 'High Risk' ? 'ring-2 ring-red-500 border-red-300 bg-red-50/20' : 'border-slate-200 hover:border-slate-300'}`}
                >
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-slate-500 mb-1">{t('high_risk', 'High Risk')}</div>
                        <div className="text-3xl font-bold text-red-500 mb-1">{counts.highRisk}</div>
                        <div className="text-xs text-red-500 font-medium">Suspended / Flagged</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">{t('nav_ngo_dir', 'NGO Directory')}</CardTitle>
                        <CardDescription>
                            Showing {filteredNgos.length} {statusFilter === 'All' ? 'total' : statusFilter} organizations
                        </CardDescription>
                    </div>
                    {statusFilter !== 'All' && (
                        <button 
                            onClick={() => setStatusFilter('All')} 
                            className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                        >
                            Reset Filter (Show All)
                        </button>
                    )}
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">{t('th_ngo_focus', 'NGO Name & Focus')}</th>
                                    <th className="px-6 py-4 font-semibold">{t('th_validation_status', 'Validation Status')}</th>
                                    <th className="px-6 py-4 font-semibold">{t('th_trust_score', 'FINX Trust Score')}</th>
                                    <th className="px-6 py-4 font-semibold">{t('th_active_projects', 'Active Projects')}</th>
                                    <th className="px-6 py-4 font-semibold">{t('th_total_escrowed', 'Total Funds Escrowed')}</th>
                                    <th className="px-6 py-4 font-semibold text-right">{t('th_action', 'Action')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredNgos.map((ngo) => (
                                    <tr key={ngo.id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900">{ngo.name}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">{ngo.focus} • {ngo.location}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant={ngo.status === 'Verified' ? 'success' : ngo.status === 'Needs Review' ? 'warning' : 'danger'}
                                            >
                                                {ngo.status === 'Verified' && <CheckCircle className="w-3 h-3 mr-1 inline" />}
                                                {ngo.status === 'High Risk' && <ShieldAlert className="w-3 h-3 mr-1 inline" />}
                                                {ngo.status === 'Verified' ? t('status_verified', 'Verified') : ngo.status === 'Needs Review' ? t('status_needs_review', 'Needs Review') : t('status_high_risk', 'High Risk')}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${ngo.trustScore > 80 ? 'bg-emerald-500' : ngo.trustScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                        style={{ width: `${ngo.trustScore}%` }}
                                                    />
                                                </div>
                                                <span className="font-bold text-slate-900">{ngo.trustScore}/100</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{ngo.activeProjects}</td>
                                        <td className="px-6 py-4 font-mono font-medium text-slate-900">{ngo.totalFunds}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setSelectedNgo(ngo)}
                                                className="text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1 ml-auto cursor-pointer"
                                            >
                                                {t('view_profile', 'View Profile')} <ExternalLink className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* NGO PROFILE DOSSIER MODAL */}
            {selectedNgo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-bold text-slate-900">{selectedNgo.name}</h3>
                                    <Badge variant={selectedNgo.status === 'Verified' ? 'success' : selectedNgo.status === 'Needs Review' ? 'warning' : 'danger'}>
                                        {selectedNgo.status}
                                    </Badge>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" /> {selectedNgo.location} • <Mail className="w-3.5 h-3.5" /> {selectedNgo.email}
                                </p>
                            </div>
                            <button onClick={() => setSelectedNgo(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Trust Score Breakdown */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-5">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">FINX AI Trust Rating</span>
                                <span className="text-2xl font-black text-indigo-600">{selectedNgo.trustScore}/100</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                                    <div className="text-xs text-slate-500">Legal/Tax Audit</div>
                                    <div className="text-base font-bold text-emerald-600">{selectedNgo.complianceScore}%</div>
                                </div>
                                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                                    <div className="text-xs text-slate-500">Proof Integrity</div>
                                    <div className="text-base font-bold text-indigo-600">{selectedNgo.proofIntegrity}%</div>
                                </div>
                                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                                    <div className="text-xs text-slate-500">Beneficiary Delivery</div>
                                    <div className="text-base font-bold text-purple-600">{selectedNgo.deliveryRate}%</div>
                                </div>
                            </div>
                        </div>

                        {/* Statutory Details */}
                        <div className="grid grid-cols-2 gap-3 text-xs mb-5">
                            <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                <span className="text-slate-400 block mb-0.5">Niti Aayog Darpan ID</span>
                                <span className="font-mono font-bold text-slate-800">{selectedNgo.darpanId}</span>
                            </div>
                            <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                <span className="text-slate-400 block mb-0.5">Income Tax PAN</span>
                                <span className="font-mono font-bold text-slate-800">{selectedNgo.pan}</span>
                            </div>
                            <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                <span className="text-slate-400 block mb-0.5">Registered Since</span>
                                <span className="font-bold text-slate-800">{selectedNgo.regDate}</span>
                            </div>
                            <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                <span className="text-slate-400 block mb-0.5">Key Trustees</span>
                                <span className="font-bold text-slate-800 truncate block">{selectedNgo.trustees}</span>
                            </div>
                        </div>

                        {/* Projects Breakdown */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 mb-2">Projects in Escrow Portfolio</h4>
                            {selectedNgo.projects.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">No active projects currently listed.</p>
                            ) : (
                                <div className="space-y-2">
                                    {selectedNgo.projects.map((proj, pIdx) => (
                                        <div key={pIdx} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                                            <div>
                                                <div className="font-semibold text-slate-800">{proj.title}</div>
                                                <div className="text-slate-400">Budget: {proj.budget}</div>
                                            </div>
                                            <Badge variant={proj.status === 'Completed' ? 'success' : proj.status === 'In Progress' ? 'neutral' : 'warning'}>
                                                {proj.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedNgo(null)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                            >
                                Close Dossier
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* REGISTER NGO MODAL */}
            {isRegisterOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Register New NGO</h3>
                                <p className="text-xs text-slate-500">Onboard an NGO to FINX's verified CSR network</p>
                            </div>
                            <button onClick={() => setIsRegisterOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Pre-fill button */}
                        <div className="mb-4">
                            <button
                                type="button"
                                onClick={prefillSampleNgo}
                                className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 flex items-center justify-center gap-2 transition"
                            >
                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                ⚡ Pre-fill Sample NGO (Sahyadri Rural Trust)
                            </button>
                        </div>

                        <form onSubmit={handleRegisterSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Name *</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Sahyadri Rural Upliftment Trust"
                                    value={regForm.name}
                                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Focus</label>
                                    <select
                                        value={regForm.focus}
                                        onChange={(e) => setRegForm({ ...regForm, focus: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-600 outline-none"
                                    >
                                        <option>Water & Sanitation</option>
                                        <option>Renewable Energy & Environment</option>
                                        <option>Education & Digital Literacy</option>
                                        <option>Healthcare & Mobile Clinics</option>
                                        <option>Rural Livelihood & Agriculture</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Headquarters Location *</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="City, State"
                                        value={regForm.location}
                                        onChange={(e) => setRegForm({ ...regForm, location: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Darpan Portal ID</label>
                                    <input
                                        type="text"
                                        placeholder="MH/2022/0319482"
                                        value={regForm.darpanId}
                                        onChange={(e) => setRegForm({ ...regForm, darpanId: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Income Tax PAN</label>
                                    <input
                                        type="text"
                                        placeholder="AAATS4821Q"
                                        value={regForm.pan}
                                        onChange={(e) => setRegForm({ ...regForm, pan: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Contact Email</label>
                                <input
                                    type="email"
                                    placeholder="contact@ngo.org"
                                    value={regForm.email}
                                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Trustees / Directors</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Dr. Ramesh Joshi, Sunita Rao"
                                    value={regForm.trustees}
                                    onChange={(e) => setRegForm({ ...regForm, trustees: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsRegisterOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
                                >
                                    Register & Verify
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

