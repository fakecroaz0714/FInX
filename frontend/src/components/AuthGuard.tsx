'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, Role } from '@/lib/AuthContext';
import Sidebar from '@/components/Sidebar';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    // Check if the current route is a public authentication route
    const isAuthRoute = (path: string): boolean => {
        return path === '/' || path === '/login' || path.startsWith('/login/') || path.startsWith('/auth');
    };

    const authPath = isAuthRoute(pathname);

    // Role to home dashboard mapping
    const getRoleDashboard = (userRole: Role): string => {
        switch (userRole) {
            case 'Corporate': return '/corporate-dashboard';
            case 'NGO': return '/ngo-dashboard';
            case 'Citizen': return '/citizen-dashboard';
            case 'Admin': return '/validator';
            default: return '/validator';
        }
    };

    useEffect(() => {
        if (loading) return;

        // 1. Not logged in and attempting to access a protected internal route -> redirect to login
        if (!user && !authPath) {
            router.replace('/login');
            return;
        }

        // 2. Authenticated user visiting an auth route (including '/', '/login', '/auth/login')
        // -> Route immediately to that user's specific role dashboard
        if (user && authPath) {
            const dest = getRoleDashboard(user.role);
            router.replace(dest);
            return;
        }

        // 3. Role-based access control for specialized portals
        if (user) {
            // Citizen trying to access Corporate, Admin validator, or NGO portals
            if (user.role === 'Citizen' && (pathname.startsWith('/corporate') || pathname.startsWith('/validator') || pathname.startsWith('/ngo-dashboard'))) {
                router.replace('/citizen-dashboard');
                return;
            }
            // Corporate trying to access Admin validator, NGO, or Citizen dashboards
            if (user.role === 'Corporate' && (pathname.startsWith('/validator') || pathname.startsWith('/ngo-dashboard') || pathname.startsWith('/citizen-dashboard'))) {
                router.replace('/corporate-dashboard');
                return;
            }
            // NGO trying to access Corporate, Admin validator, or Citizen dashboards
            if (user.role === 'NGO' && (pathname.startsWith('/corporate') || pathname.startsWith('/validator') || pathname.startsWith('/citizen-dashboard'))) {
                router.replace('/ngo-dashboard');
                return;
            }
            // Admin trying to access role-specific client dashboards
            if (user.role === 'Admin' && (pathname.startsWith('/corporate-dashboard') || pathname.startsWith('/ngo-dashboard') || pathname.startsWith('/citizen-dashboard'))) {
                router.replace('/validator');
                return;
            }
        }
    }, [user, loading, pathname, authPath, router]);

    // 1. While checking authentication status: DO NOT render any dashboard or protected UI.
    // On protected routes, display the exact requested simple loading state to guarantee ZERO dashboard flash.
    if (loading) {
        if (authPath && !user) {
            return <main className="w-full min-h-screen">{children}</main>;
        }
        return (
            <div className="flex flex-col items-center justify-center min-h-screen w-full bg-slate-900 text-white select-none">
                <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-xl font-bold tracking-wider">FINX</span>
                <span className="text-slate-400 text-xs mt-1 font-medium">Checking authentication...</span>
            </div>
        );
    }

    // 2. If unauthenticated user is on an auth route ('/', '/login', '/auth/login', etc.):
    // Render the login/signup interface directly with full screen layout (no sidebar)
    if (!user && authPath) {
        return <main className="w-full min-h-screen">{children}</main>;
    }

    // 3. If unauthenticated user attempts to view a protected route:
    // Display loading redirect screen while redirecting to /login
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen w-full bg-slate-900 text-white select-none">
                <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-xl font-bold tracking-wider">FINX</span>
                <span className="text-slate-400 text-xs mt-1 font-medium">Checking authentication... Redirecting to login</span>
            </div>
        );
    }

    // 4. If authenticated user is on an auth route ('/', '/login'):
    // Show transition screen while routing to role dashboard
    if (user && authPath) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen w-full bg-slate-900 text-white select-none">
                <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-xl font-bold tracking-wider">FINX</span>
                <span className="text-slate-400 text-xs mt-1 font-medium">Routing to {user.role} Dashboard...</span>
            </div>
        );
    }

    // 5. Authenticated user on a protected internal route:
    // Render the complete dashboard layout with sidebar navigation
    return (
        <div className="flex h-screen overflow-hidden w-full bg-slate-50 text-slate-900">
            <Sidebar />
            <main className="flex-1 overflow-y-auto w-full">
                {children}
            </main>
        </div>
    );
}
