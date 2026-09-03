'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProposals } from '@/lib/ProposalContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FileText, Save, CheckCircle2, ArrowLeft, Plus, Trash2, Camera } from 'lucide-react';

export default function NewProposal() {
    const router = useRouter();
    const { addProposal } = useProposals();
    const [submitting, setSubmitting] = useState(false);

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
        { title: 'Project Approval', percentage: 25 },
        { title: 'Implementation', percentage: 50 },
        { title: 'Completion & Verification', percentage: 25 }
    ]);

    const [validationError, setValidationError] = useState('');

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
            setValidationError('Please fill in all required fields.');
            return false;
        }
        if (calcTotalPercentage() !== 100) {
            setValidationError('Milestone percentages must add up to exactly 100%.');
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
                title: formData.title || 'Untitled Proposal',
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
            router.push('/');
        }, 1000);
    };

    const totalFundingNum = Number(formData.totalFunding) || 0;

    return (
        <div className="p-8 pb-24 max-w-4xl mx-auto space-y-8">
            <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-slate-400 hover:text-indigo-600 transition p-2 rounded-full hover:bg-indigo-50">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create CSR Proposal</h1>
                        <p className="text-slate-500 mt-1 text-sm font-medium">Submit a standardized proposal for corporate matching & validation.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => finalizeSubmit(true)} className="px-5 py-2 rounded-lg font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save Draft
                    </button>
                    <button onClick={() => finalizeSubmit(false)} disabled={submitting} className="bg-indigo-600 px-5 py-2 rounded-lg font-medium text-white hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50">
                        {submitting ? 'Submitting...' : <><CheckCircle2 className="w-4 h-4" /> Submit for Validation</>}
                    </button>
                </div>
            </header>

            {validationError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-semibold flex items-center justify-between">
                    {validationError}
                    <button onClick={() => setValidationError('')}><Trash2 className="w-4 h-4" /></button>
                </div>
            )}

            <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg text-slate-800">1. Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Proposal Title *</label>
                        <input name="title" value={formData.title} onChange={handleFormChange} required type="text" placeholder="e.g. Clean Water Expansion for Rural MH" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">NGO Name *</label>
                            <input name="ngoName" value={formData.ngoName} onChange={handleFormChange} required type="text" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Registration Number</label>
                            <input name="ngoRegNum" value={formData.ngoRegNum} onChange={handleFormChange} type="text" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Project Category</label>
                            <select name="category" value={formData.category} onChange={handleFormChange} className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none">
                                <option>Education</option>
                                <option>Healthcare</option>
                                <option>Environment</option>
                                <option>Sanitation</option>
                                <option>Infrastructure</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Project Location</label>
                            <input name="location" value={formData.location} onChange={handleFormChange} type="text" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none" />
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
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Problem Statement</label>
                        <textarea name="problem" value={formData.problem} onChange={handleFormChange} rows={3} className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none resize-none"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Proposed Solution</label>
                        <textarea name="solution" value={formData.solution} onChange={handleFormChange} rows={3} className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none resize-none"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Beneficiaries (Expected Impact)</label>
                            <input name="beneficiaries" value={formData.beneficiaries} onChange={handleFormChange} type="number" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Expected Completion Date</label>
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
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Total Funding Required (₹) *</label>
                        <input name="totalFunding" value={formData.totalFunding} onChange={handleFormChange} type="number" placeholder="e.g. 500000" className="w-full text-lg font-mono p-3 border border-indigo-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-end mb-2">
                            <label className="block text-sm font-semibold text-slate-700">Funding Milestones (Escrow Driven)</label>
                            <button onClick={() => setMilestones([...milestones, { title: '', percentage: 0 }])} className="text-xs text-indigo-600 flex items-center font-bold gap-1 hover:underline">
                                <Plus className="w-3 h-3" /> Add Milestone
                            </button>
                        </div>

                        {milestones.map((m, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div className="text-slate-400 font-bold font-mono">M{idx + 1}</div>
                                <input type="text" value={m.title} onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)} placeholder="Milestone Title" className="flex-1 p-2 border border-slate-200 rounded bg-white text-sm" />
                                <div className="relative">
                                    <input type="number" value={m.percentage} onChange={(e) => handleMilestoneChange(idx, 'percentage', e.target.value)} className="w-20 p-2 pr-6 border border-slate-200 rounded bg-white text-sm text-right" />
                                    <span className="absolute right-2 top-2 text-slate-400 text-sm">%</span>
                                </div>
                                <div className="w-32 text-right font-mono font-medium text-slate-600 hidden md:block">
                                    ₹{((totalFundingNum * m.percentage) / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </div>
                                <button onClick={() => setMilestones(milestones.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg text-slate-800">4. Supporting Evidence</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <label className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition cursor-pointer relative overflow-hidden">
                        <input type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <Camera className="w-8 h-8 mb-2 text-indigo-400" />
                        <span className="text-sm font-medium text-slate-700">Upload Project MoUs, Registration Certs, or Estimates</span>
                        <span className="text-xs mt-1 text-slate-400">PDF, JPG, PNG (Max 5 files)</span>
                    </label>
                </CardContent>
            </Card>

        </div>
    );
}
