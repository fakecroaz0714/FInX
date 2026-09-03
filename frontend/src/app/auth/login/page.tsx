'use client';

import React, { useState, Suspense } from 'react';
import { useAuth, Role } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Building2, HeartHandshake, Users, Shield, ArrowRight, AlertCircle } from 'lucide-react';

function LoginContent() {
    const { login } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();

    const paramRole = searchParams.get('role') as Role;
    const initialRole: Role = (paramRole && ['Admin', 'Corporate', 'NGO', 'Citizen'].includes(paramRole))
        ? paramRole
        : 'Corporate';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role>(initialRole);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }

        if (!password) {
            setError('Please enter your password.');
            return;
        }

        setLoading(true);

        try {
            login(email.trim(), password, role);

            // Role-Specific Destination Routing
            if (role === 'Corporate') {
                router.push('/corporate-dashboard');
            } else if (role === 'NGO') {
                router.push('/ngo-dashboard');
            } else if (role === 'Citizen') {
                router.push('/citizen-dashboard');
            } else if (role === 'Admin') {
                router.push('/matching');
            } else {
                router.push('/');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred while signing in. Please try again.');
            setLoading(false);
        }
    };

    const roleIcons: Record<Role, React.ReactNode> = {
        Corporate: <Building2 className="w-5 h-5 text-indigo-600" />,
        NGO: <HeartHandshake className="w-5 h-5 text-indigo-600" />,
        Citizen: <Users className="w-5 h-5 text-indigo-600" />,
        Admin: <Shield className="w-5 h-5 text-indigo-600" />
    };

    const roleRedirectHints: Record<Role, string> = {
        Corporate: 'Corporate CSR Dashboard (/corporate-dashboard)',
        NGO: 'NGO Verification & Project Portal (/ngo-dashboard)',
        Citizen: 'Citizen Impact Portal (/citizen-dashboard)',
        Admin: 'Platform Admin Matching Engine (/matching)'
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 w-full">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-md shadow-indigo-200">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('sign_in_to_finx', 'Sign in to FINX')}</h1>
                    <p className="text-xs text-slate-500 mt-1.5">
                        {t('sign_in_sub', "Access India's Milestone-Verified CSR & Public Impact Infrastructure")}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-red-700">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Role Selector */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            {t('sign_in_as', 'Sign in as (Role)')}
                        </label>
                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none cursor-pointer"
                                value={role}
                                onChange={(e) => setRole(e.target.value as Role)}
                            >
                                <option value="Corporate">🏢 Corporate Funder</option>
                                <option value="NGO">🌿 NGO Organization</option>
                                <option value="Citizen">🏘️ Citizen / User</option>
                                <option value="Admin">🛡️ Platform Admin</option>
                            </select>
                            <div className="absolute left-3 top-2.5 pointer-events-none">
                                {roleIcons[role]}
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 font-medium">
                            Destination: <span className="text-indigo-600 font-semibold">{roleRedirectHints[role]}</span>
                        </p>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            {role === 'Corporate' ? 'Work Email' : role === 'Admin' ? 'Admin Email' : role === 'NGO' ? 'Official NGO Email' : t('email_address', 'Email address')}
                        </label>
                        <input
                            required
                            type="email"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                            placeholder={role === 'Corporate' ? 'csr@company.com' : role === 'Admin' ? 'admin@finx.org' : role === 'NGO' ? 'contact@ngo.org' : 'citizen@village.in'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-semibold text-slate-700">{t('password', 'Password')}</label>
                            <span className="text-[11px] text-slate-400">Demo password accepted</span>
                        </div>
                        <input
                            required
                            type="password"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold text-sm transition-colors shadow-md shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                        {loading ? (
                            <span>{t('signing_in', 'Signing in...')}</span>
                        ) : (
                            <>
                                <span>{t('sign_in_button', 'Sign In')} ({role === 'NGO' ? 'NGO' : role})</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
                    {t('dont_have_account', "Don't have a FINX account?")}{' '}
                    <Link
                        href={`/auth/signup?role=${role}`}
                        className="text-indigo-600 hover:underline font-bold"
                    >
                        Register as {role === 'NGO' ? 'NGO' : role}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">Loading login...</div>}>
            <LoginContent />
        </Suspense>
    );
}
