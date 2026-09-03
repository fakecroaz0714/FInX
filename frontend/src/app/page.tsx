'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Building2,
  MapPin,
  PlusCircle,
  Camera,
  Coins,
  Unlock
} from "lucide-react";
import DashboardChart from "@/components/DashboardChart";
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';

export default function Dashboard() {
  const { role } = useAuth();
  const { t, lang } = useLanguage();
  const currentRole = role || 'Admin';

  const roleTitles: Record<string, string> = {
    Admin: t('admin_dashboard_title'),
    Corporate: t('corp_dashboard_title'),
    NGO: t('ngo_dashboard_title'),
    Citizen: t('citizen_dashboard_title'),
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Role Indicator Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-xl shadow-sm border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600/80 border border-indigo-500/30 flex items-center justify-center font-bold text-base text-white shrink-0">
            {currentRole === 'Admin' ? '🛡️' : currentRole === 'Corporate' ? '🏢' : currentRole === 'NGO' ? '🌿' : '🏘️'}
          </div>
          <div>
            <div className="text-[11px] text-indigo-300 font-semibold uppercase tracking-wider">
              {t('active_role')}: {currentRole}
            </div>
            <div className="text-base md:text-lg font-bold tracking-tight text-white">
              {roleTitles[currentRole] || roleTitles['Admin']}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge className="bg-indigo-500/20 text-indigo-200 border-indigo-400/40 text-[10px] px-2.5 py-0.5 uppercase tracking-wider font-semibold">
            Language: {lang.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* RENDER DYNAMIC DASHBOARD BASED ON ACTIVE ROLE */}
      {currentRole === 'Admin' && <AdminDashboardView />}
      {currentRole === 'Corporate' && <CorporateDashboardView />}
      {currentRole === 'NGO' && <NGODashboardView />}
      {currentRole === 'Citizen' && <CitizenDashboardView />}
    </div>
  );
}

/* =========================================================================
   1. ADMIN / GOVERNANCE DASHBOARD VIEW
   ========================================================================= */
