'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, Role } from '@/lib/AuthContext';
import Sidebar from '@/components/Sidebar';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, role, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const isAuthRoute = pathname.startsWith('/auth');

    // Role to home dashboard mapping
    const getRoleDashboard = (userRole: Role): string => {
        switch (userRole) {
            case 'Corporate': return '/corporate-dashboard';
            case 'NGO': return '/ngo-dashboard';
            case 'Citizen': return '/citizen-dashboard';
            case 'Admin': return '/matching';
            default: return '/matching';
        }
    };

    useEffect(() => {
        if (loading) return;

        // 1. Not logged in and attempting to access a protected route
        if (!user && !isAuthRoute) {
            router.replace('/auth/login');
            return;
        }

        // 2. Logged in and accessing the root route "/" -> redirect to role dashboard
        if (user && pathname === '/') {
            const dest = getRoleDashboard(user.role);
            router.replace(dest);
            return;
        }

        // 3. Role-based access control for specialized portals
        if (user) {
            // Citizen trying to access Corporate or Admin validator portals
            if (user.role === 'Citizen' && (pathname.startsWith('/corporate') || pathname.startsWith('/validator'))) {
                router.replace('/citizen-dashboard');
                return;
            }
            // Corporate trying to access Admin validator portal
            if (user.role === 'Corporate' && pathname.startsWith('/validator')) {
                router.replace('/corporate-dashboard');
                return;
            }
            // NGO trying to access Corporate dashboard
            if (user.role === 'NGO' && pathname.startsWith('/corporate-dashboard')) {
                router.replace('/ngo-dashboard');
                return;
            }
        }
    }, [user, loading, pathname, isAuthRoute, router]);

    // Public routes (e.g. /auth/login, /auth/signup) render immediately
    if (isAuthRoute) {
        return <main className="w-full min-h-screen">{children}</main>;
    }

    // Loading screen while session is being evaluated from storage
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-full bg-slate-900 text-white select-none">
                <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-xl font-bold tracking-wider">FINX</span>
                <span className="text-slate-400 text-xs mt-1 font-medium">Loading secure session...</span>
            </div>
        );
    }

    // If unauthenticated on a protected route, show loading screen while redirecting to /auth/login
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-full bg-slate-900 text-white select-none">
                <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-xl font-bold tracking-wider">FINX</span>
                <span className="text-slate-400 text-xs mt-1 font-medium">Redirecting to login...</span>
            </div>
        );
    }

    // If on root route, show brief transition while redirecting to role dashboard
    if (pathname === '/') {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-full bg-slate-900 text-white select-none">
                <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-xl font-bold tracking-wider">FINX</span>
                <span className="text-slate-400 text-xs mt-1 font-medium">Routing to {user.role} Dashboard...</span>
            </div>
        );
    }

    // Authenticated user on a valid protected route
    return (
        <div className="flex h-screen overflow-hidden w-full bg-slate-50 text-slate-900">
            <Sidebar />
            <main className="flex-1 overflow-y-auto w-full">
                {children}
            </main>
        </div>
    );
}
