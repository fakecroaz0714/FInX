'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'Admin' | 'Corporate' | 'NGO' | 'Citizen' | null;

interface AuthContextType {
    user: any | null;
    role: Role;
    login: (email: string, pass: string, selectedRole: Role) => void;
    signup: (email: string, pass: string, selectedRole: Role) => void;
    logout: () => void;
    changeRole: (newRole: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [role, setRole] = useState<Role>('Admin');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load mock state from localStorage with default fallbacks
        const savedUser = localStorage.getItem('finx_user');
        const savedRole = localStorage.getItem('finx_role') as Role;
        
        const initialRole = savedRole || 'Admin';
        const initialUser = savedUser ? JSON.parse(savedUser) : { name: `${initialRole} User`, email: `${initialRole.toLowerCase()}@finx.org` };

        setUser(initialUser);
        setRole(initialRole);
        localStorage.setItem('finx_user', JSON.stringify(initialUser));
        localStorage.setItem('finx_role', initialRole);
        
        setLoading(false);
    }, []);

    const saveState = (u: any, r: Role) => {
        const activeRole = r || 'Admin';
        const activeUser = u || { name: `${activeRole} User`, email: `${activeRole.toLowerCase()}@finx.org` };

        localStorage.setItem('finx_user', JSON.stringify(activeUser));
        localStorage.setItem('finx_role', activeRole);
        setUser(activeUser);
        setRole(activeRole);
    };

    const login = (email: string, pass: string, selectedRole: Role) => {
        const activeRole = selectedRole || 'Admin';
        saveState({ email, name: email.split('@')[0] }, activeRole);
    };

    const signup = (email: string, pass: string, selectedRole: Role) => {
        const activeRole = selectedRole || 'Admin';
        saveState({ email, name: email.split('@')[0] }, activeRole);
    };

    const logout = () => {
        saveState({ name: 'Admin User', email: 'admin@finx.org' }, 'Admin');
        window.location.href = '/auth/login';
    };

    const changeRole = (newRole: Role) => {
        const activeRole = newRole || 'Admin';
        const updatedUser = user ? { ...user, name: `${activeRole} User` } : { name: `${activeRole} User`, email: `${activeRole.toLowerCase()}@finx.org` };
        saveState(updatedUser, activeRole);
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
