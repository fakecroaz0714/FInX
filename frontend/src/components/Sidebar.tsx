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
    BarChart4,
    Globe,
    Network
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage, Language } from '@/lib/LanguageContext';

const roleNavItems: Record<string, Array<{ key: string; defaultName: string; href: string; icon: any }>> = {
    Admin: [
        { key: 'nav_dashboard', defaultName: 'Dashboard', href: '/', icon: LayoutDashboard },
        { key: 'nav_verified_milestones', defaultName: 'Verified Milestones', href: '/verified-milestones', icon: ShieldCheck },
        { key: 'nav_ngo_validation', defaultName: 'NGO Validation', href: '/validation', icon: ShieldCheck },
        { key: 'nav_escrow', defaultName: 'Escrow Controls', href: '/escrow', icon: FileCheck2 },
        { key: 'nav_demo', defaultName: 'On-Chain Demo', href: '/demo', icon: ShieldCheck },
        { key: 'nav_impact', defaultName: 'Impact Reports', href: '/impact', icon: BarChart4 },
    ],
    Corporate: [
        { key: 'nav_dashboard', defaultName: 'Dashboard', href: '/', icon: LayoutDashboard },
        { key: 'nav_verified_milestones', defaultName: 'Milestone Funding Control', href: '/verified-milestones', icon: ShieldCheck },
        { key: 'nav_csr_matches', defaultName: 'CSR Matches & Mandates', href: '/csr', icon: Briefcase },
        { key: 'nav_escrow', defaultName: 'Escrow Accounts', href: '/escrow', icon: FileCheck2 },
        { key: 'nav_corporate_dir', defaultName: 'Corporate Directory', href: '/corporate', icon: Building2 },
        { key: 'nav_impact', defaultName: 'Impact Analytics', href: '/impact', icon: BarChart4 },
    ],
    NGO: [
        { key: 'nav_dashboard', defaultName: 'Dashboard', href: '/', icon: LayoutDashboard },
        { key: 'nav_submit_evidence', defaultName: 'Submit Evidence', href: '/verified-milestones', icon: ShieldCheck },
        { key: 'nav_ngo_dir', defaultName: 'NGO Directory', href: '/ngos', icon: Users },
        { key: 'nav_csr_matches', defaultName: 'CSR Opportunities', href: '/csr', icon: Briefcase },
        { key: 'nav_petitions', defaultName: 'Village Petitions', href: '/petitions', icon: MapPin },
    ],
    Citizen: [
        { key: 'nav_dashboard', defaultName: 'Dashboard', href: '/', icon: LayoutDashboard },
        { key: 'nav_petitions', defaultName: 'Village Petitions', href: '/petitions', icon: MapPin },
        { key: 'nav_verified_milestones', defaultName: 'Public Milestone Proofs', href: '/verified-milestones', icon: ShieldCheck },
        { key: 'nav_impact', defaultName: 'Impact Reports', href: '/impact', icon: BarChart4 },
    ]
};

export default function Sidebar() {
    const pathname = usePathname();
    const { user, role, logout, changeRole } = useAuth();
    const { lang, setLang, t } = useLanguage();

    if (pathname.startsWith('/auth')) {
        return null; // hide sidebar on auth pages
    }

    const activeRoleKey = (role as string) || 'Admin';
    const activeNavItems = roleNavItems[activeRoleKey] || roleNavItems['Admin'];

    return (
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm z-10 shrink-0">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm ring-2 ring-indigo-100">
                        FX
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">FINX</h1>
                        <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase mt-1">CSR Platform</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                <div className="text-xs font-semibold text-slate-400 mb-4 px-3 uppercase tracking-wider flex justify-between items-center">
                    <span>{activeRoleKey} Menu</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-normal">Filtered</span>
                </div>
                {activeNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    const translatedName = t(item.key) || item.defaultName;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-indigo-50 text-indigo-700 font-bold'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                            {translatedName}
                        </Link>
                    );
                })}
            </div>

            {/* CONTROL PANEL: MULTI-LANGUAGE SELECTOR & ROLE SWITCHER */}
            <div className="p-4 border-t border-slate-100 space-y-3">
                {/* 1. Language Selector */}
                <div className="bg-slate-900 text-white rounded-xl p-3 shadow-md space-y-1.5">
                    <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-indigo-400" />
                        {t('select_language')}
                    </div>

                    <select
                        value={lang}
                        onChange={(e) => setLang(e.target.value as Language)}
                        className="w-full bg-slate-800 text-sm font-bold text-white p-2 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                        <option value="en">🇺🇸 English</option>
                        <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
                        <option value="mr">🇮🇳 मराठी (Marathi)</option>
                        <option value="ta">🇮🇳 தமிழ் (Tamil)</option>
                        <option value="te">🇮🇳 తెలుగు (Telugu)</option>
                    </select>
                </div>

                {/* 2. Active Role Switcher */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 shadow-sm">
                    <div className="text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                        {t('active_role')} ({user?.name || `${role} User`})
                    </div>

                    <select
                        value={role || 'Admin'}
                        onChange={(e) => changeRole(e.target.value as any)}
                        className="w-full bg-white text-sm font-bold text-slate-900 p-2 border border-slate-300 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer"
                    >
                        <option value="Admin">🛡️ Admin / Reviewer</option>
                        <option value="Corporate">🏢 Corporate CSR Funder</option>
                        <option value="NGO">🌿 NGO Partner / Inspector</option>
                        <option value="Citizen">🏘️ Citizen / Village User</option>
                    </select>

                    <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-200/60 text-xs">
                        <span className="text-slate-400 text-[10px]">Multi-Language Active</span>
                        <button onClick={logout} className="text-indigo-600 font-medium hover:underline text-[11px]">
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
