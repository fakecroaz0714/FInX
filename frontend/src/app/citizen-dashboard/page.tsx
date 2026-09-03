'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
    Megaphone, MapPin, Search, FileText, Camera, Upload, CheckCircle2,
    Clock, Building2, BellRing, Target, ShieldCheck, HardDrive, Info
} from 'lucide-react';

export default function CitizenDashboard() {
    const [activeTab, setActiveTab] = useState('Overview');
    const [evidenceFile, setEvidenceFile] = useState('');

    const formSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Petition securely submitted to FINX blockchain ledger for verification!");
        setActiveTab('My Petitions');
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Submit Petition':
                return (
                    <Card className="max-w-3xl mx-auto border-indigo-100 shadow-sm mt-4">
                        <CardHeader className="bg-indigo-50/50 border-b border-indigo-50 pb-4">
                            <CardTitle className="text-xl text-indigo-900 flex items-center gap-2">
                                <Megaphone className="w-5 h-5" /> Voice a Community Need
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={formSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">1. Core Issue Details</h3>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Problem Title</label>
                                        <input required type="text" placeholder="e.g. Broken water pipeline in village square" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                                            <select className="w-full p-2.5 border border-slate-200 rounded-lg bg-white">
                                                <option>Education & Schools</option>
                                                <option>Healthcare & Clinics</option>
                                                <option>Environment (Water/Solar)</option>
                                                <option>Sanitation</option>
                                                <option>Infrastructure (Roads/Bridges)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Estimated Beneficiaries</label>
                                            <input type="number" placeholder="e.g. 500" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Detailed Description</label>
                                        <textarea required rows={4} placeholder="Describe the severity of the problem and how it affects the community..." className="w-full p-2.5 border border-slate-200 rounded-lg bg-white resize-none"></textarea>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2 mt-8">2. Location & Evidence</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Village / Town</label>
                                            <input required type="text" placeholder="Location name" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Pincode / Zip</label>
                                            <input type="text" placeholder="Pincode" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Attach Photos / Video Proof</label>
                                        <label className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition cursor-pointer relative overflow-hidden">
                                            <input
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        const file = e.target.files[0];
                                                        setEvidenceFile(file.name);
                                                    }
                                                }}
                                            />
                                            {evidenceFile ? (
                                                <div className="flex flex-col items-center text-emerald-600">
                                                    <CheckCircle2 className="w-8 h-8 mb-2" />
                                                    <span className="text-sm font-medium">{evidenceFile} attached securely!</span>
                                                    <span className="text-xs text-slate-400 mt-1 hover:underline">Click to change</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <Camera className="w-8 h-8 mb-2 text-indigo-400" />
                                                    <span className="text-sm font-medium text-slate-700">Click to upload ground-reality photos</span>
                                                    <span className="text-xs mt-1 text-slate-400">Supports JPG, PNG, MP4 (Max 50MB)</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition flex justify-center items-center gap-2">
                                    <Upload className="w-5 h-5" /> Submit Petition to Network
                                </button>
                            </form>
                        </CardContent>
                    </Card>
                );
            case 'My Petitions':
                return (
                    <div className="space-y-4">
                        {/* Status Definitions Key */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-2 text-xs font-semibold items-center">
                            <span className="text-slate-400 mr-2 uppercase tracking-wide">Status Roadmap:</span>
                            <Badge variant="neutral">Submitted</Badge>&rarr;
                            <Badge variant="warning">Verified</Badge>&rarr;
                            <Badge variant="success">Adopted by NGO</Badge>&rarr;
                            <Badge variant="default">Funded & Progressing</Badge>
                        </div>

                        <Card className="border-emerald-200 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2">Build Primary School Roof</h3>
                                        <p className="text-sm border-l-2 border-slate-300 pl-3 text-slate-500">Currently studying under open sun. Monsoons destroy books every year and halt education for 250 local children.</p>
                                    </div>
                                    <Badge variant="default" className="text-sm px-3 py-1 shadow-sm shrink-0">Funded & In Progress</Badge>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg flex flex-col md:flex-row gap-6 mb-6">
                                    <div className="flex-1">
                                        <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Adopted By</div>
                                        <div className="font-semibold text-slate-800 flex items-center gap-2"><Building2 className="w-4 h-4 text-indigo-500" /> EduCare Org</div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Corporate Sponsor</div>
                                        <div className="font-semibold text-slate-800">TechCorp India (CSR Initiative)</div>
                                    </div>
                                </div>

                                <div className="border border-slate-200 rounded-xl p-5 relative">
                                    <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-emerald-500" /> Transparent Escrow Timeline</h4>

                                    <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">

                                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                                            <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-slate-100 bg-white shadow-sm">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-bold text-sm text-slate-900">Validator Approved</span>
                                                    <span className="text-xs font-mono text-slate-400">Oct 12, 2024</span>
                                                </div>
                                                <div className="text-xs text-slate-500">Government Validator physically verified the school state coordinates.</div>
                                            </div>
                                        </div>

                                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                                            <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-slate-100 bg-white shadow-sm">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-bold text-sm text-slate-900">Milestone 1 Funded</span>
                                                    <span className="text-xs font-mono text-slate-400">Nov 02, 2024</span>
                                                </div>
                                                <div className="text-xs text-slate-500">Escrow released ₹200,000 for raw material procurement (Cement & Steel).</div>
                                            </div>
                                        </div>

                                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                            <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-amber-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                                            <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-amber-200 bg-amber-50 shadow-sm">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-bold text-sm text-slate-900 text-amber-900">Roof Construction Active</span>
                                                </div>
                                                <div className="text-xs text-amber-700 font-medium">NGO submitted work photos. Awaiting corporate approval for Milestone 2 payout. <a href="#" className="underline font-bold ml-1">View Evidence Photos</a></div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="mt-6 flex justify-end gap-3 text-xs w-full">
                                        <button className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded font-medium hover:bg-slate-50 transition">Report Discrepancy</button>
                                        <button className="bg-indigo-600 text-white px-3 py-1.5 rounded font-medium shadow-sm hover:bg-indigo-700 transition">Confirm Field Progress</button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm opacity-80">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2">Solar Lights for Ward 3</h3>
                                        <p className="text-sm border-l-2 border-slate-300 pl-3 text-slate-500">Pitch dark streets causing severe safety concerns for evening workers returning to the block.</p>
                                    </div>
                                    <Badge variant="warning" className="text-sm px-3 py-1 shadow-sm shrink-0">Verified (Seeking Funding)</Badge>
                                </div>
                                <div className="text-xs text-slate-500 flex gap-1 items-center mb-1"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Platform Validator verified the geo-tags. Project is visible to Corporate CSR matching boards.</div>
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'Nearby Projects':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px] mb-8">
                        {/* Map Mock */}
                        <div className="col-span-2 bg-slate-200 rounded-xl overflow-hidden border border-slate-300 relative">
                            {/* Embedded Map Graphic representation */}
                            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Map View" className="w-full h-full object-cover opacity-80 mix-blend-multiply" />

                            {/* Map Pins */}
                            <div className="absolute top-1/4 left-1/3 bg-white p-2 rounded-xl shadow-lg border border-indigo-200 z-10 w-48 text-center animate-bounce">
                                <MapPin className="w-6 h-6 text-indigo-600 mx-auto -mt-6 bg-white rounded-full p-1 shadow-sm" />
                                <div className="font-bold text-xs text-slate-900 mt-1">Solar Pump Installation</div>
                                <div className="text-[10px] font-semibold text-emerald-600">Funded by GreenEnergy</div>
                            </div>

                            <div className="absolute top-1/2 right-1/4 bg-white p-2 rounded-xl shadow-lg border border-emerald-200 z-10 w-48 text-center opacity-80">
                                <MapPin className="w-6 h-6 text-emerald-500 mx-auto -mt-6 bg-white rounded-full p-1 shadow-sm" />
                                <div className="font-bold text-xs text-slate-900 mt-1">Completed: Clinic Renovation</div>
                                <div className="text-[10px] font-semibold text-slate-500">2 months ago</div>
                            </div>
                        </div>

                        {/* List */}
                        <Card className="h-full border-slate-200 shadow-sm flex flex-col">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-base text-slate-900 flex justify-between">
                                    Local Impact Zones
                                    <Badge variant="neutral">Pune, MH</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 overflow-y-auto flex-1 divide-y divide-slate-100">
                                <div className="p-4 hover:bg-slate-50 cursor-pointer">
                                    <div className="font-bold text-sm text-slate-900">Solar Pump Installation</div>
                                    <div className="text-xs text-slate-500 mt-1">Providing clean water to 80 farms.</div>
                                    <div className="mt-3 bg-slate-200 h-1.5 w-full rounded-full overflow-hidden leading-none"><div className="bg-indigo-600 h-full w-3/4"></div></div>
                                    <div className="text-[10px] font-bold text-slate-400 mt-1 text-right uppercase tracking-wider">75% Complete</div>
                                </div>
                                <div className="p-4 hover:bg-slate-50 cursor-pointer opacity-70">
                                    <div className="font-bold text-sm text-slate-900 text-emerald-700 flex gap-1 items-center"><CheckCircle2 className="w-4 h-4" /> Clinic Renovation</div>
                                    <div className="text-xs text-slate-500 mt-1">Rebuilt waiting hall and maternity wing.</div>
                                    <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">Completed Oct 2023</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="shadow-sm border-slate-200 bg-white hover:border-indigo-300 transition-colors cursor-pointer" onClick={() => setActiveTab('My Petitions')}>
                            <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                                <div className="p-4 bg-indigo-50 rounded-full mb-4"><HardDrive className="w-8 h-8 text-indigo-600" /></div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">2</div>
                                <div className="text-sm font-semibold text-slate-500 tracking-wide uppercase">Active Petitions</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-slate-200 bg-white hover:border-amber-300 transition-colors">
                            <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                                <div className="p-4 bg-amber-50 rounded-full mb-4"><Clock className="w-8 h-8 text-amber-600" /></div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">1</div>
                                <div className="text-sm font-semibold text-slate-500 tracking-wide uppercase">Pending Review</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-slate-200 bg-white hover:border-emerald-300 transition-colors">
                            <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                                <div className="p-4 bg-emerald-50 rounded-full mb-4"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">18</div>
                                <div className="text-sm font-semibold text-slate-500 tracking-wide uppercase">Local Projects Completed</div>
                            </CardContent>
                        </Card>

                        {/* Recent Notifications Feed */}
                        <div className="md:col-span-3 mt-4">
                            <h3 className="font-bold text-slate-900 text-sm tracking-wider uppercase mb-3 flex items-center gap-2"><BellRing className="w-4 h-4" /> Recent Project Updates</h3>
                            <div className="bg-white border text-sm focus:outline-none border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 shadow-sm">
                                <div className="p-4 flex gap-4 items-start bg-indigo-50/40">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                                    <div>
                                        <p className="font-semibold text-slate-900">EduCare NGO uploaded new evidence photos!</p>
                                        <p className="text-slate-500 mt-1">Your submitted petition "Build Primary School Roof" has new active escrow progression.</p>
                                        <p className="text-xs font-mono text-slate-400 mt-2">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="p-4 flex gap-4 items-start">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Validation Passed</p>
                                        <p className="text-slate-500 mt-1">The Geo-tags for "Solar Lights for Ward 3" were successfully completely verified by an Admin.</p>
                                        <p className="text-xs font-mono text-slate-400 mt-2">Yesterday</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="p-4 md:p-8 pb-24 max-w-7xl mx-auto space-y-6 md:space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-slate-900 to-indigo-900 p-6 md:p-8 rounded-2xl text-white shadow-lg overflow-hidden relative">

                {/* Decorative background visual */}
                <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12">
                    <Target className="w-64 h-64" />
                </div>

                <div className="relative z-10 w-full mb-4 md:mb-0">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Citizen Impact Portal</h1>
                    <p className="text-indigo-100 mt-2 font-medium opacity-90 max-w-2xl">Submit local issues directly to verified NGOs and Corporate CSR funds. Real-time transparent visibility into your community.</p>
                </div>
                <button
                    onClick={() => setActiveTab('Submit Petition')}
                    className="relative z-10 bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold shadow-md hover:bg-slate-100 transition whitespace-nowrap w-full md:w-auto mt-2 md:mt-0"
                >
                    Submit a Petition
                </button>
            </header>

            {/* Mobile-friendly Tab Scroll view */}
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <nav className="flex items-center gap-1 min-w-max pb-2 border-b border-slate-200">
                    {['Overview', 'Submit Petition', 'My Petitions', 'Nearby Projects', 'Profile Settings'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-3 rounded-t-lg font-semibold text-sm transition-colors ${activeTab === tab ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="pt-2">
                {renderTabContent()}
            </div>
        </div>
    );
}
