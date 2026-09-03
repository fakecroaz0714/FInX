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
    <div className="p-8 pb-20 space-y-8">
      {/* Role Indicator Banner */}
      <div className="bg-indigo-900 text-white p-4 rounded-xl shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-700 flex items-center justify-center font-bold text-lg text-white">
            {currentRole === 'Admin' ? '🛡️' : currentRole === 'Corporate' ? '🏢' : currentRole === 'NGO' ? '🌿' : '🏘️'}
          </div>
          <div>
            <div className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">
              {t('active_role')}: {currentRole}
            </div>
            <div className="text-lg font-bold">
              {roleTitles[currentRole] || roleTitles['Admin']}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-500/40 text-indigo-200 border-indigo-400 text-xs px-3 py-1 uppercase">
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
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('admin_dashboard_title')}</h1>
          <p className="text-slate-500 mt-1">{t('admin_dashboard_sub')}</p>
        </div>
        <Link
          href="/verified-milestones"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 text-sm">
          <ShieldCheck className="w-4 h-4" /> {t('btn_open_engine')}
        </Link>
      </header>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: t('nav_petitions'), value: "24", label: "From 12 districts" },
          { title: t('nav_ngo_validation'), value: "89", label: "Clear background checks" },
          { title: t('metric_locked_amount'), value: "₹4.0M", label: "Across active projects" },
          { title: t('metric_current_stage'), value: "42", label: "Released via verification" },
        ].map((stat, i) => (
          <Card key={i} className="border border-slate-200 shadow-sm leading-normal">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-slate-500 mb-1">{stat.title}</div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-lg">Active Escrow Projects (Governance View)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {[
                  { name: "Clean Water Initiative - Pune", ngo: "Jal Seva NGO", status: "Escrow Active", amount: "₹40,00,000", score: "94.1%", progress: 40 },
                  { name: "Solar Panel Installation - Rural Tech", ngo: "Green Earth Foundation", status: "Milestone Review", amount: "₹12,00,000", score: "88.0%", progress: 75 },
                  { name: "School Rebuilding Project - Bihar", ngo: "EduCare Org", status: "Evaluating NGO", amount: "₹8,50,000", score: "45.0%", progress: 10 },
                ].map((item, i) => (
                  <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{item.name}</h4>
                      <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                        <span>{item.ngo}</span>
                        <span>•</span>
                        <Badge variant={item.status === 'Escrow Active' ? 'success' : item.status === 'Milestone Review' ? 'warning' : 'neutral'}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right w-48">
                      <div className="font-semibold text-slate-900">{item.amount}</div>
                      <div className="text-xs text-indigo-600 font-medium">{t('metric_verification_score')}: {item.score}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-lg">CSR Fund Velocity Chart</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <DashboardChart />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" /> Admin Action Required
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Milestone Review: Solar Project</p>
                  <p className="text-xs text-slate-500 mt-1">NGO submitted photo evidence for Stage 2. Awaiting admin approval.</p>
                  <Link href="/verified-milestones" className="text-indigo-600 text-xs font-semibold mt-2 flex items-center gap-1 hover:underline">
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
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('corp_dashboard_title')}</h1>
          <p className="text-slate-500 mt-1">{t('corp_dashboard_sub')}</p>
        </div>
        <Link
          href="/csr"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 text-sm">
          <Building2 className="w-4 h-4" /> Create CSR Budget Mandate
        </Link>
      </header>

      {/* Corporate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-indigo-100 bg-indigo-50/30">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-slate-500 mb-1">{t('metric_approved_budget')}</div>
            <div className="text-3xl font-bold text-slate-900 mb-1 font-mono">₹40,00,000</div>
            <div className="text-xs text-indigo-600">TechCorp CSR Trust</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-slate-500 mb-1">{t('metric_released_amount')}</div>
            <div className="text-3xl font-bold text-emerald-600 mb-1 font-mono">₹8,00,000</div>
            <div className="text-xs text-slate-400">Milestone 1 Verified</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-slate-500 mb-1">{t('metric_locked_amount')}</div>
            <div className="text-3xl font-bold text-slate-900 mb-1 font-mono">₹32,00,000</div>
            <div className="text-xs text-slate-400">Protected until progress</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-slate-500 mb-1">Active Projects</div>
            <div className="text-3xl font-bold text-indigo-600 mb-1 font-mono">3</div>
            <div className="text-xs text-slate-400">Across Pune & Bihar</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">My Funded CSR Projects</CardTitle>
                <Link href="/verified-milestones" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                  {t('btn_open_engine')} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {[
                  { name: "Clean Water Initiative - Pune", ngo: "Jal Seva NGO", milestone: "M1: Site Prep (₹8L)", status: "VERIFIED", readyToRelease: true },
                  { name: "Solar Panel Installation - Rural Tech", ngo: "Green Earth Foundation", milestone: "M2: Base (₹10L)", status: "LOCKED", readyToRelease: false },
                ].map((item, i) => (
                  <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className="font-semibold text-slate-900">{item.name}</h4>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span>NGO: {item.ngo}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-700">{item.milestone}</span>
                      </div>
                    </div>
                    <div>
                      {item.readyToRelease ? (
                        <Link href="/verified-milestones" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm flex items-center gap-1">
                          <Unlock className="w-3.5 h-3.5" /> {t('btn_release_funds')} (₹8L)
                        </Link>
                      ) : (
                        <Badge variant="neutral">{item.status}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600" /> CSR Funding Rule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-xs text-slate-600 space-y-3">
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900 font-semibold text-[11px]">
                {t('status_locked_banner')}
              </div>
              <p>
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
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('ngo_dashboard_title')}</h1>
          <p className="text-slate-500 mt-1">{t('ngo_dashboard_sub')}</p>
        </div>
        <Link
          href="/verified-milestones"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 text-sm">
          <Camera className="w-4 h-4" /> {t('btn_submit_evidence')}
        </Link>
      </header>

      {/* NGO Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-slate-200">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-slate-500 mb-1">Assigned Projects</div>
            <div className="text-3xl font-bold text-slate-900 mb-1">3</div>
            <div className="text-xs text-emerald-600 font-semibold">Jal Seva Foundation</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-slate-500 mb-1">{t('metric_verification_score')}</div>
            <div className="text-3xl font-bold text-emerald-600 mb-1">92 / 100</div>
            <div className="text-xs text-slate-400">High Credibility</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-slate-500 mb-1">{t('metric_released_amount')}</div>
            <div className="text-3xl font-bold text-slate-900 mb-1 font-mono">₹8,00,000</div>
            <div className="text-xs text-slate-400">Milestone 1 Completed</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-slate-500 mb-1">Pending Evidence</div>
            <div className="text-3xl font-bold text-amber-600 mb-1">1</div>
            <div className="text-xs text-slate-400">Milestone 2 Next</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-lg">Field Inspection Tasks</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {[
                  { name: "Clean Water Initiative - Pune", task: "Milestone 1 Geotagged Proof Submitted", score: "94.1%", status: "VERIFIED" },
                  { name: "Solar Lighting Project", task: "Capture Baseline Site Geotag", score: "-", status: "ACTIVE" },
                ].map((item, i) => (
                  <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className="font-semibold text-slate-900">{item.name}</h4>
                      <div className="text-xs text-slate-500 mt-1">{item.task}</div>
                    </div>
                    <Link href="/verified-milestones" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold px-3 py-2 rounded-lg">
                      {t('btn_submit_evidence')}
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" /> Geolocation Protocol
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-xs text-slate-600 space-y-2">
              <p className="font-medium text-slate-900">Required Field Parameters:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-500">
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
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('citizen_dashboard_title')}</h1>
          <p className="text-slate-500 mt-1">{t('citizen_dashboard_sub')}</p>
        </div>
        <Link
          href="/petitions"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 text-sm">
          <PlusCircle className="w-4 h-4" /> File New Petition
        </Link>
      </header>

      {/* Citizen Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-slate-200">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-slate-500 mb-1">{t('nav_petitions')}</div>
            <div className="text-3xl font-bold text-slate-900 mb-1">14</div>
            <div className="text-xs text-slate-400">Shirur / Pune Region</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-slate-500 mb-1">Matched CSR Projects</div>
            <div className="text-3xl font-bold text-indigo-600 mb-1">6</div>
            <div className="text-xs text-slate-400">Funding Approved</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-slate-500 mb-1">Public Upvotes</div>
            <div className="text-3xl font-bold text-emerald-600 mb-1">1,420</div>
            <div className="text-xs text-slate-400">Village Signatures</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-slate-500 mb-1">Deployed Capital</div>
            <div className="text-3xl font-bold text-slate-900 mb-1 font-mono">₹40,00,000</div>
            <div className="text-xs text-slate-400">Clean Water Project</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-lg">Village Infrastructure Projects</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {[
                  { title: "Clean Drinking Water & Pipeline", village: "Shirur Village, Pune", status: "Milestone 1 Completed", progress: 40 },
                  { title: "Solar Microgrid Installation", village: "Haveli District", status: "Evaluation", progress: 15 },
                ].map((item, i) => (
                  <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className="font-semibold text-slate-900">{item.title}</h4>
                      <div className="text-xs text-slate-500 mt-1">{item.village} • {item.status}</div>
                    </div>
                    <Link href="/verified-milestones" className="text-xs text-indigo-600 font-semibold hover:underline">
                      Inspect Public Verification Proof →
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Public Transparency
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-xs text-slate-600 space-y-2">
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
