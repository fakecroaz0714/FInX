'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
    Megaphone, MapPin, Search, FileText, Camera, Upload, CheckCircle2,
    Clock, Building2, BellRing, Target, ShieldCheck, HardDrive, Info, Navigation, Users,
    X, AlertTriangle, ExternalLink, Sparkles, Download, Check
} from 'lucide-react';
import { CitizenNearbyProjectsMap } from '@/components/maps/CitizenNearbyProjectsMap';
import { useAuth, CitizenProfile } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';

interface PetitionItem {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    pincode: string;
    beneficiaries: number;
    date: string;
    status: 'Submitted' | 'Verified' | 'Funded' | 'Under Review';
    matchedNGO?: string;
    sponsor?: string;
    escrowBudget?: string;
    milestoneProgress?: number;
    evidencePhoto?: string;
}

const INITIAL_PETITIONS: PetitionItem[] = [
    {
        id: 'PET-8992',
        title: 'Build Primary School Roof',
        description: 'Currently studying under open sun. Monsoons destroy books every year and halt education for 250 local children in Shirur block.',
        category: 'Education & Schools',
        location: 'Shirur Village, Pune, Maharashtra',
        pincode: '412210',
        beneficiaries: 250,
        date: 'Oct 10, 2024',
        status: 'Funded',
        matchedNGO: 'EduCare Org',
        sponsor: 'TechCorp India (CSR Initiative)',
        escrowBudget: '₹4,50,000',
        milestoneProgress: 65,
        evidencePhoto: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'PET-9041',
        title: 'Solar Lights for Ward 3',
        description: 'Pitch dark streets causing severe safety concerns for evening workers and students returning to the residential colony.',
        category: 'Environment (Water/Solar)',
        location: 'Ward 3, Shirur Block, Pune',
        pincode: '412210',
        beneficiaries: 650,
        date: 'Nov 01, 2024',
        status: 'Verified',
        matchedNGO: 'Green Earth Foundation',
        sponsor: 'Seeking Corporate Matching',
        escrowBudget: '₹2,80,000',
        milestoneProgress: 20,
        evidencePhoto: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'PET-9102',
        title: 'Community Well Desilting & Cleaning',
        description: 'Village well silted with monsoon runoff; water contains high turbidity causing gastro-intestinal issues across 80 families.',
        category: 'Sanitation',
        location: 'Baramati Taluka, Pune, Maharashtra',
        pincode: '413102',
        beneficiaries: 400,
        date: 'Jan 15, 2025',
        status: 'Under Review',
        matchedNGO: 'Jal Seva NGO',
        sponsor: 'Under Evaluation',
        escrowBudget: '₹1,50,000',
        milestoneProgress: 0,
        evidencePhoto: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80'
    }
];

