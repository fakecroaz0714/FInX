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
    Globe
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
        <div className="w-56 xl:w-60 bg-white border-r border-slate-200/80 flex flex-col h-full shadow-sm z-20 shrink-0 select-none">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center font-bold text-white shadow-sm ring-2 ring-indigo-100 text-xs">
                        FX
                    </div>
                    <div>
                        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">FINX</h1>
                        <p className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">CSR Platform</p>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 mb-2 px-2.5 uppercase tracking-widest flex justify-between items-center">
                    <span>{activeRoleKey} Menu</span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-medium">Active</span>
                </div>
                {activeNavItems.map((item) => {
                    const isActive = item.href === '/'
                        ? (pathname === '/' || pathname === '/dashboard')
                        : pathname === item.href;
                    const Icon = item.icon;
                    const translatedName = t(item.key) || item.defaultName;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${isActive
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                            <span className="truncate">{translatedName}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Compact Control Panel */}
            <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/50">
                {/* Language Dropdown */}
                <div className="bg-slate-900 text-white rounded-lg p-2.5 shadow-sm space-y-1">
                    <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                        <Globe className="w-3 h-3 text-indigo-400" />
                        {t('select_language')}
                    </div>

                    <select
                        value={lang}
                        onChange={(e) => setLang(e.target.value as Language)}
                        className="w-full bg-slate-800 text-xs font-bold text-white p-1.5 border border-slate-700 rounded focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                        <option value="en">🇺🇸 English</option>
                        <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
                        <option value="mr">🇮🇳 मराठी (Marathi)</option>
                        <option value="ta">🇮🇳 தமிழ் (Tamil)</option>
                        <option value="te">🇮🇳 తెలుగు (Telugu)</option>
                    </select>
                </div>

                {/* Role Switcher */}
                <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider truncate">
                        {t('active_role')} ({user?.name || `${role} User`})
                    </div>

                    <select
                        value={role || 'Admin'}
                        onChange={(e) => changeRole(e.target.value as any)}
                        className="w-full bg-slate-50 text-xs font-bold text-slate-900 p-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                        <option value="Admin">🛡️ Admin / Reviewer</option>
                        <option value="Corporate">🏢 Corporate CSR Funder</option>
                        <option value="NGO">🌿 NGO Partner / Inspector</option>
                        <option value="Citizen">🏘️ Citizen / Village User</option>
                    </select>

                    <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-slate-100 text-[10px]">
                        <span className="text-slate-400">i18n Active</span>
                        <button onClick={logout} className="text-indigo-600 font-semibold hover:underline">
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
