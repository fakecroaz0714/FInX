'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ArrowLeft, Save, MapPin } from "lucide-react";
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function NewPetitionPage() {
    const { t } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API delay
        setTimeout(() => {
            setIsSubmitting(false);
            alert("Petition submitted successfully! It will now be reviewed by the community.");
        }, 1500);
    };

    return (
        <div className="p-8 pb-20 max-w-4xl mx-auto w-full">
            <header className="mb-8">
                <Link href="/petitions" className="text-indigo-600 text-sm font-semibold flex items-center gap-1 mb-4 hover:underline">
                    <ArrowLeft className="w-4 h-4" /> {t('back_to_petitions', 'Back to Petitions')}
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('start_new_petition', 'Start a New Petition')}</h1>
                <p className="text-slate-500 mt-1">{t('citizen_portal_sub', 'Mobilize support and get matched with an NGO and CSR funding.')}</p>
            </header>

            <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                    <CardTitle className="text-lg">{t('core_issue_details', 'Petition Details')}</CardTitle>
                    <CardDescription>{t('citizen_voice_need', 'Provide a clear description of the community need.')}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="space-y-2">
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700">{t('problem_title', 'Project Title')}</label>
                            <input
                                required
                                id="title"
                                type="text"
                                placeholder={t('problem_title_placeholder', 'e.g. Clean Water Filter for ZP School')}
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">{t('state_district', 'Location (City, State)')}</label>
                                <div className="relative">
                                    <MapPin className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Pune, Maharashtra"
                                        className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">{t('est_beneficiaries', 'Target Signatures')}</label>
                                <input
                                    required
                                    type="number"
                                    min="100"
                                    defaultValue="1000"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                                />
                                <p className="text-xs text-slate-500">Number of local signatures needed to trigger NGO review.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">{t('detailed_description', 'Detailed Description')}</label>
                            <textarea
                                required
                                rows={5}
                                placeholder={t('description_placeholder', 'Describe the issue, who it affects, and what the proposed solution might look like...')}
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                            ></textarea>
                        </div>

                        <div className="pt-4 flex justify-end gap-4 border-t border-slate-100">
                            <Link href="/petitions" className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:bg-indigo-400"
                            >
                                {isSubmitting ? (
                                    <span className="animate-pulse">Submitting...</span>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" /> {t('btn_submit_community_petition', 'Submit Petition')}
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
