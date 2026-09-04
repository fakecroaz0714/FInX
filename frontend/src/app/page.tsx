'use client';

import React, { Suspense } from 'react';
import { useAuth } from '@/lib/AuthContext';
import LoginForm from '@/components/LoginForm';

export default function RootHomePage() {
    const { user } = useAuth();

    // If authenticated, AuthGuard will route to the role-specific dashboard
    if (user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen w-full bg-slate-900 text-white select-none">
                <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-xl font-bold tracking-wider">FINX</span>
                <span className="text-slate-400 text-xs mt-1 font-medium">Routing to {user.role} Dashboard...</span>
            </div>
        );
    }

    // Unauthenticated user opens root route -> show the Login / Sign In page immediately
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen w-full bg-slate-900 text-white select-none">
                <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-xl font-bold tracking-wider">FINX</span>
                <span className="text-slate-400 text-xs mt-1 font-medium">Checking authentication...</span>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
