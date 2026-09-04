'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ArrowLeft, Save, MapPin, Sparkles, CheckCircle2 } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';

export default function NewPetitionPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [targetSignatures, setTargetSignatures] = useState('1000');
    const [description, setDescription] = useState('');

    const handlePreFillDemo = () => {
        setTitle('Solar Powered Community Water Chiller & Purifier');
        setLocation('Haveli Block, Pune, Maharashtra');
        setTargetSignatures('1500');
        setDescription('During peak summer, temperatures exceed 43°C. Over 800 rural school children and farmers have no clean chilled drinking water. Installing a 2,000 LPH solar RO unit at the village square will eliminate waterborne fluorosis and heat exhaustion.');
        setNotification('Pre-filled sample petition with verified rural drinking water need!');
        setTimeout(() => setNotification(null), 4000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setNotification('Petition registered on FINX ledger! Redirecting to petitions list...');
            setTimeout(() => {
                router.push('/petitions');
            }, 1200);
        }, 1000);
    };

    return (
        <div className="p-8 pb-20 max-w-4xl mx-auto w-full space-y-6">
            {notification && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{notification}</span>
                </div>
            )}

            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Link href="/petitions" className="text-indigo-600 text-xs font-bold flex items-center gap-1 mb-2 hover:underline">
                        <ArrowLeft className="w-3.5 h-3.5" /> {t('back_to_petitions', 'Back to Petitions')}
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('start_new_petition', 'Start a New Petition')}</h1>
                    <p className="text-slate-500 mt-1 text-xs sm:text-sm">{t('citizen_portal_sub', 'Mobilize support and get matched with an NGO and CSR funding.')}</p>
                </div>
                <button
                    type="button"
                    onClick={handlePreFillDemo}
                    className="bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                >
                    <Sparkles className="w-4 h-4 text-indigo-600" /> Pre-fill Example Petition
                </button>
            </header>

            <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                    <CardTitle className="text-base font-bold text-slate-900">{t('core_issue_details', 'Petition Details')}</CardTitle>
                    <CardDescription className="text-xs">{t('citizen_voice_need', 'Provide a clear description of the community need.')}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5 text-xs">

                        <div className="space-y-1.5">
                            <label htmlFor="title" className="block font-semibold text-slate-700">{t('problem_title', 'Project Title')} *</label>
                            <input
                                required
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={t('problem_title_placeholder', 'e.g. Clean Water Filter for ZP School')}
                                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none transition text-xs"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block font-semibold text-slate-700">{t('state_district', 'Location (City, State)')} *</label>
                                <div className="relative">
                                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                    <input
                                        required
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Pune, Maharashtra"
                                        className="w-full border border-slate-300 rounded-lg pl-9 pr-3.5 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none transition text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block font-semibold text-slate-700">{t('est_beneficiaries', 'Target Signatures')} *</label>
                                <input
                                    required
                                    type="number"
                                    min="100"
                                    value={targetSignatures}
                                    onChange={(e) => setTargetSignatures(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none transition text-xs font-mono"
                                />
                                <p className="text-[10px] text-slate-400">Number of verified signatures needed to trigger NGO and validator review.</p>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block font-semibold text-slate-700">{t('detailed_description', 'Detailed Description')} *</label>
                            <textarea
                                required
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={t('description_placeholder', 'Describe the issue, who it affects, and what the proposed solution might look like...')}
                                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none transition text-xs resize-none"
                            ></textarea>
                        </div>

                        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                            <Link href="/petitions" className="px-5 py-2 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition cursor-pointer">
                                {t('btn_cancel', 'Cancel')}
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2 disabled:bg-indigo-400 cursor-pointer shadow-md shadow-indigo-100"
                            >
                                {isSubmitting ? (
                                    <span className="animate-pulse">{t('submitting', 'Submitting...')}</span>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" /> {t('btn_submit_community_petition', 'Submit Petition')}
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
