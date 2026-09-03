'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'Admin' | 'Corporate' | 'NGO' | 'Citizen'>('Corporate');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(email, password, role);
        router.push('/');
    };

    return (
        <div className="flex h-screen items-center justify-center bg-slate-50 w-full absolute inset-0 z-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-4">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Sign in to FINX</h1>
                    <p className="text-sm text-slate-500 mt-2">Log in to manage your CSR funds and petitions</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                        <input
                            required
                            type="email"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                            placeholder="you@corporate.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            required
                            type="password"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Sign in as (Demo Role)</label>
                        <select
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-600"
                            value={role}
                            onChange={(e) => setRole(e.target.value as any)}
                        >
                            <option value="Admin">Platform Admin</option>
                            <option value="Corporate">Corporate Funder</option>
                            <option value="NGO">NGO Organization</option>
                            <option value="Citizen">Citizen / User</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                        Launch Prototype
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500">
                    Don't have an account? <Link href="/auth/signup" className="text-indigo-600 hover:underline font-medium">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
