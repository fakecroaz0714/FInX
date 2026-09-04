'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
    Megaphone, MapPin, Search, FileText, Camera, Upload, CheckCircle2,
    Clock, Building2, BellRing, Target, ShieldCheck, HardDrive, Info, Navigation, Users
} from 'lucide-react';
import { CitizenNearbyProjectsMap } from '@/components/maps/CitizenNearbyProjectsMap';
import { useAuth, CitizenProfile } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';

export default function CitizenDashboard() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('Overview');
    const [evidenceFile, setEvidenceFile] = useState('');

    const citizenProfile = (user?.profile as CitizenProfile) || {};
    const citizenName = citizenProfile.fullName || user?.name || 'Ramesh Patil';
    const citizenMobile = citizenProfile.mobile || user?.mobile || '9876543210';
    const citizenLocation = `${citizenProfile.cityVillage || 'Shirur Village'}, ${citizenProfile.district || 'Pune'}, ${citizenProfile.state || 'Maharashtra'}`;
    const citizenPincode = citizenProfile.pincode || '412210';
    const citizenLanguage = citizenProfile.preferredLanguage === 'mr' ? 'मराठी (Marathi)' : citizenProfile.preferredLanguage === 'hi' ? 'हिन्दी (Hindi)' : 'English';

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
                                <Megaphone className="w-5 h-5" /> {t('citizen_voice_need', 'Voice a Community Need')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={formSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">{t('core_issue_details', '1. Core Issue Details')}</h3>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('problem_title', 'Problem Title')}</label>
                                        <input required type="text" placeholder={t('problem_title_placeholder', 'e.g. Broken water pipeline in village square')} className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('category_label', 'Category')}</label>
                                            <select className="w-full p-2.5 border border-slate-200 rounded-lg bg-white">
                                                <option>{t('cat_education', 'Education & Schools')}</option>
                                                <option>{t('cat_healthcare', 'Healthcare & Clinics')}</option>
                                                <option>{t('cat_environment', 'Environment (Water/Solar)')}</option>
                                                <option>{t('cat_sanitation', 'Sanitation')}</option>
                                                <option>{t('cat_infrastructure', 'Infrastructure (Roads/Bridges)')}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('est_beneficiaries', 'Estimated Beneficiaries')}</label>
                                            <input type="number" placeholder="e.g. 500" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('detailed_description', 'Detailed Description')}</label>
                                        <textarea required rows={4} placeholder={t('description_placeholder', 'Describe the severity of the problem and how it affects the community...')} className="w-full p-2.5 border border-slate-200 rounded-lg bg-white resize-none"></textarea>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2 mt-8">{t('field_evidence_photos', '2. Field Evidence & Photos')}</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('state_district', 'Village / Town')}</label>
                                            <input required type="text" placeholder="Location name" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Pincode / Zip</label>
                                            <input type="text" placeholder="Pincode" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('upload_photo_label', 'Attach Photos / Video Proof')}</label>
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
                                                    <span className="text-sm font-medium text-slate-700">{t('upload_photo_label', 'Click to upload ground-reality photos')}</span>
                                                    <span className="text-xs mt-1 text-slate-400">Supports JPG, PNG, MP4 (Max 50MB)</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition flex justify-center items-center gap-2">
                                    <Upload className="w-5 h-5" /> {t('btn_submit_community_petition', 'Submit Petition to Network')}
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
                            <span className="text-slate-400 mr-2 uppercase tracking-wide">{t('status_roadmap', 'Status Roadmap')}:</span>
                            <Badge variant="neutral">{t('status_submitted', 'Submitted')}</Badge>&rarr;
                            <Badge variant="warning">{t('status_verified', 'Verified')}</Badge>&rarr;
                            <Badge variant="success">{t('status_adopted_ngo', 'Adopted by NGO')}</Badge>&rarr;
                            <Badge variant="default">{t('status_funded_progressing', 'Funded & Progressing')}</Badge>
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
                    <div className="mb-8">
                        <CitizenNearbyProjectsMap />
                    </div>
                );
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="shadow-sm border-slate-200 bg-white hover:border-indigo-300 transition-colors cursor-pointer" onClick={() => setActiveTab('My Petitions')}>
                            <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                                <div className="p-4 bg-indigo-50 rounded-full mb-4"><HardDrive className="w-8 h-8 text-indigo-600" /></div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">2</div>
                                <div className="text-sm font-semibold text-slate-500 tracking-wide uppercase">{t('active_petitions', 'Active Petitions')}</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-slate-200 bg-white hover:border-amber-300 transition-colors">
                            <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                                <div className="p-4 bg-amber-50 rounded-full mb-4"><Clock className="w-8 h-8 text-amber-600" /></div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">1</div>
                                <div className="text-sm font-semibold text-slate-500 tracking-wide uppercase">{t('pending_review', 'Pending Review')}</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-slate-200 bg-white hover:border-emerald-300 transition-colors">
                            <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                                <div className="p-4 bg-emerald-50 rounded-full mb-4"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">18</div>
                                <div className="text-sm font-semibold text-slate-500 tracking-wide uppercase">{t('local_projects_completed', 'Local Projects Completed')}</div>
                            </CardContent>
                        </Card>

                        {/* Interactive Nearby Projects Spotlight */}
                        <div className="md:col-span-3 mt-2">
                            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">{t('nearby_impact_projects', 'Nearby Community Impact Projects')}</h4>
                                        <p className="text-xs text-slate-600 mt-0.5">{t('nearby_projects_desc', 'Explore 5 verified grassroots projects around Pune on the interactive map.')}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveTab('Nearby Projects')}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-xs whitespace-nowrap"
                                >
                                    {t('open_nearby_projects_map', 'Open Nearby Projects Map')} &rarr;
                                </button>
                            </div>
                        </div>

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

                        {/* Petitions Archive Table */}
                        <div className="md:col-span-3 mt-8">
                            <h3 className="font-bold text-slate-900 text-sm tracking-wider uppercase mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> {t('my_petitions_title', 'Petition History')}
                            </h3>
                            <div className="bg-white border focus:outline-none border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs">
                                        <tr>
                                            <th className="p-4">{t('th_petition_id', 'Petition ID')}</th>
                                            <th className="p-4">{t('th_title', 'Title')}</th>
                                            <th className="p-4">{t('th_date', 'Date Submitted')}</th>
                                            <th className="p-4">{t('th_status', 'Status')}</th>
                                            <th className="p-4 text-center">{t('th_action', 'Action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-mono text-xs text-slate-500">PET-8992</td>
                                            <td className="p-4 font-medium text-slate-900">Build Primary School Roof</td>
                                            <td className="p-4 text-slate-600">Oct 10, 2024</td>
                                            <td className="p-4"><Badge variant="default">{t('status_funded', 'Funded')}</Badge></td>
                                            <td className="p-4 text-center">
                                                <button className="bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1">
                                                    <HardDrive className="w-3 h-3" /> {t('btn_get_petition', 'Get Petition')}
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-mono text-xs text-slate-500">PET-9041</td>
                                            <td className="p-4 font-medium text-slate-900">Solar Lights for Ward 3</td>
                                            <td className="p-4 text-slate-600">Nov 01, 2024</td>
                                            <td className="p-4"><Badge variant="warning">{t('status_verified', 'Verified')}</Badge></td>
                                            <td className="p-4 text-center">
                                                <button className="bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1">
                                                    <HardDrive className="w-3 h-3" /> {t('btn_get_petition', 'Get Petition')}
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-mono text-xs text-slate-500">PET-9102</td>
                                            <td className="p-4 font-medium text-slate-900">Community Well Cleaning</td>
                                            <td className="p-4 text-slate-600">Jan 15, 2025</td>
                                            <td className="p-4"><Badge variant="neutral">{t('status_under_review', 'Under Review')}</Badge></td>
                                            <td className="p-4 text-center">
                                                <button className="bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1">
                                                    <HardDrive className="w-3 h-3" /> {t('btn_get_petition', 'Get Petition')}
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'Profile Settings':
                return (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="bg-slate-50 border-b border-slate-100 p-5">
                                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-indigo-600" /> {t('tab_profile_settings', 'Citizen Profile & Location Details')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-slate-500 block mb-1 font-semibold">{t('official_legal_name', 'Full Name')}</span>
                                        <span className="font-bold text-slate-900 text-sm">{citizenName}</span>
                                    </div>
                                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-slate-500 block mb-1 font-semibold">{t('email_address', 'Email Address')}</span>
                                        <span className="font-bold text-slate-900 text-sm">{user?.email || 'ramesh.patil@gramin.in'}</span>
                                    </div>
                                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-slate-500 block mb-1 font-semibold">Mobile Number</span>
                                        <span className="font-bold text-slate-900 text-sm font-mono">{citizenMobile}</span>
                                    </div>
                                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-slate-500 block mb-1 font-semibold">{t('select_language', 'Preferred Language')}</span>
                                        <span className="font-bold text-slate-900 text-sm">{citizenLanguage}</span>
                                    </div>
                                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-slate-500 block mb-1 font-semibold">{t('state_district', 'State / District')}</span>
                                        <span className="font-bold text-slate-900 text-sm">{citizenProfile.district || 'Pune'}, {citizenProfile.state || 'Maharashtra'}</span>
                                    </div>
                                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-slate-500 block mb-1 font-semibold">Village / Pincode</span>
                                        <span className="font-bold text-slate-900 text-sm">{citizenProfile.cityVillage || 'Shirur Village'} ({citizenPincode})</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3 text-xs text-indigo-900 mt-2">
                                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                                    <div>
                                        <p className="font-bold">{t('status_verified', 'Verified Citizen Account')}</p>
                                        <p className="text-[11px] text-indigo-700 mt-0.5">Your registered district is used to automatically alert local NGOs and CSR funds to your petitions.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
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
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default" className="text-xs">{t('citizen_portal_badge', 'Citizen Impact Portal')}</Badge>
                        <span className="text-xs text-indigo-200">{t('citizen_welcome', 'Welcome')}, {citizenName}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t('citizen_portal_badge', 'Citizen Impact Portal')}</h1>
                    <p className="text-indigo-100 mt-2 font-medium opacity-90 max-w-2xl">
                        {t('citizen_registered_loc', 'Registered Location')}: <strong className="text-white">{citizenLocation}</strong> • {t('citizen_portal_sub', 'Submit local issues directly to verified NGOs and Corporate CSR funds. Real-time transparent visibility into your community.')}
                    </p>
                </div>
                <button
                    onClick={() => setActiveTab('Submit Petition')}
                    className="relative z-10 bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold shadow-md hover:bg-slate-100 transition whitespace-nowrap w-full md:w-auto mt-2 md:mt-0"
                >
                    {t('btn_submit_petition', 'Submit a Petition')}
                </button>
            </header>

            {/* Mobile-friendly Tab Scroll view */}
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <nav className="flex items-center gap-1 min-w-max pb-2 border-b border-slate-200">
                    {[
                        { id: 'Overview', key: 'tab_overview', label: 'Overview' },
                        { id: 'Submit Petition', key: 'btn_submit_petition', label: 'Submit Petition' },
                        { id: 'My Petitions', key: 'tab_my_petitions', label: 'My Petitions' },
                        { id: 'Nearby Projects', key: 'tab_nearby_projects', label: 'Nearby Projects' },
                        { id: 'Profile Settings', key: 'tab_profile_settings', label: 'Profile Settings' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-3 rounded-t-lg font-semibold text-sm transition-colors ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                            {t(tab.key, tab.label)}
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
