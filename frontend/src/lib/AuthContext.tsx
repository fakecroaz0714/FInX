'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'Admin' | 'Corporate' | 'NGO' | 'Citizen';

export interface CorporateProfile {
    companyName: string;
    registrationNumber?: string;
    corporateType?: string;
    industry?: string;
    website?: string;
    registeredOffice?: string;
    csrContactPerson?: string;
    csrContactEmail?: string;
    csrBudget: number | string;
    csrCategories: string[];
    preferredLocations?: string;
}

export interface NGOProfile {
    organizationName: string;
    registrationNumber: string;
    registrationType: string;
    registrationDate?: string;
    pan?: string;
    registration12A?: string;
    registration80G?: string;
    darpanId?: string;
    website?: string;
    address?: string;
    state?: string;
    district?: string;
    primaryFocusArea: string;
    areasOfOperation?: string;
    yearsOfExperience?: number | string;
    beneficiaryReach?: number | string;
    previousProjects?: string;
    documents?: Record<string, string>;
    verificationStatus?: 'Pending' | 'Verified' | 'Needs Review';
}

export interface CitizenProfile {
    fullName: string;
    mobile: string;
    state: string;
    district: string;
    cityVillage?: string;
    pincode?: string;
    dob?: string;
    preferredLanguage?: string;
}

export interface AdminProfile {
    fullName: string;
    mobile?: string;
    adminId: string;
    department?: string;
}

export type UserProfile = CorporateProfile | NGOProfile | CitizenProfile | AdminProfile | Record<string, any>;

export interface User {
    id: string;
    role: Role;
    email: string;
    name: string;
    mobile?: string;
    profile: UserProfile;
}

export interface SignupData {
    role: Role;
    email: string;
    name: string;
    mobile?: string;
    profile: UserProfile;
}

interface AuthContextType {
    user: User | null;
    role: Role;
    login: (email: string, pass: string, selectedRole: Role) => void;
    signup: (
        dataOrEmail: SignupData | string,
        pass?: string,
        selectedRole?: Role,
        name?: string,
        profile?: UserProfile
    ) => void;
    logout: () => void;
    changeRole: (newRole: Role) => void;
}