function AdminDashboardView() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t('admin_dashboard_title')}</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">{t('admin_dashboard_sub')}</p>
        </div>
        <Link
          href="/verified-milestones"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-sm flex items-center gap-2 text-xs shrink-0 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" /> {t('btn_open_engine')}
        </Link>
      </header>

      {/* Compact Admin Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { title: t('nav_petitions'), value: "24", label: "From 12 districts" },
          { title: t('nav_ngo_validation'), value: "89", label: "Clear checks" },
          { title: t('metric_locked_amount'), value: "₹4.0M", label: "Escrow protected" },
          { title: t('metric_current_stage'), value: "42", label: "Verified tranches" },
        ].map((stat, i) => (
          <Card key={i} className="border border-slate-200/80 shadow-sm leading-tight card-hover-effect">
            <CardContent className="p-4">
              <div className="text-xs font-semibold text-slate-500 mb-1 truncate">{stat.title}</div>
              <div className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">{stat.value}</div>
              <div className="text-[10px] text-slate-400">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/60 p-4">
              <CardTitle className="text-sm font-bold text-slate-900">Active Escrow Projects (Governance View)</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left table-compact min-w-[500px]">
                <thead>
                  <tr>
                    <th>Project Name & NGO</th>
                    <th>Escrow Status</th>
                    <th className="text-right">Budget</th>
                    <th className="text-right">Verification Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { name: "Clean Water Initiative - Pune", ngo: "Jal Seva NGO", status: "Escrow Active", amount: "₹40,00,000", score: "94.1%" },
                    { name: "Solar Panel Installation - Rural Tech", ngo: "Green Earth Foundation", status: "Milestone Review", amount: "₹12,00,000", score: "88.0%" },
                    { name: "School Rebuilding Project - Bihar", ngo: "EduCare Org", status: "Evaluating NGO", amount: "₹8,50,000", score: "45.0%" },
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="font-semibold text-slate-900">
                        <div>{item.name}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{item.ngo}</div>
                      </td>
                      <td>
                        <Badge variant={item.status === 'Escrow Active' ? 'success' : item.status === 'Milestone Review' ? 'warning' : 'neutral'} className="text-[10px] px-2 py-0.5">
                          {item.status}
                        </Badge>
                      </td>
                      <td className="text-right font-mono font-semibold text-slate-900">{item.amount}</td>
                      <td className="text-right font-semibold text-indigo-600">{item.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/60 p-4">
              <CardTitle className="text-sm font-bold text-slate-900">CSR Fund Velocity Chart</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <DashboardChart />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader className="border-b border-slate-100 p-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600" /> Admin Action Required
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Milestone Review: Solar Project</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">NGO submitted photo evidence for Stage 2. Awaiting admin approval.</p>
                  <Link href="/verified-milestones" className="text-indigo-600 text-xs font-bold mt-2 flex items-center gap-1 hover:underline">
                    Review Evidence <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   2. CORPORATE CSR FUNDER DASHBOARD VIEW
   ========================================================================= */
function CorporateDashboardView() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t('corp_dashboard_title')}</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">{t('corp_dashboard_sub')}</p>
        </div>
        <Link
          href="/csr"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-sm flex items-center gap-2 text-xs shrink-0 self-start sm:self-auto">
          <Building2 className="w-4 h-4" /> Create CSR Mandate
        </Link>
      </header>

      {/* Compact Corporate Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="border border-indigo-100 bg-indigo-50/20 card-hover-effect">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-slate-500 mb-1">{t('metric_approved_budget')}</div>
            <div className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1 font-mono">₹40,00,000</div>
            <div className="text-[10px] text-indigo-600 font-semibold">TechCorp Trust</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/80 card-hover-effect">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-slate-500 mb-1">{t('metric_released_amount')}</div>
            <div className="text-xl md:text-2xl font-extrabold text-emerald-600 mb-1 font-mono">₹8,00,000</div>
            <div className="text-[10px] text-slate-400">Milestone 1 Verified</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/80 card-hover-effect">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-slate-500 mb-1">{t('metric_locked_amount')}</div>
            <div className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1 font-mono">₹32,00,000</div>
            <div className="text-[10px] text-slate-400">Escrow Protected</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/80 card-hover-effect">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-slate-500 mb-1">Active Projects</div>
            <div className="text-xl md:text-2xl font-extrabold text-indigo-600 mb-1 font-mono">3</div>
            <div className="text-[10px] text-slate-400">Pune & Bihar</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/60 p-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-bold text-slate-900">My Funded CSR Projects</CardTitle>
                <Link href="/verified-milestones" className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1">
                  {t('btn_open_engine')} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left table-compact min-w-[500px]">
                <thead>
                  <tr>
                    <th>Project & NGO</th>
                    <th>Next Milestone Tranche</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { name: "Clean Water Initiative - Pune", ngo: "Jal Seva NGO", milestone: "M1: Site Prep (₹8L)", status: "VERIFIED", readyToRelease: true },
                    { name: "Solar Panel Installation - Rural Tech", ngo: "Green Earth Foundation", milestone: "M2: Base (₹10L)", status: "LOCKED", readyToRelease: false },
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="font-semibold text-slate-900">
                        <div>{item.name}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{item.ngo}</div>
                      </td>
                      <td className="font-mono text-slate-700 font-medium">{item.milestone}</td>
                      <td className="text-right">
                        {item.readyToRelease ? (
                          <Link href="/verified-milestones" className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded shadow-sm inline-flex items-center gap-1">
                            <Unlock className="w-3 h-3" /> {t('btn_release_funds')}
                          </Link>
                        ) : (
                          <Badge variant="neutral" className="text-[10px] px-2 py-0.5">{item.status}</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader className="border-b border-slate-100 p-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900">
                <Coins className="w-4 h-4 text-emerald-600" /> CSR Funding Rule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-xs text-slate-600 space-y-2.5">
              <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900 font-bold text-[10px] uppercase tracking-wide">
                {t('status_locked_banner')}
              </div>
              <p className="leading-relaxed">
                As a Corporate CSR Funder, your capital is locked in smart escrow. Funds are released tranche-by-tranche ONLY when physical photo proof passes Haversine GPS verification and AI progress analysis.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3. NGO PARTNER / INSPECTOR DASHBOARD VIEW
   ========================================================================= */
function NGODashboardView() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t('ngo_dashboard_title')}</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">{t('ngo_dashboard_sub')}</p>
        </div>
        <Link
          href="/verified-milestones"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-sm flex items-center gap-2 text-xs shrink-0 self-start sm:self-auto">
          <Camera className="w-4 h-4" /> {t('btn_submit_evidence')}
        </Link>
      </header>

      {/* Compact NGO Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="border border-slate-200/80 card-hover-effect">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-slate-500 mb-1">Assigned Projects</div>
            <div className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1">3</div>
            <div className="text-[10px] text-emerald-600 font-semibold">Jal Seva NGO</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/80 card-hover-effect">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-slate-500 mb-1">{t('metric_verification_score')}</div>
            <div className="text-xl md:text-2xl font-extrabold text-emerald-600 mb-1">92 / 100</div>
            <div className="text-[10px] text-slate-400">High Credibility</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/80 card-hover-effect">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-slate-500 mb-1">{t('metric_released_amount')}</div>
            <div className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1 font-mono">₹8,00,000</div>
            <div className="text-[10px] text-slate-400">Milestone 1</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/80 card-hover-effect">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-slate-500 mb-1">Pending Evidence</div>
            <div className="text-xl md:text-2xl font-extrabold text-amber-600 mb-1">1</div>
            <div className="text-[10px] text-slate-400">Milestone 2</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/60 p-4">
              <CardTitle className="text-sm font-bold text-slate-900">Field Inspection Tasks</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left table-compact min-w-[500px]">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Milestone Task</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { name: "Clean Water Initiative - Pune", task: "Milestone 1 Geotagged Proof Submitted", score: "94.1%", status: "VERIFIED" },
                    { name: "Solar Lighting Project", task: "Capture Baseline Site Geotag", score: "-", status: "ACTIVE" },
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="font-semibold text-slate-900">{item.name}</td>
                      <td className="text-slate-600 text-[11px]">{item.task}</td>
                      <td className="text-right">
                        <Link href="/verified-milestones" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[11px] font-bold px-3 py-1.5 rounded transition-colors inline-block">
                          {t('btn_submit_evidence')}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader className="border-b border-slate-100 p-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900">
                <MapPin className="w-4 h-4 text-indigo-600" /> Geolocation Protocol
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-xs text-slate-600 space-y-2">
              <p className="font-bold text-slate-900">Required Field Parameters:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-500 leading-relaxed">
                <li>Device GPS Latitude & Longitude lock</li>
                <li>Clear unedited photograph of physical site</li>
                <li>SHA-256 duplicate image hash check</li>
                <li>Within 100m radius of project baseline</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. CITIZEN / VILLAGE USER DASHBOARD VIEW
   ========================================================================= */
function CitizenDashboardView() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t('citizen_dashboard_title')}</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">{t('citizen_dashboard_sub')}</p>
        </div>
        <Link
          href="/petitions"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-sm flex items-center gap-2 text-xs shrink-0 self-start sm:self-auto">
          <PlusCircle className="w-4 h-4" /> File New Petition
        </Link>
      </header>

      {/* Compact Citizen Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="border border-slate-200/80 card-hover-effect">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-slate-500 mb-1">{t('nav_petitions')}</div>
            <div className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1">14</div>
            <div className="text-[10px] text-slate-400">Shirur / Pune</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/80 card-hover-effect">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-slate-500 mb-1">Matched CSR Projects</div>
            <div className="text-xl md:text-2xl font-extrabold text-indigo-600 mb-1">6</div>
            <div className="text-[10px] text-slate-400">Approved Funding</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/80 card-hover-effect">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-slate-500 mb-1">Public Upvotes</div>
            <div className="text-xl md:text-2xl font-extrabold text-emerald-600 mb-1">1,420</div>
            <div className="text-[10px] text-slate-400">Village Signatures</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/80 card-hover-effect">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-slate-500 mb-1">Deployed Capital</div>
            <div className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1 font-mono">₹40,00,000</div>
            <div className="text-[10px] text-slate-400">Clean Water</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/60 p-4">
              <CardTitle className="text-sm font-bold text-slate-900">Village Infrastructure Projects</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left table-compact min-w-[500px]">
                <thead>
                  <tr>
                    <th>Project Title & Village</th>
                    <th>Status</th>
                    <th className="text-right">Verification Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { title: "Clean Drinking Water & Pipeline", village: "Shirur Village, Pune", status: "Milestone 1 Completed" },
                    { title: "Solar Microgrid Installation", village: "Haveli District", status: "Evaluation" },
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="font-semibold text-slate-900">
                        <div>{item.title}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{item.village}</div>
                      </td>
                      <td>
                        <Badge variant="success" className="text-[10px] px-2 py-0.5">{item.status}</Badge>
                      </td>
                      <td className="text-right">
                        <Link href="/verified-milestones" className="text-xs text-indigo-600 font-bold hover:underline">
                          Inspect Proof →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader className="border-b border-slate-100 p-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Public Transparency
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                Every village project funded on FINX is publicly audit-traceable. You can inspect physical photo evidence and GPS verification for your local project anytime!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
