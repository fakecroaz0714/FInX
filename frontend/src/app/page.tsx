'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, Role } from '@/lib/AuthContext';

export default function RootHomePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        // If unauthenticated, redirect immediately to login
        if (!user) {
            router.replace('/auth/login');
            return;
        }

        // If authenticated, route to the role-specific dashboard
        const roleDestinations: Record<Role, string> = {
            Corporate: '/corporate-dashboard',
            NGO: '/ngo-dashboard',
            Citizen: '/citizen-dashboard',
            Admin: '/matching'
        };

        const target = roleDestinations[user.role] || '/matching';
        router.replace(target);
    }, [user, loading, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full text-slate-500 select-none">
            <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-base font-bold text-slate-800">FINX Platform</span>
            <span className="text-xs text-slate-400 mt-0.5 font-medium">
                {user ? `Routing to ${user.role} Dashboard...` : 'Loading secure session...'}
            </span>
        </div>
    );
}
