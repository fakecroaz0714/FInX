'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
    UploadCloud,
    CheckCircle2,
    AlertCircle,
    Trash2,
    RefreshCw,
    Calendar,
    FileCheck,
    Clock,
    ShieldAlert,
    Building2,
    Sparkles,
    Eye
} from 'lucide-react';
import { validateImageFile, compressImage, formatFileSize } from '@/lib/imageUtils';
import { useProposals } from '@/lib/ProposalContext';
import { useLanguage } from '@/lib/LanguageContext';

export interface ImageMeta {
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadedAt: string;
}

export type EvidenceStatus =
    | 'Evidence Pending'
    | 'After Evidence Pending'
    | 'Evidence Submitted'
    | 'Pending Verification';

export interface ImpactEvidenceData {
    projectId: string;
    projectName: string;
    beforeDate: string;
    afterDate: string;
    beforeImage: string | null;
    beforeMeta: ImageMeta | null;
    afterImage: string | null;
    afterMeta: ImageMeta | null;
    status: EvidenceStatus;
    submittedAt?: string;
}

const DEFAULT_PROJECT_ID = 'PRJ-SCH-REBUILD-01';
const DEFAULT_PROJECT_NAME = 'School Rebuilding & Solar Infrastructure';

export default function ImpactEvidenceUploader() {
    const { proposals } = useProposals();
    const { t } = useLanguage();

    // Available projects for evidence association
    const availableProjects = [
        { id: DEFAULT_PROJECT_ID, title: DEFAULT_PROJECT_NAME },
        ...proposals.map(p => ({ id: p.id, title: p.title }))
    ];

    const [selectedProjectId, setSelectedProjectId] = useState<string>(DEFAULT_PROJECT_ID);

    // Form and evidence state
    const [evidence, setEvidence] = useState<ImpactEvidenceData>({
        projectId: DEFAULT_PROJECT_ID,
        projectName: DEFAULT_PROJECT_NAME,
        beforeDate: 'Aug 2023',
        afterDate: 'Jan 2024',
        beforeImage: null,
        beforeMeta: null,
        afterImage: null,
        afterMeta: null,
        status: 'Evidence Pending'
    });

    const [isEditingDates, setIsEditingDates] = useState(false);
    const [tempBeforeDate, setTempBeforeDate] = useState('Aug 2023');
    const [tempAfterDate, setTempAfterDate] = useState('Jan 2024');

    // UI and Drag/Drop states
    const [dragOverType, setDragOverType] = useState<'before' | 'after' | null>(null);
    const [isProcessing, setIsProcessing] = useState<'before' | 'after' | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Refs for accessible hidden file inputs
    const beforeInputRef = useRef<HTMLInputElement>(null);
    const afterInputRef = useRef<HTMLInputElement>(null);

    // Storage key dynamically tied to the active project
    const storageKey = `finx_impact_evidence_${selectedProjectId}`;

    // Load saved evidence from localStorage on project switch or mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved) as ImpactEvidenceData;
                setEvidence(parsed);
                setTempBeforeDate(parsed.beforeDate || 'Aug 2023');
                setTempAfterDate(parsed.afterDate || 'Jan 2024');
            } else {
                const currentProj = availableProjects.find(p => p.id === selectedProjectId);
                const freshRecord: ImpactEvidenceData = {
                    projectId: selectedProjectId,
                    projectName: currentProj?.title || DEFAULT_PROJECT_NAME,
                    beforeDate: 'Aug 2023',
                    afterDate: 'Jan 2024',
                    beforeImage: null,
                    beforeMeta: null,
                    afterImage: null,
                    afterMeta: null,
                    status: 'Evidence Pending'
                };
                setEvidence(freshRecord);
                setTempBeforeDate('Aug 2023');
                setTempAfterDate('Jan 2024');
            }
        } catch (e) {
            console.error('Failed to load impact evidence from localStorage:', e);
        }
    }, [selectedProjectId]);

    // Save evidence to localStorage whenever state changes
    const persistEvidence = (updated: ImpactEvidenceData) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(updated));
            // Also update a global pointer for convenient retrieval
            localStorage.setItem('finx_latest_impact_evidence', JSON.stringify(updated));
        } catch (e) {
            console.error('Storage quota exceeded or storage error:', e);
            setErrorMessage('Unable to persist photo data: Storage limit reached.');
        }
    };

    // Recalculate status based on current photos and prior submission
    const computeStatus = (
        hasBefore: boolean,
        hasAfter: boolean,
        priorStatus: EvidenceStatus
    ): EvidenceStatus => {
        if (!hasBefore && !hasAfter) return 'Evidence Pending';
        if (hasBefore && !hasAfter) return 'After Evidence Pending';
        if (!hasBefore && hasAfter) return 'Evidence Pending'; // Before photo is prerequisite for completion
        if (hasBefore && hasAfter) {
            return priorStatus === 'Pending Verification' ? 'Pending Verification' : 'Evidence Submitted';
        }
        return 'Evidence Pending';
    };

    // Handle File Selection and Compression
    const handleFileProcess = async (file: File, type: 'before' | 'after') => {
        setErrorMessage(null);
        setSuccessMessage(null);

        // 1. Validation check
        const validation = validateImageFile(file);
        if (!validation.valid) {
            setErrorMessage(validation.error || 'Invalid file.');
            return;
        }

        setIsProcessing(type);

        try {
            // 2. Compress and resize to max 1200px
            const compressed = await compressImage(file, 1200, 1200, 0.82);

            const meta: ImageMeta = {
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                uploadedAt: new Date().toISOString()
            };

            setEvidence(prev => {
                const updated: ImpactEvidenceData = {
                    ...prev,
                    [type === 'before' ? 'beforeImage' : 'afterImage']: compressed.dataUrl,
                    [type === 'before' ? 'beforeMeta' : 'afterMeta']: meta
                };

                const nextStatus = computeStatus(
                    Boolean(type === 'before' ? compressed.dataUrl : prev.beforeImage),
                    Boolean(type === 'after' ? compressed.dataUrl : prev.afterImage),
                    prev.status
                );
                updated.status = nextStatus;

                persistEvidence(updated);
                return updated;
            });

            setSuccessMessage(`${type === 'before' ? 'Before' : 'After'} photo (${file.name}) uploaded and compressed successfully.`);
        } catch (err: any) {
            console.error('Error processing image:', err);
            setErrorMessage('Failed to process and compress image. Please try again.');
        } finally {
            setIsProcessing(null);
        }
    };

    // Remove photo handler
    const handleRemove = (type: 'before' | 'after') => {
        setEvidence(prev => {
            const updated: ImpactEvidenceData = {
                ...prev,
                [type === 'before' ? 'beforeImage' : 'afterImage']: null,
                [type === 'before' ? 'beforeMeta' : 'afterMeta']: null
            };

            const nextStatus = computeStatus(
                Boolean(type === 'before' ? null : prev.beforeImage),
                Boolean(type === 'after' ? null : prev.afterImage),
                'Evidence Pending'
            );
            updated.status = nextStatus;

            persistEvidence(updated);
            return updated;
        });

        // Reset file input values
        if (type === 'before' && beforeInputRef.current) beforeInputRef.current.value = '';
        if (type === 'after' && afterInputRef.current) afterInputRef.current.value = '';

        setSuccessMessage(`${type === 'before' ? 'Before' : 'After'} photo removed.`);
    };

    // Submit Evidence for Verification
    const handleSubmitForVerification = () => {
        if (!evidence.beforeImage || !evidence.afterImage) {
            setErrorMessage('Both Before and After photos must be uploaded before submitting for verification.');
            return;
        }

        const updated: ImpactEvidenceData = {
            ...evidence,
            status: 'Pending Verification',
            submittedAt: new Date().toISOString()
        };

        setEvidence(updated);
        persistEvidence(updated);
        setSuccessMessage('Impact evidence submitted for independent validator and satellite verification. Escrow release will be authorized upon milestone sign-off.');
    };

    // Drag and Drop handlers
    const handleDragOver = (e: React.DragEvent, type: 'before' | 'after') => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverType(type);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverType(null);
    };

    const handleDrop = (e: React.DragEvent, type: 'before' | 'after') => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverType(null);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            handleFileProcess(file, type);
        }
    };

    // Save edited dates
    const handleSaveDates = (e: React.FormEvent) => {
        e.preventDefault();
        const updated: ImpactEvidenceData = {
            ...evidence,
            beforeDate: tempBeforeDate.trim() || 'Aug 2023',
            afterDate: tempAfterDate.trim() || 'Jan 2024'
        };
        setEvidence(updated);
        persistEvidence(updated);
        setIsEditingDates(false);
        setSuccessMessage('Evidence milestone dates updated.');
    };

    // Status Badge Component
    const renderStatusBadge = () => {
        switch (evidence.status) {
            case 'Pending Verification':
                return <Badge variant="warning" className="text-xs px-2.5 py-1 flex items-center gap-1 font-bold">
                    <Clock className="w-3.5 h-3.5" /> {t('status_pending_verification', 'Pending Verification')}
                </Badge>;
            case 'Evidence Submitted':
                return <Badge variant="default" className="text-xs px-2.5 py-1 flex items-center gap-1 font-bold bg-indigo-600 text-white">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {t('status_evidence_submitted', 'Evidence Submitted')}
                </Badge>;
            case 'After Evidence Pending':
                return <Badge variant="warning" className="text-xs px-2.5 py-1 flex items-center gap-1 font-bold">
                    <AlertCircle className="w-3.5 h-3.5" /> {t('status_after_pending', 'After Evidence Pending')}
                </Badge>;
            default:
                return <Badge variant="neutral" className="text-xs px-2.5 py-1 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {t('status_evidence_pending', 'Evidence Pending')}
                </Badge>;
        }
    };

    return (
        <Card className="border border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('impact_evidence_proofs', 'Impact Evidence Proofs')}</span>
                            {renderStatusBadge()}
                        </div>
                        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            {t('before_after_evidence', 'Before & After Evidence')} ({evidence.projectName})
                        </CardTitle>
                    </div>

                    {/* Project Selector */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="evidence-project-select" className="text-xs font-semibold text-slate-600 shrink-0">
                            {t('project_label', 'Project')}:
                        </label>
                        <select
                            id="evidence-project-select"
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="text-xs font-semibold p-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none"
                            aria-label="Select Project for Evidence"
                        >
                            {availableProjects.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
                {/* Notification Banners */}
                {errorMessage && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium flex items-center justify-between animate-in fade-in">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                        <button onClick={() => setErrorMessage(null)} className="text-rose-600 hover:text-rose-900 font-bold ml-2">✕</button>
                    </div>
                )}

                {successMessage && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center justify-between animate-in fade-in">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{successMessage}</span>
                        </div>
                        <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-900 font-bold ml-2">✕</button>
                    </div>
                )}

                {/* Date Controls */}
                <div className="flex items-center justify-between bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center gap-4 text-slate-600">
                        <span className="flex items-center gap-1.5 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            {t('timeline_label', 'Timeline')}: <span className="font-bold text-slate-900">{evidence.beforeDate}</span> → <span className="font-bold text-slate-900">{evidence.afterDate}</span>
                        </span>
                    </div>
                    {!isEditingDates ? (
                        <button
                            type="button"
                            onClick={() => setIsEditingDates(true)}
                            className="text-indigo-600 hover:text-indigo-800 font-bold text-xs underline"
                        >
                            {t('edit_dates', 'Edit Dates')}
                        </button>
                    ) : (
                        <form onSubmit={handleSaveDates} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={tempBeforeDate}
                                onChange={e => setTempBeforeDate(e.target.value)}
                                placeholder="Aug 2023"
                                className="w-24 px-2 py-1 border border-slate-200 rounded text-xs"
                                aria-label="Before Date"
                            />
                            <span>→</span>
                            <input
                                type="text"
                                value={tempAfterDate}
                                onChange={e => setTempAfterDate(e.target.value)}
                                placeholder="Jan 2024"
                                className="w-24 px-2 py-1 border border-slate-200 rounded text-xs"
                                aria-label="After Date"
                            />
                            <button type="submit" className="bg-indigo-600 text-white px-2 py-1 rounded text-xs font-bold">{t('save', 'Save')}</button>
                            <button type="button" onClick={() => setIsEditingDates(false)} className="text-slate-500 text-xs">{t('btn_cancel', 'Cancel')}</button>
                        </form>
                    )}
                </div>

                {/* 2-Column Photo Upload Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* =========================================================
                        BOX 1: BEFORE PHOTO UPLOAD / PREVIEW
                       ========================================================= */}
                    <div className="space-y-2">
                        {/* Hidden accessible file input */}
                        <input
                            ref={beforeInputRef}
                            id="finx-upload-before"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="sr-only"
                            aria-label="Upload Before Photo"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    handleFileProcess(e.target.files[0], 'before');
                                }
                            }}
                        />

                        {evidence.beforeImage ? (
                            /* Preview State with Controls */
                            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 relative group shadow-sm">
                                <div className="h-64 relative overflow-hidden bg-slate-100 flex items-center justify-center">
                                    <img
                                        src={evidence.beforeImage}
                                        alt="Before evidence: School Rebuilding"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <span className="absolute top-3 left-3 bg-slate-900/90 text-white text-xs font-bold px-3 py-1 rounded-md tracking-wider shadow-md">
                                        {t('before_label', 'BEFORE')}: {evidence.beforeDate}
                                    </span>
                                </div>

                                {/* Control Bar */}
                                <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
                                    <div className="truncate mr-2">
                                        <p className="font-bold text-slate-800 truncate" title={evidence.beforeMeta?.fileName}>
                                            {evidence.beforeMeta?.fileName || 'school_before.jpg'}
                                        </p>
                                        <p className="text-[11px] text-slate-500 font-mono">
                                            {evidence.beforeMeta?.fileSize ? formatFileSize(evidence.beforeMeta.fileSize) : 'Uploaded'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => beforeInputRef.current?.click()}
                                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                                            aria-label="Change Before Photo"
                                        >
                                            <RefreshCw className="w-3 h-3" /> {t('change_photo', 'Change Photo')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemove('before')}
                                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                                            aria-label="Remove Before Photo"
                                        >
                                            <Trash2 className="w-3 h-3" /> {t('remove_label', 'Remove')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Empty Upload Dropzone State */
                            <div
                                onDragOver={(e) => handleDragOver(e, 'before')}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, 'before')}
                                className={`border-2 border-dashed rounded-xl p-6 h-64 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative ${
                                    dragOverType === 'before'
                                        ? 'border-indigo-600 bg-indigo-50/70 scale-[1.01]'
                                        : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
                                }`}
                                onClick={() => beforeInputRef.current?.click()}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        beforeInputRef.current?.click();
                                    }
                                }}
                                aria-label="Upload Before Photo area. Click or drag an image here."
                            >
                                <span className="absolute top-3 left-3 bg-slate-800 text-white text-xs px-2.5 py-1 rounded font-bold">
                                    {t('before_label', 'BEFORE')}: {evidence.beforeDate}
                                </span>

                                <div className="p-3 bg-slate-200/80 rounded-full mb-3 text-slate-600 group-hover:text-indigo-600">
                                    <UploadCloud className="w-6 h-6" />
                                </div>

                                {isProcessing === 'before' ? (
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-indigo-600 flex items-center justify-center gap-1.5">
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {t('compressing_optimizing', 'Compressing & Optimizing...')}
                                        </div>
                                        <p className="text-[11px] text-slate-400">Preparing high-resolution proof</p>
                                    </div>
                                ) : dragOverType === 'before' ? (
                                    <p className="text-sm font-bold text-indigo-600">{t('drop_image_here', 'Drop image here')}</p>
                                ) : (
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-800">{t('upload_before_photo', 'Upload Before Photo')}</p>
                                        <p className="text-xs text-slate-500 font-medium">{t('drag_drop_click', 'Click to select image or drag & drop')}</p>
                                        <p className="text-[11px] text-slate-400 font-medium pt-1">JPG, PNG or WEBP • Max 10MB</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* =========================================================
                        BOX 2: AFTER PHOTO UPLOAD / PREVIEW
                       ========================================================= */}
                    <div className="space-y-2">
                        {/* Hidden accessible file input */}
                        <input
                            ref={afterInputRef}
                            id="finx-upload-after"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="sr-only"
                            aria-label="Upload After Photo"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    handleFileProcess(e.target.files[0], 'after');
                                }
                            }}
                        />

                        {evidence.afterImage ? (
                            /* Preview State with Controls */
                            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 relative group shadow-sm">
                                <div className="h-64 relative overflow-hidden bg-slate-100 flex items-center justify-center">
                                    <img
                                        src={evidence.afterImage}
                                        alt="After evidence: Renovated Classrooms"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-md tracking-wider shadow-md">
                                        {t('after_label', 'AFTER')}: {evidence.afterDate}
                                    </span>
                                </div>

                                {/* Control Bar */}
                                <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
                                    <div className="truncate mr-2">
                                        <p className="font-bold text-slate-800 truncate" title={evidence.afterMeta?.fileName}>
                                            {evidence.afterMeta?.fileName || 'school_after.jpg'}
                                        </p>
                                        <p className="text-[11px] text-slate-500 font-mono">
                                            {evidence.afterMeta?.fileSize ? formatFileSize(evidence.afterMeta.fileSize) : 'Uploaded'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => afterInputRef.current?.click()}
                                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                                            aria-label="Change After Photo"
                                        >
                                            <RefreshCw className="w-3 h-3" /> {t('change_photo', 'Change Photo')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemove('after')}
                                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                                            aria-label="Remove After Photo"
                                        >
                                            <Trash2 className="w-3 h-3" /> {t('remove_label', 'Remove')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Empty Upload Dropzone State */
                            <div
                                onDragOver={(e) => handleDragOver(e, 'after')}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, 'after')}
                                className={`border-2 border-dashed rounded-xl p-6 h-64 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative ${
                                    dragOverType === 'after'
                                        ? 'border-indigo-600 bg-indigo-50/70 scale-[1.01]'
                                        : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
                                }`}
                                onClick={() => afterInputRef.current?.click()}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        afterInputRef.current?.click();
                                    }
                                }}
                                aria-label="Upload After Photo area. Click or drag an image here."
                            >
                                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs px-2.5 py-1 rounded font-bold">
                                    {t('after_label', 'AFTER')}: {evidence.afterDate}
                                </span>

                                <div className="p-3 bg-slate-200/80 rounded-full mb-3 text-slate-600 group-hover:text-indigo-600">
                                    <UploadCloud className="w-6 h-6" />
                                </div>

                                {isProcessing === 'after' ? (
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-indigo-600 flex items-center justify-center gap-1.5">
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {t('compressing_optimizing', 'Compressing & Optimizing...')}
                                        </div>
                                        <p className="text-[11px] text-slate-400">Preparing high-resolution proof</p>
                                    </div>
                                ) : dragOverType === 'after' ? (
                                    <p className="text-sm font-bold text-indigo-600">{t('drop_image_here', 'Drop image here')}</p>
                                ) : (
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-800">{t('upload_after_photo', 'Upload After Photo')}</p>
                                        <p className="text-xs text-slate-500 font-medium">{t('drag_drop_click', 'Click to select image or drag & drop')}</p>
                                        <p className="text-[11px] text-slate-400 font-medium pt-1">JPG, PNG or WEBP • Max 10MB</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* =========================================================
                    CORPORATE IMPACT REPORT: VERIFICATION WORKFLOW & STATUS
                   ========================================================= */}
                <div className="pt-4 border-t border-slate-100">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('verification_checklist', 'Verification Checklist')}:</span>
                                <span className="text-xs text-slate-500">
                                    {t('status_label', 'Status')}: <strong className="text-slate-900">{evidence.status}</strong>
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-4 text-xs font-medium">
                                <span className={`flex items-center gap-1.5 ${evidence.beforeImage ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                                    <CheckCircle2 className={`w-4 h-4 ${evidence.beforeImage ? 'text-emerald-600' : 'text-slate-300'}`} />
                                    {t('before_label', 'BEFORE')} {t('evidence_label', 'Photo')} {evidence.beforeImage ? `(${evidence.beforeMeta?.fileName || 'uploaded'})` : 'pending'}
                                </span>
                                <span className={`flex items-center gap-1.5 ${evidence.afterImage ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                                    <CheckCircle2 className={`w-4 h-4 ${evidence.afterImage ? 'text-emerald-600' : 'text-slate-300'}`} />
                                    {t('after_label', 'AFTER')} {t('evidence_label', 'Photo')} {evidence.afterImage ? `(${evidence.afterMeta?.fileName || 'uploaded'})` : 'pending'}
                                </span>
                            </div>
                        </div>

                        {/* Submission Button */}
                        <div>
                            {evidence.status === 'Pending Verification' ? (
                                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-xl text-xs font-bold">
                                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                                    <span>{t('pending_verification_badge', 'Pending Independent Verification')}</span>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmitForVerification}
                                    disabled={!evidence.beforeImage || !evidence.afterImage}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
                                        evidence.beforeImage && evidence.afterImage
                                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 cursor-pointer'
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    <FileCheck className="w-4 h-4" /> {t('submit_evidence_btn', 'Submit Evidence for Verification')}
                                </button>
                            )}
                        </div>
                    </div>

                    {evidence.status === 'Pending Verification' && (
                        <div className="mt-3 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-start gap-2.5 text-xs text-indigo-900">
                            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold">{t('evidence_audit_in_progress', 'Evidence submitted for Independent Validator Audit')}</p>
                                <p className="text-slate-600 text-[11px] mt-0.5">
                                    {t('evidence_audit_desc', 'Field officers and automated GPS geo-hash checks are inspecting the uploaded physical evidence. Escrow funds will remain locked until validator sign-off.')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
