'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProposals } from '@/lib/ProposalContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
    FileText, Save, CheckCircle2, ArrowLeft, Plus, Trash2, 
    Camera, Sparkles, FileCheck, Check
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function NewProposal() {
    const router = useRouter();
    const { addProposal } = useProposals();
    const { t } = useLanguage();
    const [submitting, setSubmitting] = useState(false);
    const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        ngoName: '',
        ngoRegNum: '',
        category: 'Education',
        location: '',
        problem: '',
        solution: '',
        beneficiaries: '',
        targetDate: '',
        totalFunding: ''
    });

    const [milestones, setMilestones] = useState([
        { title: 'Project Approval & Mobilization', percentage: 25 },
        { title: 'Field Implementation & Equipment', percentage: 50 },
        { title: 'Completion, Audit & Handover', percentage: 25 }
    ]);

    const [validationError, setValidationError] = useState('');

    const prefillSampleProposal = () => {
        setFormData({
            title: "Solar Micro-Grid & Drinking Water RO Plant for Haveli Zilla",
            ngoName: "Jal Seva NGO",
            ngoRegNum: "TR-2015-893 / MH-0109283",
            category: "Sanitation",
            location: "Haveli Tehsil, Pune, MH",
            problem: "Over 450 farming households in Haveli zilla face daily water shortages and unpotable high-TDS groundwater. The primary health sub-center lacks reliable power to refrigerate critical vaccines.",
            solution: "Install a 10kVA solar hybrid micro-grid powering a 1,000 LPH reverse osmosis plant with public smart-card distribution taps and dedicated battery backup for the health sub-center.",
            beneficiaries: "2800",
            targetDate: "2025-06-30",
            totalFunding: "450000"
        });

        setMilestones([
            { title: "Hydrological Survey & Solar Array Civil Foundation", percentage: 30 },
            { title: "RO Purification System Assembly & Solar Integration", percentage: 40 },
            { title: "Piping Network Commissioning & Water Lab Certification", percentage: 30 }
        ]);

        setUploadedDocs([
            "haveli_hydrological_survey_report.pdf (2.1 MB)",
            "gram_panchayat_noc_attested.pdf (840 KB)",
            "ro_plant_supplier_quotation.pdf (1.4 MB)"
        ]);
        setValidationError('');
    };

    const calcTotalPercentage = () => milestones.reduce((sum, m) => sum + (Number(m.percentage) || 0), 0);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMilestoneChange = (index: number, field: string, value: string) => {
        const updated = [...milestones];
        if (field === 'percentage') {
            updated[index].percentage = parseFloat(value) || 0;
        } else {
            updated[index].title = value;
        }
        setMilestones(updated);
    };

    const runValidation = () => {
        if (!formData.title || !formData.ngoName || !formData.totalFunding) {
            setValidationError('Please fill in all required fields (Title, NGO Name, Total Funding).');
            return false;
        }
        if (calcTotalPercentage() !== 100) {
            setValidationError(`Milestone percentages must add up to exactly 100% (currently ${calcTotalPercentage()}%).`);
            return false;
        }
        setValidationError('');
        return true;
    };

    const finalizeSubmit = (isDraft: boolean) => {
        if (!isDraft && !runValidation()) return;

        setSubmitting(true);
        setTimeout(() => {
            const mappedMilestones = milestones.map(m => ({
                title: m.title,
                percentage: m.percentage,
                amount: (Number(formData.totalFunding) * m.percentage) / 100,
                status: 'Pending' as const
            }));

            addProposal({
                title: formData.title,
                ngoName: formData.ngoName,
                ngoRegNum: formData.ngoRegNum,
                category: formData.category,
                location: formData.location,
                problem: formData.problem,
                solution: formData.solution,
                beneficiaries: Number(formData.beneficiaries) || 0,
                targetDate: formData.targetDate,
                totalFunding: Number(formData.totalFunding) || 0,
                milestones: mappedMilestones
            }, isDraft);

            setSubmitting(false);
            router.push('/proposals');
        }, 1200);
    };

    const totalFundingNum = Number(formData.totalFunding) || 0;

    return (
        <div className="p-8 pb-24 max-w-4xl mx-auto space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-slate-400 hover:text-indigo-600 transition p-2 rounded-full hover:bg-indigo-50 cursor-pointer">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t('proposals_create_title', 'Create CSR Proposal')}</h1>
                        <p className="text-slate-500 mt-1 text-sm font-medium">Standardized proposal with milestone-based escrow tranches.</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2.5">
                    <button 
                        type="button"
                        onClick={() => finalizeSubmit(true)} 
                        className="px-4 py-2 rounded-lg font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition flex items-center gap-2 cursor-pointer text-sm"
                    >
                        <Save className="w-4 h-4" /> {t('btn_save_draft', 'Save Draft')}
                    </button>
                    <button 
                        type="button"
                        onClick={() => finalizeSubmit(false)} 
                        disabled={submitting} 
                        className="bg-indigo-600 px-5 py-2 rounded-lg font-bold text-white hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50 cursor-pointer text-sm shadow-sm"
                    >
                        {submitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <><CheckCircle2 className="w-4 h-4" /> {t('btn_submit_field_evidence', 'Submit for Validation')}</>
                        )}
                    </button>
                </div>
            </header>

            {/* Quick Demo Pre-fill Banner */}
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Sparkles className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 text-sm">Need a realistic sample proposal for review?</div>
                        <div className="text-xs text-slate-500">Populates all fields, 3 balanced milestones, problem statement, and evidence documents.</div>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={prefillSampleProposal}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                    <Sparkles className="w-4 h-4" />
                    ⚡ Pre-fill Sample Proposal
                </button>
            </div>

            {validationError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-semibold flex items-center justify-between animate-in fade-in">
                    {validationError}
                    <button onClick={() => setValidationError('')} className="cursor-pointer text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )}

            <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg text-slate-800">1. Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('th_title', 'Proposal Title')} *</label>
                        <input name="title" value={formData.title} onChange={handleFormChange} required type="text" placeholder="e.g. Clean Water Expansion for Rural MH" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('ngo_name_label', 'NGO Name')} *</label>
                            <input name="ngoName" value={formData.ngoName} onChange={handleFormChange} required type="text" placeholder="e.g. Jal Seva Foundation" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('reg_number', 'Registration / Darpan ID')}</label>
                            <input name="ngoRegNum" value={formData.ngoRegNum} onChange={handleFormChange} type="text" placeholder="e.g. MH/2016/0109283" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('category_label', 'Project Category')}</label>
                            <select name="category" value={formData.category} onChange={handleFormChange} className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none">
                                <option value="Education">{t('category_education', 'Education')}</option>
                                <option value="Healthcare">{t('category_healthcare', 'Healthcare')}</option>
                                <option value="Environment">{t('category_environment', 'Environment')}</option>
                                <option value="Sanitation">{t('category_sanitation', 'Sanitation')}</option>
                                <option value="Infrastructure">{t('category_infrastructure', 'Infrastructure')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('state_district', 'Project Location')}</label>
                            <input name="location" value={formData.location} onChange={handleFormChange} placeholder="e.g. Haveli, Pune, Maharashtra" type="text" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg text-slate-800">2. Proposal Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('problem_statement', 'Problem Statement')}</label>
                        <textarea name="problem" value={formData.problem} onChange={handleFormChange} placeholder="Describe the acute community problem being addressed..." rows={3} className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none resize-none"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('proposed_solution', 'Proposed Solution')}</label>
                        <textarea name="solution" value={formData.solution} onChange={handleFormChange} placeholder="Detail the technical or operational implementation..." rows={3} className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none resize-none"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('est_beneficiaries', 'Beneficiaries (Expected Direct Impact)')}</label>
                            <input name="beneficiaries" value={formData.beneficiaries} onChange={handleFormChange} type="number" placeholder="e.g. 2800" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('expected_completion_date', 'Expected Completion Date')}</label>
                            <input name="targetDate" value={formData.targetDate} onChange={handleFormChange} type="date" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-indigo-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-indigo-50 border-b border-indigo-100 pb-4">
                    <CardTitle className="text-lg text-indigo-900 flex justify-between items-center">
                        3. Financials & Milestones
                        <Badge variant={calcTotalPercentage() === 100 ? 'success' : 'danger'}>
                            {calcTotalPercentage()}% Allocated
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">{t('total_funding_required', 'Total Funding Required (₹)')} *</label>
                        <input name="totalFunding" value={formData.totalFunding} onChange={handleFormChange} type="number" placeholder="e.g. 450000" className="w-full text-lg font-mono p-3 border border-indigo-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-end mb-2">
                            <label className="block text-sm font-semibold text-slate-700">{t('funding_milestones', 'Funding Milestones (Escrow Driven)')}</label>
                            <button onClick={() => setMilestones([...milestones, { title: '', percentage: 0 }])} className="text-xs text-indigo-600 flex items-center font-bold gap-1 hover:underline cursor-pointer">
                                <Plus className="w-3 h-3" /> {t('add_milestone', 'Add Milestone')}
                            </button>
                        </div>

                        {milestones.map((m, idx) => (
                            <div key={idx} className="flex items-center gap-3 md:gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div className="text-slate-400 font-bold font-mono">M{idx + 1}</div>
                                <input type="text" value={m.title} onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)} placeholder="Milestone Title" className="flex-1 p-2 border border-slate-200 rounded bg-white text-sm" />
                                <div className="relative">
                                    <input type="number" value={m.percentage} onChange={(e) => handleMilestoneChange(idx, 'percentage', e.target.value)} className="w-20 p-2 pr-6 border border-slate-200 rounded bg-white text-sm text-right" />
                                    <span className="absolute right-2 top-2 text-slate-400 text-sm">%</span>
                                </div>
                                <div className="w-32 text-right font-mono font-medium text-slate-600 hidden md:block">
                                    ₹{((totalFundingNum * m.percentage) / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </div>
                                <button onClick={() => setMilestones(milestones.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600 cursor-pointer">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg text-slate-800">4. Supporting Evidence & Verification Documents</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <label className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition cursor-pointer relative overflow-hidden">
                        <input 
                            type="file" 
                            multiple 
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    const names = Array.from(e.target.files).map(f => `${f.name} (${(f.size / 1024).toFixed(0)} KB)`);
                                    setUploadedDocs(prev => [...prev, ...names]);
                                }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        />
                        <Camera className="w-8 h-8 mb-2 text-indigo-400" />
                        <span className="text-sm font-medium text-slate-700">Upload Project MoUs, Registration Certs, or Price Quotations</span>
                        <span className="text-xs mt-1 text-slate-400">PDF, JPG, PNG (Simulated attachment)</span>
                    </label>

                    {uploadedDocs.length > 0 && (
                        <div className="space-y-2 pt-2">
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Attached Documents ({uploadedDocs.length}):</div>
                            {uploadedDocs.map((doc, dIdx) => (
                                <div key={dIdx} className="flex justify-between items-center p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-lg text-xs">
                                    <span className="flex items-center gap-2 text-indigo-900 font-medium">
                                        <FileCheck className="w-4 h-4 text-emerald-600" /> {doc}
                                    </span>
                                    <button 
                                        type="button"
                                        onClick={() => setUploadedDocs(uploadedDocs.filter((_, i) => i !== dIdx))}
                                        className="text-slate-400 hover:text-red-500 cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

