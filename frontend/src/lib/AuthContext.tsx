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
    const [role, setRole] = useState<Role>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load mock state from localStorage
        const savedUser = localStorage.getItem('finx_user');
        const savedRole = localStorage.getItem('finx_role') as Role;
        if (savedUser && savedRole) {
            setUser(JSON.parse(savedUser));
            setRole(savedRole);
        }
        setLoading(false);
    }, []);

    const saveState = (u: any, r: Role) => {
        if (u && r) {
            localStorage.setItem('finx_user', JSON.stringify(u));
            localStorage.setItem('finx_role', r);
            setUser(u);
            setRole(r);
        } else {
            localStorage.removeItem('finx_user');
            localStorage.removeItem('finx_role');
            setUser(null);
            setRole(null);
        }
    };

    const login = (email: string, pass: string, selectedRole: Role) => {
        // Mock Login
        saveState({ email, name: email.split('@')[0] }, selectedRole);
    };

    const signup = (email: string, pass: string, selectedRole: Role) => {
        // Mock Signup
        saveState({ email, name: email.split('@')[0] }, selectedRole);
    };

    const logout = () => {
        saveState(null, null);
        window.location.href = '/auth/login';
    };

    const changeRole = (newRole: Role) => {
        if (user) {
            saveState(user, newRole);
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
