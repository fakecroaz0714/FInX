'use client';

import React, { useState } from 'react';
import { useAuth, Role } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    ShieldCheck,
    Building2,
    HeartHandshake,
    Users,
    Shield,
    ArrowRight,
    AlertCircle,
    Loader2
} from 'lucide-react';

interface LoginFormProps {
    defaultRole?: Role;
    redirectOnSuccess?: boolean;
}

export default function LoginForm({ defaultRole, redirectOnSuccess = true }: LoginFormProps) {
    const { login } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();

    const paramRole = (searchParams?.get('role') as Role) || defaultRole;
    const initialRole: Role = (paramRole && ['Admin', 'Corporate', 'NGO', 'Citizen'].includes(paramRole))
        ? paramRole
        : 'Corporate';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role>(initialRole);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

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

        setSubmitting(true);

        try {
            // Strictly authenticate only on form submission
            login(email.trim(), password, role);

            if (redirectOnSuccess) {
                // Role-Specific Destination Routing
                const roleDestinations: Record<Role, string> = {
                    Corporate: '/corporate-dashboard',
                    NGO: '/ngo-dashboard',
                    Citizen: '/citizen-dashboard',
                    Admin: '/validator'
                };

                const target = roleDestinations[role] || '/validator';
                router.replace(target);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred while signing in. Please try again.');
            setSubmitting(false);
        }
    };

    const roleIcons: Record<Role, React.ReactNode> = {
        Corporate: <Building2 className="w-5 h-5 text-indigo-600" />,
        NGO: <HeartHandshake className="w-5 h-5 text-emerald-600" />,
        Citizen: <Users className="w-5 h-5 text-amber-600" />,
        Admin: <Shield className="w-5 h-5 text-indigo-600" />
    };

    const roleLabels: Record<Role, string> = {
        Corporate: 'Corporate CSR Funder',
        NGO: 'NGO Partner / Inspector',
        Citizen: 'Citizen / Village User',
        Admin: 'Admin / Reviewer'
    };

    const roleRedirectHints: Record<Role, string> = {
        Corporate: 'Corporate Dashboard (/corporate-dashboard)',
        NGO: 'NGO Dashboard (/ngo-dashboard)',
        Citizen: 'Citizen Dashboard (/citizen-dashboard)',
        Admin: 'Admin Dashboard (/validator)'
    };

    const defaultDemoEmails: Record<Role, string> = {
        Corporate: 'csr@techcorp.in',
        NGO: 'contact@jalseva.org',
        Citizen: 'ramesh.patil@gramin.in',
        Admin: 'admin@finx.org'
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900/95 py-12 px-4 w-full select-none">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl border border-slate-100/20 backdrop-blur-sm">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-indigo-600 to-indigo-700 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-50">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        {t('sign_in_to_finx', 'Sign in to FINX')}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1.5 font-medium leading-relaxed">
                        {t('sign_in_sub', "India's Milestone-Verified CSR & Public Impact Infrastructure")}
                    </p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-rose-700">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Role Selector (Selection alone does NOT authenticate) */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            {t('sign_in_as', 'Select Role')}
                        </label>
                        <div className="relative">
                            <select
                                id="finx-role-selector"
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none cursor-pointer shadow-xs"
                                value={role}
                                onChange={(e) => {
                                    const nextRole = e.target.value as Role;
                                    setRole(nextRole);
                                    if (!email || Object.values(defaultDemoEmails).includes(email)) {
                                        setEmail(defaultDemoEmails[nextRole] || '');
                                    }
                                }}
                            >
                                <option value="Corporate">🏢 Corporate CSR Funder</option>
                                <option value="NGO">🌱 NGO Partner / Inspector</option>
                                <option value="Citizen">🏘️ Citizen / Village User</option>
                                <option value="Admin">🛡️ Admin / Reviewer</option>
                            </select>
                            <div className="absolute left-3 top-2.5 pointer-events-none">
                                {roleIcons[role]}
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                            Target Dashboard: <span className="text-indigo-600 font-semibold">{roleRedirectHints[role]}</span>
                        </p>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            {role === 'Corporate' ? 'Work Email' : role === 'Admin' ? 'Admin Official Email' : role === 'NGO' ? 'Official NGO Email' : t('email_address', 'Email address')}
                        </label>
                        <input
                            required
                            type="email"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none text-slate-800 placeholder-slate-400"
                            placeholder={defaultDemoEmails[role]}
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
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none text-slate-800 placeholder-slate-400"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Submit Button (Authentication only triggers here) */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer mt-2 active:scale-[0.99]"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>{t('signing_in', 'Signing in...')}</span>
                            </>
                        ) : (
                            <>
                                <span>{t('sign_in_button', 'Sign In as')} {roleLabels[role]}</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="pt-3 text-center text-xs text-slate-500 border-t border-slate-100">
                    {t('dont_have_account', "Don't have a FINX account?")}{' '}
                    <Link
                        href={`/auth/signup?role=${role}`}
                        className="text-indigo-600 hover:text-indigo-700 hover:underline font-bold"
                    >
                        Register as {roleLabels[role]}
                    </Link>
                </div>
            </div>
        </div>
    );
}
