'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Building2,
    Briefcase,
    FileCheck2,
    MapPin,
    ShieldCheck,
    BarChart4
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Citizen Hub', href: '/citizen-dashboard', icon: MapPin },
    { name: 'NGO Network', href: '/ngos', icon: Users },
    { name: 'NGO Validator', href: '/validator', icon: ShieldCheck },
    { name: 'Corporate Hub', href: '/corporate-dashboard', icon: Briefcase },
    { name: 'Escrow & Milestones', href: '/escrow', icon: FileCheck2 },
    { name: 'On-Chain Demo', href: '/demo', icon: ShieldCheck },
    { name: 'Corporate Partners', href: '/corporate', icon: Building2 },
    { name: 'Impact Reports', href: '/impact', icon: BarChart4 },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, role, logout, changeRole } = require('@/lib/AuthContext').useAuth();

    if (pathname.startsWith('/auth')) {
        return null; // hide sidebar on auth pages
    }

    return (
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm z-10 shrink-0">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm ring-2 ring-indigo-100">
                    FX
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">FINX</h1>
                    <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase mt-1">CSR Platform</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                <div className="text-xs font-semibold text-slate-400 mb-4 px-3 uppercase tracking-wider">Main Navigation</div>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-100">
                {user ? (
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <div className="text-xs font-semibold text-slate-500 mb-1">Active Role ({user.name})</div>

                        <select
                            value={role || ''}
                            onChange={(e) => changeRole(e.target.value)}
                            className="w-full bg-white text-sm font-bold text-slate-900 p-1.5 border border-slate-200 rounded mt-1 focus:ring-1 focus:ring-indigo-500 outline-none"
                        >
                            <option value="Admin">Admin / Reviewer</option>
                            <option value="Corporate">Corporate Funder</option>
                            <option value="NGO">NGO Validation</option>
                            <option value="Citizen">Citizen User</option>
                        </select>

                        <button onClick={logout} className="text-xs text-red-600 font-medium mt-3 hover:underline w-full text-left">
                            Log out
                        </button>
                    </div>
                ) : (
                    <Link href="/auth/login" className="block text-center text-sm bg-indigo-600 text-white p-2 rounded-lg font-medium hover:bg-indigo-700">
                        Sign In
                    </Link>
                )}
            </div>
        </div>
    );
}