export default function CitizenDashboard() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('Overview');
    const [petitions, setPetitions] = useState<PetitionItem[]>(INITIAL_PETITIONS);

    // Form inputs state
    const [problemTitle, setProblemTitle] = useState('');
    const [category, setCategory] = useState('Education & Schools');
    const [beneficiaries, setBeneficiaries] = useState('');
    const [description, setDescription] = useState('');
    const [locationName, setLocationName] = useState('');
    const [pincode, setPincode] = useState('');
    const [evidenceFile, setEvidenceFile] = useState('');

    // Modal states
    const [showEvidenceModal, setShowEvidenceModal] = useState(false);
    const [evidenceModalTab, setEvidenceModalTab] = useState<'photos' | 'invoice'>('photos');
    const [selectedEvidencePhotoIdx, setSelectedEvidencePhotoIdx] = useState<number>(0);
    const [showDiscrepancyModal, setShowDiscrepancyModal] = useState(false);
    const [discrepancyType, setDiscrepancyType] = useState('Material Quality Mismatch');
    const [discrepancyNote, setDiscrepancyNote] = useState('');
    const [selectedPetition, setSelectedPetition] = useState<PetitionItem | null>(null);

    // Interactive notification & citizen attestation
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);
    const [fieldAttested, setFieldAttested] = useState(false);

    const citizenProfile = (user?.profile as CitizenProfile) || {};
    const citizenName = citizenProfile.fullName || user?.name || 'Ramesh Patil';
    const citizenMobile = citizenProfile.mobile || user?.mobile || '9876543210';
    const citizenLocation = `${citizenProfile.cityVillage || 'Shirur Village'}, ${citizenProfile.district || 'Pune'}, ${citizenProfile.state || 'Maharashtra'}`;
    const citizenPincode = citizenProfile.pincode || '412210';
    const citizenLanguage = citizenProfile.preferredLanguage === 'mr' ? 'मराठी (Marathi)' : citizenProfile.preferredLanguage === 'hi' ? 'हिन्दी (Hindi)' : 'English';

    const triggerNotice = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    // Pre-fill Form with Realistic Prior Info
    const handlePreFillDemo = () => {
        setProblemTitle('Primary Health Clinic Solar Battery Backup');
        setCategory('Healthcare & Clinics');
        setBeneficiaries('1200');
        setDescription('Frequent rural grid load-shedding causes life-saving vaccine refrigerators and baby warmers to lose power. We need a 5kVA solar inverter with lithium storage for uninterrupted power at the Shirur community sub-center.');
        setLocationName('Shirur Village, Pune');
        setPincode('412210');
        setEvidenceFile('Clinic_Substation_Proof.jpg');
        triggerNotice('Pre-filled sample petition with verified rural clinic data!', 'info');
    };

    const formSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPetition: PetitionItem = {
            id: `PET-${Math.floor(1000 + Math.random() * 9000)}`,
            title: problemTitle || 'Community Drinking Water Pipeline Extension',
            description: description || 'Local petition submitted by village council.',
            category: category,
            location: locationName || citizenLocation,
            pincode: pincode || citizenPincode,
            beneficiaries: Number(beneficiaries) || 350,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: 'Submitted',
            matchedNGO: 'Pending NGO Assignment',
            sponsor: 'Awaiting CSR Matching',
            escrowBudget: '₹2,00,000',
            milestoneProgress: 0,
            evidencePhoto: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80'
        };

        setPetitions([newPetition, ...petitions]);
        // Reset form
        setProblemTitle('');
        setDescription('');
        setBeneficiaries('');
        setLocationName('');
        setPincode('');
        setEvidenceFile('');

        triggerNotice(`Petition "${newPetition.title}" (${newPetition.id}) successfully recorded on FINX blockchain ledger!`);
        setActiveTab('My Petitions');
    };

    const handleConfirmFieldProgress = () => {
        setFieldAttested(true);
        triggerNotice(`Field progress confirmed by citizen attestation (${citizenName})! Recorded on-chain with zero-gas signature.`);
    };

    const handleReportDiscrepancySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowDiscrepancyModal(false);
        triggerNotice(`Discrepancy report filed: "${discrepancyType}". Assigned to independent field validator for site re-audit.`, 'warning');
        setDiscrepancyNote('');
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Submit Petition':
                return (
                    <Card className="max-w-3xl mx-auto border-indigo-100 shadow-sm mt-4">
                        <CardHeader className="bg-indigo-50/50 border-b border-indigo-50 pb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-xl text-indigo-900 flex items-center gap-2">
                                <Megaphone className="w-5 h-5 text-indigo-600" /> {t('citizen_voice_need', 'Voice a Community Need')}
                            </CardTitle>
                            <button
                                type="button"
                                onClick={handlePreFillDemo}
                                className="bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Pre-fill Sample Issue
                            </button>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={formSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">{t('core_issue_details', '1. Core Issue Details')}</h3>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('problem_title', 'Problem Title')}</label>
                                        <input
                                            required
                                            type="text"
                                            value={problemTitle}
                                            onChange={(e) => setProblemTitle(e.target.value)}
                                            placeholder={t('problem_title_placeholder', 'e.g. Broken water pipeline in village square')}
                                            className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition text-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('category_label', 'Category')}</label>
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-sm"
                                            >
                                                <option>{t('cat_education', 'Education & Schools')}</option>
                                                <option>{t('cat_healthcare', 'Healthcare & Clinics')}</option>
                                                <option>{t('cat_environment', 'Environment (Water/Solar)')}</option>
                                                <option>{t('cat_sanitation', 'Sanitation')}</option>
                                                <option>{t('cat_infrastructure', 'Infrastructure (Roads/Bridges)')}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('est_beneficiaries', 'Estimated Beneficiaries')}</label>
                                            <input
                                                type="number"
                                                value={beneficiaries}
                                                onChange={(e) => setBeneficiaries(e.target.value)}
                                                placeholder="e.g. 500"
                                                className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('detailed_description', 'Detailed Description')}</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder={t('description_placeholder', 'Describe the severity of the problem and how it affects the community...')}
                                            className="w-full p-2.5 border border-slate-200 rounded-lg bg-white resize-none text-sm"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2 mt-8">{t('field_evidence_photos', '2. Field Evidence & Photos')}</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('state_district', 'Village / Town')}</label>
                                            <input
                                                required
                                                type="text"
                                                value={locationName}
                                                onChange={(e) => setLocationName(e.target.value)}
                                                placeholder="e.g. Shirur Village, Pune"
                                                className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Pincode / Zip</label>
                                            <input
                                                type="text"
                                                value={pincode}
                                                onChange={(e) => setPincode(e.target.value)}
                                                placeholder="e.g. 412210"
                                                className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-sm font-mono"
                                            />
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

                                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition flex justify-center items-center gap-2 cursor-pointer shadow-md shadow-indigo-100">
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

                        {/* Highlighted Active Escrow Petition */}
                        <Card className="border-emerald-200 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">PET-8992</span>
                                            <span className="text-xs text-slate-400">Shirur Block</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2">Build Primary School Roof</h3>
                                        <p className="text-sm border-l-2 border-slate-300 pl-3 text-slate-500">Currently studying under open sun. Monsoons destroy books every year and halt education for 250 local children.</p>
                                    </div>
                                    <Badge variant="default" className="text-sm px-3 py-1 shadow-sm shrink-0">Funded & In Progress</Badge>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg flex flex-col md:flex-row gap-6 mb-6 text-xs">
                                    <div className="flex-1">
                                        <div className="text-slate-400 uppercase font-bold tracking-wider mb-1">Adopted By</div>
                                        <div className="font-semibold text-slate-800 flex items-center gap-2"><Building2 className="w-4 h-4 text-indigo-500" /> EduCare Org</div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-slate-400 uppercase font-bold tracking-wider mb-1">Corporate Sponsor</div>
                                        <div className="font-semibold text-slate-800">TechCorp India (CSR Initiative)</div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-slate-400 uppercase font-bold tracking-wider mb-1">Escrow Tranche</div>
                                        <div className="font-mono font-bold text-emerald-700">₹2,00,000 Released (M1)</div>
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
                                                    <span className="text-[10px] font-bold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded">Milestone 2</span>
                                                </div>
                                                <div className="text-xs text-amber-700 font-medium">
                                                    NGO submitted work photos. Awaiting corporate approval for Milestone 2 payout.{' '}
                                                    <button
                                                        onClick={() => setShowEvidenceModal(true)}
                                                        className="underline font-bold text-indigo-700 hover:text-indigo-900 ml-1 cursor-pointer"
                                                    >
                                                        View Evidence Photos
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="mt-6 flex flex-wrap justify-end gap-3 text-xs w-full">
                                        <button
                                            onClick={() => setShowDiscrepancyModal(true)}
                                            className="bg-white border border-rose-300 text-rose-700 px-3.5 py-2 rounded-lg font-medium hover:bg-rose-50 transition flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <AlertTriangle className="w-3.5 h-3.5" /> Report Discrepancy
                                        </button>
                                        <button
                                            onClick={handleConfirmFieldProgress}
                                            className={`px-4 py-2 rounded-lg font-medium shadow-sm transition flex items-center gap-1.5 cursor-pointer ${
                                                fieldAttested
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            }`}
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            {fieldAttested ? 'Field Progress Attested ✓' : 'Confirm Field Progress'}
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Petitions Archive Table */}
                        <div className="mt-6">
                            <h3 className="font-bold text-slate-900 text-sm tracking-wider uppercase mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-600" /> All Village Petitions ({petitions.length})
                            </h3>
                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                                        <tr>
                                            <th className="p-3.5">{t('th_petition_id', 'Petition ID')}</th>
                                            <th className="p-3.5">{t('th_title', 'Title')}</th>
                                            <th className="p-3.5">{t('th_date', 'Date Submitted')}</th>
                                            <th className="p-3.5">{t('th_status', 'Status')}</th>
                                            <th className="p-3.5 text-center">{t('th_action', 'Action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {petitions.map((pet) => (
                                            <tr key={pet.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-3.5 font-mono text-xs font-bold text-indigo-600">{pet.id}</td>
                                                <td className="p-3.5 font-bold text-slate-900">
                                                    <div>{pet.title}</div>
                                                    <div className="text-[11px] text-slate-400 font-normal truncate max-w-xs">{pet.description}</div>
                                                </td>
                                                <td className="p-3.5 text-slate-600 whitespace-nowrap">{pet.date}</td>
                                                <td className="p-3.5 whitespace-nowrap">
                                                    <Badge
                                                        variant={
                                                            pet.status === 'Funded' ? 'default' :
                                                            pet.status === 'Verified' ? 'warning' :
                                                            pet.status === 'Submitted' ? 'success' : 'neutral'
                                                        }
                                                    >
                                                        {pet.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-3.5 text-center whitespace-nowrap">
                                                    <button
                                                        onClick={() => setSelectedPetition(pet)}
                                                        className="bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <HardDrive className="w-3 h-3" /> {t('btn_get_petition', 'Get Petition')}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'Nearby Projects':
                return (
                    <div className="mb-8">
                        <CitizenNearbyProjectsMap />
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
            default: // Overview
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="shadow-sm border-slate-200 bg-white hover:border-indigo-300 transition-colors cursor-pointer" onClick={() => setActiveTab('My Petitions')}>
                            <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                                <div className="p-4 bg-indigo-50 rounded-full mb-4"><HardDrive className="w-8 h-8 text-indigo-600" /></div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{petitions.length}</div>
                                <div className="text-sm font-semibold text-slate-500 tracking-wide uppercase">Active Petitions</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-slate-200 bg-white hover:border-amber-300 transition-colors cursor-pointer" onClick={() => setActiveTab('My Petitions')}>
                            <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                                <div className="p-4 bg-amber-50 rounded-full mb-4"><Clock className="w-8 h-8 text-amber-600" /></div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{petitions.filter(p => p.status === 'Under Review' || p.status === 'Submitted').length}</div>
                                <div className="text-sm font-semibold text-slate-500 tracking-wide uppercase">Pending Review</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-slate-200 bg-white hover:border-emerald-300 transition-colors cursor-pointer" onClick={() => setActiveTab('Nearby Projects')}>
                            <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                                <div className="p-4 bg-emerald-50 rounded-full mb-4"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">18</div>
                                <div className="text-sm font-semibold text-slate-500 tracking-wide uppercase">Local Projects Completed</div>
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
                                        <h4 className="font-bold text-slate-900 text-sm">Nearby Community Impact Projects</h4>
                                        <p className="text-xs text-slate-600 mt-0.5">Explore 5 verified grassroots projects around Pune on the interactive map.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveTab('Nearby Projects')}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-xs whitespace-nowrap cursor-pointer"
                                >
                                    Open Nearby Projects Map &rarr;
                                </button>
                            </div>
                        </div>

                        {/* Recent Notifications Feed */}
                        <div className="md:col-span-3 mt-4">
                            <h3 className="font-bold text-slate-900 text-sm tracking-wider uppercase mb-3 flex items-center gap-2"><BellRing className="w-4 h-4 text-indigo-600" /> Recent Project Updates</h3>
                            <div className="bg-white border text-sm border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 shadow-sm">
                                <div className="p-4 flex gap-4 items-start bg-indigo-50/40">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                                    <div>
                                        <p className="font-semibold text-slate-900">EduCare NGO uploaded new evidence photos!</p>
                                        <p className="text-slate-500 mt-1">Your submitted petition "Build Primary School Roof" has new active escrow progression.</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-xs font-mono text-slate-400">2 hours ago</span>
                                            <button onClick={() => setShowEvidenceModal(true)} className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">
                                                Inspect Photos &rarr;
                                            </button>
                                        </div>
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

                        {/* Petitions Archive Preview */}
                        <div className="md:col-span-3 mt-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-slate-900 text-sm tracking-wider uppercase flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-indigo-600" /> {t('my_petitions_title', 'Petition History')}
                                </h3>
                                <button onClick={() => setActiveTab('My Petitions')} className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">
                                    View All ({petitions.length}) &rarr;
                                </button>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                                        <tr>
                                            <th className="p-3.5">{t('th_petition_id', 'Petition ID')}</th>
                                            <th className="p-3.5">{t('th_title', 'Title')}</th>
                                            <th className="p-3.5">{t('th_date', 'Date Submitted')}</th>
                                            <th className="p-3.5">{t('th_status', 'Status')}</th>
                                            <th className="p-3.5 text-center">{t('th_action', 'Action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {petitions.slice(0, 3).map((pet) => (
                                            <tr key={pet.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-3.5 font-mono text-xs font-bold text-indigo-600">{pet.id}</td>
                                                <td className="p-3.5 font-bold text-slate-900">{pet.title}</td>
                                                <td className="p-3.5 text-slate-600">{pet.date}</td>
                                                <td className="p-3.5">
                                                    <Badge
                                                        variant={
                                                            pet.status === 'Funded' ? 'default' :
                                                            pet.status === 'Verified' ? 'warning' : 'neutral'
                                                        }
                                                    >
                                                        {pet.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-3.5 text-center">
                                                    <button
                                                        onClick={() => setSelectedPetition(pet)}
                                                        className="bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <HardDrive className="w-3 h-3" /> {t('btn_get_petition', 'Get Petition')}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="p-4 md:p-8 pb-24 max-w-7xl mx-auto space-y-6 md:space-y-8">
            {/* Real-time Notification Banner */}
            {notification && (
                <div className={`p-4 rounded-xl flex items-center justify-between border shadow-sm animate-in fade-in text-xs font-bold ${
                    notification.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : notification.type === 'warning'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                }`}>
                    <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{notification.message}</span>
                    </div>
                    <button onClick={() => setNotification(null)} className="text-slate-500 hover:text-slate-800 font-bold">Dismiss</button>
                </div>
            )}

            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-slate-900 to-indigo-900 p-6 md:p-8 rounded-2xl text-white shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12">
                    <Target className="w-64 h-64" />
                </div>

                <div className="relative z-10 w-full mb-4 md:mb-0">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default" className="text-xs">{t('citizen_portal_badge', 'Citizen Impact Portal')}</Badge>
                        <span className="text-xs text-indigo-200">{t('citizen_welcome', 'Welcome')}, {citizenName}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t('citizen_portal_badge', 'Citizen Impact Portal')}</h1>
                    <p className="text-indigo-100 mt-2 font-medium opacity-90 max-w-2xl text-xs md:text-sm">
                        {t('citizen_registered_loc', 'Registered Location')}: <strong className="text-white">{citizenLocation}</strong> • {t('citizen_portal_sub', 'Submit local issues directly to verified NGOs and Corporate CSR funds. Real-time transparent visibility into your community.')}
                    </p>
                </div>
                <button
                    onClick={() => setActiveTab('Submit Petition')}
                    className="relative z-10 bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold shadow-md hover:bg-slate-100 transition whitespace-nowrap w-full md:w-auto mt-2 md:mt-0 cursor-pointer text-sm"
                >
                    {t('btn_submit_petition', 'Submit a Petition')}
                </button>
            </header>

            {/* Navigation Tabs */}
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
                            className={`px-5 py-3 rounded-t-lg font-semibold text-sm transition-colors cursor-pointer ${
                                activeTab === tab.id ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            {t(tab.key, tab.label)}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="pt-2">
                {renderTabContent()}
            </div>

            {/* =========================================================================
                MODAL 1: VIEW EVIDENCE PHOTOS & INVOICES (School Roof Milestone)
               ========================================================================= */}
            {showEvidenceModal && (() => {
                const citizenEvidencePhotos = [
                    {
                        url: "/proofs/val-mum-209-1.jpg",
                        title: "Roof Superstructure & Trusses Assembly",
                        caption: "Pre-fabricated galvanised tubular steel trusses anchored to existing brick load-bearing walls.",
                        gps: "18.520432° N, 73.856744° E",
                        precision: "±1.2m RTK precision",
                        time: "03-Sep-2026 14:22 IST",
                        surveyor: "Rajesh Kulkarni (Civil Auditor)"
                    },
                    {
                        url: "/proofs/val-str-047-1.jpg",
                        title: "Material Staging & Tata Tiscon Rebar Batch",
                        caption: "120 Bags UltraTech Grade 53 Cement & Tata Tiscon Fe550D TMT rebar unloaded in school courtyard.",
                        gps: "18.520410° N, 73.856720° E",
                        precision: "±1.1m RTK precision",
                        time: "02-Sep-2026 11:30 IST",
                        surveyor: "Rajesh Kulkarni (Civil Auditor)"
                    },
                    {
                        url: "/proofs/val-mum-209-2.jpg",
                        title: "Perimeter Drainage & Rainwater Gutters",
                        caption: "Trenching completed for connecting roof runoff to village recharge pit.",
                        gps: "18.520450° N, 73.856760° E",
                        precision: "±1.4m RTK precision",
                        time: "01-Sep-2026 16:45 IST",
                        surveyor: "Rajesh Kulkarni (Civil Auditor)"
                    }
                ];

                const currentPhoto = citizenEvidencePhotos[selectedEvidencePhotoIdx] || citizenEvidencePhotos[0];

                return (
                    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[92vh] overflow-y-auto text-xs">
                            {/* Modal Header */}
                            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="success" className="text-[10px]">Milestone 2 Verified Evidence</Badge>
                                        <span className="font-mono text-slate-400">PET-8992</span>
                                        <span className="text-slate-400">&bull;</span>
                                        <span className="text-emerald-700 font-bold font-mono">₹25,000 Tranche</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Build Primary School Roof - Field Proofs & Tax Invoices</h3>
                                </div>
                                <button
                                    onClick={() => setShowEvidenceModal(false)}
                                    className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Dual Tabs Switcher */}
                            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                                <button
                                    onClick={() => setEvidenceModalTab('photos')}
                                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                                        evidenceModalTab === 'photos'
                                            ? 'bg-indigo-600 text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    <Camera className="w-4 h-4" />
                                    <span>Geotagged Field Photos</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                        evidenceModalTab === 'photos' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                        {citizenEvidencePhotos.length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setEvidenceModalTab('invoice')}
                                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                                        evidenceModalTab === 'invoice'
                                            ? 'bg-indigo-600 text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>Material Tax Invoice & Voucher</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                        evidenceModalTab === 'invoice' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                        1
                                    </span>
                                </button>
                            </div>

                            {/* TAB 1: FIELD PHOTOS GALLERY */}
                            {evidenceModalTab === 'photos' && (
                                <div className="space-y-4">
                                    {/* Main Photo View */}
                                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 relative shadow-inner">
                                        <img
                                            src={currentPhoto.url}
                                            alt={currentPhoto.title}
                                            className="w-full h-80 object-cover"
                                        />
                                        <div className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[10px] font-bold shadow-xs flex items-center gap-1">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span>{currentPhoto.precision}</span>
                                        </div>
                                        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/85 backdrop-blur-sm text-white px-3.5 py-2 rounded-lg text-[11px] font-mono border border-slate-700 flex flex-wrap items-center justify-between gap-2">
                                            <div>
                                                <span className="text-emerald-400 font-bold">GPS:</span> {currentPhoto.gps}
                                            </div>
                                            <div className="text-slate-300">
                                                {currentPhoto.time} &bull; {currentPhoto.surveyor}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thumbnail Strip */}
                                    <div>
                                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                            Field Photos &bull; Select to Inspect ({selectedEvidencePhotoIdx + 1} of {citizenEvidencePhotos.length})
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {citizenEvidencePhotos.map((photo, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedEvidencePhotoIdx(idx)}
                                                    className={`relative rounded-xl overflow-hidden border-2 transition text-left cursor-pointer ${
                                                        selectedEvidencePhotoIdx === idx
                                                            ? 'border-indigo-600 shadow-md ring-2 ring-indigo-200'
                                                            : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                                                    }`}
                                                >
                                                    <img
                                                        src={photo.url}
                                                        alt={photo.title}
                                                        className="w-full h-20 object-cover"
                                                    />
                                                    <div className="p-1.5 bg-white border-t border-slate-100">
                                                        <div className="text-[10px] font-bold text-slate-800 truncate">
                                                            {idx + 1}. {photo.title}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Observation Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <span className="text-slate-400 uppercase font-bold text-[10px] block mb-1">Observation Details</span>
                                            <div className="font-bold text-slate-800 text-xs">{currentPhoto.title}</div>
                                            <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">{currentPhoto.caption}</p>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <span className="text-slate-400 uppercase font-bold text-[10px] block mb-1">Cryptographic IPFS CID</span>
                                            <span className="font-mono text-[11px] text-indigo-600 break-all block">
                                                QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWez79ojWnPbdG
                                            </span>
                                            <div className="text-slate-500 text-[10px] mt-1 flex items-center gap-1 font-mono">
                                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                                <span>Tamper-proof blockchain hash verified</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: SCANNED GST TAX INVOICE */}
                            {evidenceModalTab === 'invoice' && (
                                <div className="space-y-4">
                                    {/* Invoice Toolbar */}
                                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                            <span className="font-semibold text-slate-800 text-xs">
                                                Supplier: <strong className="text-slate-900">Shree Balaji Building Materials</strong>
                                            </span>
                                            <span className="text-slate-300">|</span>
                                            <span className="font-mono text-[11px] text-slate-500">GSTIN: 27AAAAA0000A1Z5</span>
                                        </div>
                                        <a
                                            href="/invoices/gst-tax-invoice-shree-balaji.svg"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5 text-indigo-600" /> Open Full-Size Invoice
                                        </a>
                                    </div>

                                    {/* Scanned Invoice SVG Container */}
                                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-inner overflow-hidden max-h-[460px] overflow-y-auto">
                                        <img
                                            src="/invoices/gst-tax-invoice-shree-balaji.svg"
                                            alt="Scanned GST Tax Invoice - Shree Balaji Building Materials"
                                            className="w-full h-auto rounded border border-slate-100 shadow-xs mx-auto"
                                        />
                                    </div>

                                    {/* Financial Breakdown Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Invoice Number</span>
                                            <div className="font-bold text-slate-800 font-mono">INV-2024-884</div>
                                            <div className="text-slate-500 text-[11px] mt-0.5">Dated: 02-Sep-2026</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Materials Procured</span>
                                            <div className="font-semibold text-slate-800 text-[11px] line-clamp-2">120 Cement Bags + 0.8 MT TMT Steel + 2 Brass Sand</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Audited Total</span>
                                            <div className="font-bold text-emerald-700 text-sm font-mono">₹25,000.00</div>
                                            <div className="text-[10px] text-emerald-600 font-medium">Fully Matched with Public Escrow</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Modal Footer with Citizen Attestation */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                                    <span>Citizens have open access to inspect all site photos and supplier tax vouchers.</span>
                                </div>

                                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                                    <button
                                        onClick={() => setShowEvidenceModal(false)}
                                        className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition cursor-pointer"
                                    >
                                        Close Evidence Viewer
                                    </button>

                                    {!fieldAttested ? (
                                        <button
                                            onClick={() => {
                                                setFieldAttested(true);
                                                triggerNotice('Your citizen field attestation has been confirmed and anchored to the project ledger!');
                                                setShowEvidenceModal(false);
                                            }}
                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                                        >
                                            <Check className="w-4 h-4" /> Vouch & Attest Proofs
                                        </button>
                                    ) : (
                                        <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-1.5">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Attested by You
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* =========================================================================
                MODAL 2: REPORT FIELD DISCREPANCY
               ========================================================================= */}
            {showDiscrepancyModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-xs">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Report Ground Discrepancy</h3>
                                    <p className="text-[11px] text-slate-500">Alert independent auditors to on-site issues before escrow release.</p>
                                </div>
                            </div>
                            <button onClick={() => setShowDiscrepancyModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleReportDiscrepancySubmit} className="space-y-3">
                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Select Discrepancy Category:</label>
                                <select
                                    value={discrepancyType}
                                    onChange={(e) => setDiscrepancyType(e.target.value)}
                                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-white font-medium text-slate-800"
                                >
                                    <option>Material Quality Mismatch</option>
                                    <option>Work Halted on Site / Contractor Inactive</option>
                                    <option>Location Divergence / Wrong Building</option>
                                    <option>Safety or Environmental Hazard</option>
                                    <option>Other Operational Concern</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Citizen Observation Notes:</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={discrepancyNote}
                                    onChange={(e) => setDiscrepancyNote(e.target.value)}
                                    placeholder="Describe specifically what you noticed on the site..."
                                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-white resize-none"
                                />
                            </div>

                            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                                <strong>Whistleblower Protection:</strong> Submissions are cryptographically signed with your resident DID and shielded under the FINX CSR Transparency Charter.
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowDiscrepancyModal(false)}
                                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm"
                                >
                                    <AlertTriangle className="w-3.5 h-3.5" /> Submit Audit Alert
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =========================================================================
                MODAL 3: PETITION DOSSIER ("Get Petition")
               ========================================================================= */}
            {selectedPetition && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{selectedPetition.id}</span>
                                    <Badge variant={selectedPetition.status === 'Funded' ? 'default' : selectedPetition.status === 'Verified' ? 'warning' : 'neutral'}>
                                        {selectedPetition.status}
                                    </Badge>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">{selectedPetition.title}</h3>
                            </div>
                            <button onClick={() => setSelectedPetition(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Problem Summary</span>
                            <p className="text-slate-700 leading-relaxed">{selectedPetition.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Location & Pincode</span>
                                <div className="font-bold text-slate-800 mt-0.5">{selectedPetition.location} ({selectedPetition.pincode})</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Beneficiaries</span>
                                <div className="font-mono font-bold text-slate-800 mt-0.5">{selectedPetition.beneficiaries.toLocaleString()} People</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Assigned NGO Partner</span>
                                <div className="font-bold text-indigo-700 mt-0.5">{selectedPetition.matchedNGO}</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Escrow Budget</span>
                                <div className="font-mono font-bold text-slate-900 mt-0.5">{selectedPetition.escrowBudget}</div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                            <span className="text-slate-400 font-mono text-[11px]">Submitted: {selectedPetition.date}</span>
                            <button
                                onClick={() => {
                                    triggerNotice(`Signed petition ${selectedPetition.id} certificate downloaded successfully!`);
                                    setSelectedPetition(null);
                                }}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                            >
                                <Download className="w-3.5 h-3.5" /> Download Verified Dossier
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