const defaultProfiles: Record<Role, { name: string; email: string; profile: UserProfile }> = {
    Admin: {
        name: 'Platform Admin',
        email: 'admin@finx.org',
        profile: {
            fullName: 'Platform Admin',
            adminId: 'ADMIN-FINX-001',
            department: 'CSR Governance & Verification',
        } as AdminProfile
    },
    Corporate: {
        name: 'TechCorp CSR Lead',
        email: 'csr@techcorp.in',
        profile: {
            companyName: 'TechCorp India Ltd',
            registrationNumber: 'L72200MH2005PLC154872',
            corporateType: 'Public Limited',
            industry: 'Technology & IT Services',
            website: 'https://techcorp.in',
            registeredOffice: 'Mumbai, Maharashtra',
            csrContactPerson: 'TechCorp CSR Lead',
            csrContactEmail: 'csr@techcorp.in',
            csrBudget: 50000000,
            csrCategories: ['Education', 'Environment', 'Sanitation'],
            preferredLocations: 'Maharashtra, Karnataka, Telangana'
        } as CorporateProfile
    },
    NGO: {
        name: 'Jal Seva Coordinator',
        email: 'contact@jalseva.org',
        profile: {
            organizationName: 'Jal Seva Foundation',
            registrationNumber: 'TR-2015-893',
            registrationType: 'Trust',
            registrationDate: '2015-08-14',
            pan: 'AAATJ9999K',
            registration12A: '12A-PUN-2016-778',
            registration80G: '80G-PUN-2016-992',
            darpanId: 'MH/2016/0109283',
            website: 'https://jalseva.org',
            address: '42 Village Road, Haveli',
            state: 'Maharashtra',
            district: 'Pune',
            primaryFocusArea: 'Sanitation',
            areasOfOperation: 'Rural Pune & Western Ghats',
            yearsOfExperience: 9,
            beneficiaryReach: 45000,
            previousProjects: 'Clean water borewells across 18 gram panchayats with CSR support.',
            verificationStatus: 'Verified',
            documents: {
                registrationCert: 'Registration_Deed_JalSeva.pdf',
                panCert: 'PAN_Card_AAATJ9999K.pdf',
                cert12A: '12A_Certification_Valid.pdf',
                cert80G: '80G_Tax_Exemption.pdf',
                govProof: 'Darpan_Portal_Affidavit.pdf'
            }
        } as NGOProfile
    },
    Citizen: {
        name: 'Ramesh Patil',
        email: 'ramesh.patil@gramin.in',
        profile: {
            fullName: 'Ramesh Patil',
            mobile: '9876543210',
            state: 'Maharashtra',
            district: 'Pune',
            cityVillage: 'Shirur Village',
            pincode: '412210',
            dob: '1988-06-15',
            preferredLanguage: 'mr'
        } as CitizenProfile
    }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<Role>('Admin');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load state from localStorage with robust default fallbacks
        try {
            const savedUserStr = localStorage.getItem('finx_user');
            const savedRole = (localStorage.getItem('finx_role') as Role) || 'Admin';
            
            let loadedUser: User;
            if (savedUserStr) {
                loadedUser = JSON.parse(savedUserStr);
                // Ensure profile structure exists
                if (!loadedUser.profile) {
                    loadedUser.profile = defaultProfiles[savedRole]?.profile || {};
                }
            } else {
                const defaults = defaultProfiles[savedRole] || defaultProfiles.Admin;
                loadedUser = {
                    id: `usr_${Date.now()}`,
                    role: savedRole,
                    name: defaults.name,
                    email: defaults.email,
                    profile: defaults.profile
                };
                localStorage.setItem('finx_user', JSON.stringify(loadedUser));
                localStorage.setItem('finx_role', savedRole);
            }

            setUser(loadedUser);
            setRole(savedRole);
        } catch (e) {
            console.error('Error loading auth state from localStorage:', e);
            const fallback = defaultProfiles.Admin;
            const fallbackUser: User = {
                id: 'usr_admin',
                role: 'Admin',
                name: fallback.name,
                email: fallback.email,
                profile: fallback.profile
            };
            setUser(fallbackUser);
            setRole('Admin');
        } finally {
            setLoading(false);
        }
    }, []);

    const saveState = (newUser: User, newRole: Role) => {
        const cleanRole = newRole || 'Admin';
        const cleanUser: User = {
            id: newUser.id || `usr_${Date.now()}`,
            role: cleanRole,
            name: newUser.name || `${cleanRole} User`,
            email: newUser.email || `${cleanRole.toLowerCase()}@finx.org`,
            mobile: newUser.mobile,
            profile: newUser.profile || defaultProfiles[cleanRole]?.profile || {}
        };

        try {
            localStorage.setItem('finx_user', JSON.stringify(cleanUser));
            localStorage.setItem('finx_role', cleanRole);

            // Maintain user store registry in localStorage without passwords
            const usersStoreStr = localStorage.getItem('finx_users_store');
            const usersStore: User[] = usersStoreStr ? JSON.parse(usersStoreStr) : [];
            const existingIdx = usersStore.findIndex(u => u.email.toLowerCase() === cleanUser.email.toLowerCase() && u.role === cleanRole);
            if (existingIdx >= 0) {
                usersStore[existingIdx] = cleanUser;
            } else {
                usersStore.push(cleanUser);
            }
            localStorage.setItem('finx_users_store', JSON.stringify(usersStore));
        } catch (e) {
            console.error('Failed to sync user state to localStorage:', e);
        }

        setUser(cleanUser);
        setRole(cleanRole);
    };

    const login = (email: string, _pass: string, selectedRole: Role) => {
        const activeRole = selectedRole || 'Admin';
        const trimmedEmail = email.trim();

        // Check if user exists in local registered store
        let existingUser: User | undefined;
        try {
            const usersStoreStr = localStorage.getItem('finx_users_store');
            if (usersStoreStr) {
                const store: User[] = JSON.parse(usersStoreStr);
                existingUser = store.find(u => u.email.toLowerCase() === trimmedEmail.toLowerCase() && u.role === activeRole);
            }
        } catch (e) {
            console.error('Error reading users store:', e);
        }

        if (existingUser) {
            saveState(existingUser, activeRole);
        } else {
            const defaults = defaultProfiles[activeRole] || defaultProfiles.Admin;
            const derivedName = trimmedEmail ? trimmedEmail.split('@')[0] : defaults.name;
            const newUser: User = {
                id: `usr_${Date.now()}`,
                role: activeRole,
                email: trimmedEmail || defaults.email,
                name: derivedName,
                profile: { ...defaults.profile }
            };
            saveState(newUser, activeRole);
        }
    };

    const signup = (
        dataOrEmail: SignupData | string,
        _pass?: string,
        selectedRole?: Role,
        name?: string,
        profile?: UserProfile
    ) => {
        if (typeof dataOrEmail === 'object' && dataOrEmail !== null) {
            const signupData = dataOrEmail as SignupData;
            const newUser: User = {
                id: `usr_${Date.now()}`,
                role: signupData.role,
                email: signupData.email.trim(),
                name: signupData.name.trim(),
                mobile: signupData.mobile?.trim(),
                profile: signupData.profile
            };
            saveState(newUser, signupData.role);
        } else {
            const email = (dataOrEmail as string).trim();
            const activeRole = selectedRole || 'Admin';
            const defaults = defaultProfiles[activeRole] || defaultProfiles.Admin;
            const displayName = name?.trim() || email.split('@')[0] || defaults.name;

            const newUser: User = {
                id: `usr_${Date.now()}`,
                role: activeRole,
                email: email || defaults.email,
                name: displayName,
                profile: profile || defaults.profile
            };
            saveState(newUser, activeRole);
        }
    };

    const logout = () => {
        const fallback = defaultProfiles.Admin;
        const resetAdmin: User = {
            id: 'usr_admin',
            role: 'Admin',
            name: fallback.name,
            email: fallback.email,
            profile: fallback.profile
        };
        try {
            localStorage.setItem('finx_user', JSON.stringify(resetAdmin));
            localStorage.setItem('finx_role', 'Admin');
        } catch (e) {
            console.error('Failed to reset on logout:', e);
        }
        setUser(resetAdmin);
        setRole('Admin');
        window.location.href = '/auth/login';
    };

    const changeRole = (newRole: Role) => {
        const activeRole = newRole || 'Admin';
        // Try finding registered user for that role in store
        let foundUser: User | undefined;
        try {
            const usersStoreStr = localStorage.getItem('finx_users_store');
            if (usersStoreStr) {
                const store: User[] = JSON.parse(usersStoreStr);
                foundUser = store.find(u => u.role === activeRole);
            }
        } catch (e) {
            console.error('Error searching role profile in store:', e);
        }

        if (foundUser) {
            saveState(foundUser, activeRole);
        } else {
            const defaults = defaultProfiles[activeRole] || defaultProfiles.Admin;
            const newUser: User = {
                id: `usr_${activeRole.toLowerCase()}_${Date.now()}`,
                role: activeRole,
                name: defaults.name,
                email: defaults.email,
                profile: defaults.profile
            };
            saveState(newUser, activeRole);
        }
    };

    if (loading) return null;

    return (
        <AuthContext.Provider value={{ user, role, login, signup, logout, changeRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
