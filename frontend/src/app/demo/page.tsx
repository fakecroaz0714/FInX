'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Coins, HardDrive, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

// Mock ABIs and Data since we are avoiding real ethers connections for the UI mockup if not provided wallet.
// A full implementation would use Wagmi / ethers.js here.

export default function DemoDashboard() {
    const { t } = useLanguage();
    const [projectId, setProjectId] = useState("PROJ-SCHOOL-001");
    const [status, setStatus] = useState("Created");
    const [txState, setTxState] = useState("");
    const [lockedFunds, setLockedFunds] = useState(0);
    const [releasedFunds, setReleasedFunds] = useState(0);
    const [currentMilestone, setCurrentMilestone] = useState(0);

    const mAmounts = [40000, 60000, 60000, 40000];
    const totalFunding = 200000;

    const simulateTx = (actionName: string, stateSetter: () => void) => {
        setTxState(`Pending: ${actionName}...`);
        setTimeout(() => {
            stateSetter();
            setTxState(`Confirmed: ${actionName} successful!`);
            setTimeout(() => setTxState(""), 3000);
        }, 1500);
    };

    const handleFund = () => {
        simulateTx("Funding Project", () => {
            setStatus("Funded");
            setLockedFunds(totalFunding);
        });
    };

    const handleSubmit = () => {
        simulateTx("Submitting Proof", () => {
            setStatus("Active (Proof Submitted)");
        });
    };

    const handleApprove = () => {
        simulateTx("Approving Milestone", () => {
            setStatus("Active (Approved)");
        });
    };

    const handleWithdraw = () => {
        simulateTx("Withdrawing Funds", () => {
            const amount = mAmounts[currentMilestone];
            setLockedFunds(prev => prev - amount);
            setReleasedFunds(prev => prev + amount);
            setCurrentMilestone(prev => prev + 1);
            setStatus("Active");
        });
    };

    const handleCancel = () => {
        simulateTx("Cancelling Project & Refunding", () => {
            setStatus("Cancelled");
            setLockedFunds(0); // Refunded back to Funder
        });
    };

    return (
        <div className="p-8 pb-20 max-w-5xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('onchain_escrow_title', 'FINX Smart Escrow Dashboard')}</h1>
                <p className="text-slate-500 mt-1">{t('onchain_escrow_sub', 'Prototype Interface for FINXMilestoneEscrow.sol')}</p>
            </header>

            {txState && (
                <div className={`mb-6 p-4 rounded-lg font-mono text-sm shadow-sm flex items-center gap-3 ${txState.startsWith("Pending") ? "bg-amber-50 text-amber-700 border border-amber-200" :
                    txState.startsWith("Confirmed") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                    {txState.startsWith("Pending") ? <DatabaseLoader /> : <CheckCircle2 className="w-5 h-5" />}
                    {txState}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="border-indigo-100 bg-indigo-50/30">
                    <CardContent className="p-5">
                        <div className="text-sm font-medium text-slate-500">{t('kpi_total_funding', 'Total Funding')}</div>
                        <div className="text-2xl font-bold font-mono text-slate-900">₹{totalFunding.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className={status === 'Cancelled' ? 'opacity-50' : ''}>
                    <CardContent className="p-5">
                        <div className="text-sm font-medium text-slate-500">{t('kpi_locked_escrow', 'Locked in Escrow')}</div>
                        <div className="text-2xl font-bold font-mono text-indigo-600">₹{lockedFunds.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-5">
                        <div className="text-sm font-medium text-slate-500">{t('kpi_released_funds', 'Released Funds')}</div>
                        <div className="text-2xl font-bold font-mono text-emerald-600">₹{releasedFunds.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-5">
                        <div className="text-sm font-medium text-slate-500">{t('kpi_current_milestone', 'Milestone')}</div>
                        <div className="text-2xl font-bold text-slate-900">{status === 'Cancelled' ? 'Halted' : `${currentMilestone + 1} / 4`}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50">
                            <div className="flex justify-between">
                                <div>
                                    <CardTitle className="text-lg">Project Details</CardTitle>
                                    <CardDescription className="text-slate-500 font-mono text-xs mt-1">ID: {projectId}</CardDescription>
                                </div>
                                <Badge variant={status.includes("Active") ? "success" : status === "Cancelled" ? "danger" : "warning"}>{status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4 text-sm">
                            <div className="flex justify-between border-b border-slate-100 pb-3">
                                <span className="text-slate-500">Corporate Funder</span>
                                <span className="font-mono text-slate-900">0xCorporate...A1G2</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 pb-3">
                                <span className="text-slate-500">NGO Beneficiary</span>
                                <span className="font-mono text-slate-900">0xNGO...42FD</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Escrow Contract</span>
                                <span className="font-mono text-indigo-600">0xSmartContract...339A</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={`border border-slate-200 shadow-sm ${status === 'Cancelled' ? 'opacity-50 grayscale' : ''}`}>
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg">Milestones Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {mAmounts.map((amt, idx) => {
                                    const isPast = idx < currentMilestone;
                                    const isCurrent = idx === currentMilestone;
                                    return (
                                        <div key={idx} className={`p-4 flex justify-between items-center ${isCurrent && status !== 'Cancelled' ? 'bg-indigo-50/50' : ''} ${isPast ? 'opacity-60' : ''}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isPast ? 'bg-emerald-100 text-emerald-700' : isCurrent && status !== 'Cancelled' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    M{idx + 1}
                                                </div>
                                                <span className="font-semibold text-slate-800">
                                                    {idx === 0 ? "Hardware Sourcing" : idx === 1 ? "Computer Delivery" : idx === 2 ? "Lab Setup" : "Final Training"}
                                                </span>
                                            </div>
                                            <div className="text-right flex items-center gap-4">
                                                <span className="font-mono font-medium text-slate-900">₹{amt.toLocaleString()}</span>
                                                <Badge variant={isPast ? "success" : status === 'Cancelled' ? "danger" : isCurrent ? "warning" : "neutral"} className="w-20 justify-center">
                                                    {isPast ? "Released" : status === 'Cancelled' ? "Refunded" : isCurrent ? status.includes("Submitted") ? "Pending" : status.includes("Approved") ? "Approved" : "Locked" : "Locked"}
                                                </Badge>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Simulate Actions</h3>

                    <button
                        onClick={handleFund}
                        disabled={status !== "Created"}
                        className="w-full justify-between items-center flex bg-slate-900 text-white px-4 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        1. {t('btn_fund_project', 'Corporate Funds Escrow')} <Coins className="w-4 h-4" />
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={status !== "Funded" && status !== "Active"}
                        className="w-full justify-between items-center flex bg-white border border-slate-300 text-slate-700 px-4 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        2. {t('btn_submit_proof_tx', 'NGO Submits Proof')} <HardDrive className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                        onClick={handleApprove}
                        disabled={!status.includes("Proof Submitted")}
                        className="w-full justify-between items-center flex bg-white border border-slate-300 text-slate-700 px-4 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        3. {t('btn_approve', 'Reviewer Approves')} <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </button>

                    <button
                        onClick={handleWithdraw}
                        disabled={!status.includes("Approved")}
                        className="w-full justify-between items-center flex bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        4. {t('btn_approve_withdraw', 'NGO Withdraws Funds')} <AlertCircle className="w-4 h-4" />
                    </button>

                    <hr className="my-4 border-slate-100" />

                    <button
                        onClick={handleCancel}
                        disabled={status === 'Cancelled' || status === 'Created' || status === 'Completed'}
                        className="w-full justify-center items-center flex text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-lg font-medium hover:bg-red-100 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        {t('btn_cancel_refund', 'Cancel Project (Refund)')}
                    </button>
                </div>
            </div>
        </div>
    );
}

function DatabaseLoader() {
    return <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>;
}
