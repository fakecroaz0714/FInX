'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Milestone = {
    title: string;
    percentage: number;
    amount: number;
    status: 'Pending' | 'Submitted' | 'Approved' | 'Released';
};

export type Proposal = {
    id: string;
    title: string;
    ngoName: string;
    ngoRegNum: string;
    category: string;
    location: string;
    problem: string;
    solution: string;
    beneficiaries: number;
    targetDate: string;
    totalFunding: number;
    milestones: Milestone[];
    status: 'Draft' | 'Submitted' | 'NGO Validated' | 'Approved' | 'Escrow Funded' | 'Active' | 'Completed' | 'Rejected';
    createdAt: string;
    funderId?: string;
    escrowId?: string;
};

type ProposalContextType = {
    proposals: Proposal[];
    addProposal: (p: Omit<Proposal, 'id' | 'createdAt' | 'status'>, isDraft: boolean) => void;
    updateStatus: (id: string, newStatus: Proposal['status']) => void;
    validateProposal: (id: string) => void;
    approveFunding: (id: string, funderName: string) => void;
    rejectProposal: (id: string) => void;
    releaseMilestone: (id: string, milestoneIndex: number) => void;
};

const ProposalContext = createContext<ProposalContextType | undefined>(undefined);

export const ProposalProvider = ({ children }: { children: React.ReactNode }) => {
    const [proposals, setProposals] = useState<Proposal[]>([]);

    // Load from local storage
    useEffect(() => {
        const stored = localStorage.getItem('finx_proposals');
        if (stored) {
            setProposals(JSON.parse(stored));
        } else {
            // Seed with one pending proposal so Validator has something? The prompt says "Do not use hardcoded mock data for newly created proposals. Save proposals..."
            // We'll just leave it empty so they create one.
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (proposals.length > 0) {
            localStorage.setItem('finx_proposals', JSON.stringify(proposals));
        }
    }, [proposals]);

    const addProposal = (data: Omit<Proposal, 'id' | 'createdAt' | 'status'>, isDraft: boolean) => {
        const newProposal: Proposal = {
            ...data,
            id: `PRJ-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            createdAt: new Date().toISOString(),
            status: isDraft ? 'Draft' : 'Submitted'
        };
        setProposals(prev => [newProposal, ...prev]);
    };

    const updateStatus = (id: string, newStatus: Proposal['status']) => {
        setProposals(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    };

    const validateProposal = (id: string) => {
        setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'NGO Validated' } : p));
    };

    const approveFunding = (id: string, funderName: string) => {
        setProposals(prev => prev.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    status: 'Escrow Funded',
                    funderId: funderName,
                    escrowId: `0xESC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
                };
            }
            return p;
        }));
    };

    const rejectProposal = (id: string) => {
        setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'Rejected' } : p));
    };

    const releaseMilestone = (id: string, milestoneIndex: number) => {
        setProposals(prev => prev.map(p => {
            if (p.id === id) {
                const updatedMilestones = [...p.milestones];
                updatedMilestones[milestoneIndex].status = 'Released';

                const allReleased = updatedMilestones.every(m => m.status === 'Released');
                return {
                    ...p,
                    milestones: updatedMilestones,
                    status: allReleased ? 'Completed' : 'Active'
                };
            }
            return p;
        }));
    };

    return (
        <ProposalContext.Provider value={{ proposals, addProposal, updateStatus, validateProposal, approveFunding, rejectProposal, releaseMilestone }}>
            {children}
        </ProposalContext.Provider>
    );
};

export const useProposals = () => {
    const context = useContext(ProposalContext);
    if (!context) throw new Error("useProposals must be used within ProposalProvider");
    return context;
};
