"use client";

import { useState } from "react";
import { Map, MapControls, MapMarker } from "@/components/ui/map";
import { NATURAL_BLUE_STYLE } from "@/lib/mapStyles";
import { Badge } from "@/components/ui/Badge";
import {
  Briefcase,
  Coins,
  Building2,
  CheckCircle2,
  TrendingUp,
  Target,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  FileSpreadsheet,
  Zap,
} from "lucide-react";

export interface CorporateActiveProject {
  id: string;
  title: string;
  ngoPartner: string;
  totalGrant: number; // in INR
  releasedAmount: number; // in INR
  escrowContract: string;
  sdgTag: "SDG 4: Education" | "SDG 7: Clean Energy" | "SDG 6: Clean Water" | "SDG 8: Economic Growth" | "SDG 3: Health";
  sdgNumber: string;
  progressPercent: number;
  currentMilestone: string;
  beneficiaries: string;
  coordinates: [number, number]; // [lng, lat]
  locationName: string;
  csrImpactScore: number;
}

const INITIAL_CORPORATE_PROJECTS: CorporateActiveProject[] = [
  {
    id: "CORP-PUN-01",
    title: "TechCorp STEM & Coding Labs for Rural High Schools",
    ngoPartner: "EduCare Org",
    totalGrant: 4000000,
    releasedAmount: 3000000,
    escrowContract: "0xESC...8A92",
    sdgTag: "SDG 4: Education",
    sdgNumber: "SDG 4",
    progressPercent: 75,
    currentMilestone: "Milestone 3/4: Computer Hardware Deployed",
    beneficiaries: "1,450 Underprivileged Students",
    coordinates: [73.82, 18.53],
    locationName: "Pune Western Educational Hub",
    csrImpactScore: 95,
  },
  {
    id: "CORP-SOL-02",
    title: "Artisan Weavers Rooftop Solar Microgrid",
    ngoPartner: "Renewable Solar Mission",
    totalGrant: 2800000,
    releasedAmount: 1400000,
    escrowContract: "0xESC...5F31",
    sdgTag: "SDG 7: Clean Energy",
    sdgNumber: "SDG 7",
    progressPercent: 50,
    currentMilestone: "Milestone 2/4: Bi-directional Inverter Commissioned",
    beneficiaries: "320 Artisan Handloom Families",
    coordinates: [75.9064, 17.6599],
    locationName: "Solapur Handloom Textile Cluster",
    csrImpactScore: 91,
  },
  {
    id: "CORP-KOL-03",
    title: "Safe Drinking Water Community ATM Network",
    ngoPartner: "Jal Seva Trust",
    totalGrant: 3500000,
    releasedAmount: 2800000,
    escrowContract: "0xESC...B4C1",
    sdgTag: "SDG 6: Clean Water",
    sdgNumber: "SDG 6",
    progressPercent: 80,
    currentMilestone: "Milestone 4/5: 8 Purification Units Operational",
    beneficiaries: "12,000 Farming Households",
    coordinates: [74.2433, 16.705],
    locationName: "Kolhapur Agro-Belt Corridor",
    csrImpactScore: 97,
  },
  {
    id: "CORP-RAT-04",
    title: "Women SHG Agro-Processing & Cold Packaging Unit",
    ngoPartner: "Coastal Livelihood Collective",
    totalGrant: 1800000,
    releasedAmount: 540000,
    escrowContract: "0xESC...2D19",
    sdgTag: "SDG 8: Economic Growth",
    sdgNumber: "SDG 8",
    progressPercent: 30,
    currentMilestone: "Milestone 1/3: Equipment Procurement Verified",
    beneficiaries: "240 Women Self-Help Group Entrepreneurs",
    coordinates: [73.312, 16.9902],
    locationName: "Ratnagiri Horticulture Belt",
    csrImpactScore: 89,
  },
  {
    id: "CORP-ALI-05",
    title: "Emergency Coastal Health & Marine Triage Ambulance",
    ngoPartner: "Jeevan Raksha Trust",
    totalGrant: 2200000,
    releasedAmount: 2200000,
    escrowContract: "0xESC...99E4",
    sdgTag: "SDG 3: Health",
    sdgNumber: "SDG 3",
    progressPercent: 100,
    currentMilestone: "Milestone 4/4: Fully Deployed & Handover Complete",
    beneficiaries: "8,500 Coastal Fisher Community Residents",
    coordinates: [72.8767, 18.6414],
    locationName: "Alibaug Maritime District",
    csrImpactScore: 98,
  },
];

export function CorporateActiveProjectsMap() {
  const [projects, setProjects] = useState<CorporateActiveProject[]>(INITIAL_CORPORATE_PROJECTS);
  const [selectedId, setSelectedId] = useState<string>("CORP-PUN-01");
  const [sdgFilter, setSdgFilter] = useState<string>("All");
  const [txNotice, setTxNotice] = useState<string | null>(null);

  const selectedProject = projects.find((p) => p.id === selectedId) || projects[0];

  const filteredProjects = projects.filter((p) => {
    if (sdgFilter === "All") return true;
    return p.sdgNumber === sdgFilter;
  });

  const totalCommitted = projects.reduce((acc, curr) => acc + curr.totalGrant, 0);
  const totalReleased = projects.reduce((acc, curr) => acc + curr.releasedAmount, 0);

  const handleDisburse = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextAmount = Math.min(p.totalGrant, p.releasedAmount + p.totalGrant * 0.25);
          const nextPercent = Math.min(100, Math.round((nextAmount / p.totalGrant) * 100));
          return {
            ...p,
            releasedAmount: nextAmount,
            progressPercent: nextPercent,
          };
        }
        return p;
      })
    );
    setTxNotice(`Escrow release transaction for ${id} broadcast to blockchain node!`);
    setTimeout(() => setTxNotice(null), 3500);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      {/* Top Banner with Corporate CSR Metrics */}
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/60 via-white to-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm ring-4 ring-blue-100">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Active CSR Investment Portfolio</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                Corporate Funder View
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Track milestones, locked smart-contract escrow capital, and audited SDG outcomes across regional projects.
            </p>
          </div>
        </div>

        {/* Global CSR Metrics Bar */}
        <div className="flex items-center gap-4 text-xs font-mono bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Committed</span>
            <span className="font-bold text-slate-900">₹{(totalCommitted / 1000000).toFixed(1)}M</span>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Disbursed</span>
            <span className="font-bold text-blue-600">₹{(totalReleased / 1000000).toFixed(1)}M</span>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Locked Escrow</span>
            <span className="font-bold text-slate-700">₹{((totalCommitted - totalReleased) / 1000000).toFixed(1)}M</span>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2 overflow-x-auto text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium mr-1">SDG Goal:</span>
          {["All", "SDG 4", "SDG 6", "SDG 7", "SDG 8", "SDG 3"].map((sdg) => (
            <button
              key={sdg}
              onClick={() => setSdgFilter(sdg)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                sdgFilter === sdg
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {sdg}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-slate-400 shrink-0">Showing {filteredProjects.length} active funded sites</span>
      </div>

      {txNotice && (
        <div className="bg-blue-600 text-white text-xs px-4 py-2 font-medium flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-blue-200" /> {txNotice}
          </span>
          <button onClick={() => setTxNotice(null)} className="text-blue-200 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Main Container: Map (2/3) + Corporate Portfolio Panel (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px] flex-1">
        {/* The White Background & Blue Roads Map */}
        <div className="lg:col-span-8 relative h-[380px] lg:h-auto w-full bg-white border-b lg:border-b-0 lg:border-r border-slate-200">
          <Map
            center={[selectedProject.coordinates[0], selectedProject.coordinates[1]]}
            zoom={9.2}
            styles={NATURAL_BLUE_STYLE}
            className="w-full h-full"
          >
            <MapControls position="top-right" showZoom showCompass showFullscreen />

            {/* Exclusive Corporate Markers */}
            {filteredProjects.map((project) => {
              const isSelected = project.id === selectedId;

              return (
                <MapMarker
                  key={project.id}
                  longitude={project.coordinates[0]}
                  latitude={project.coordinates[1]}
                  onClick={() => setSelectedId(project.id)}
                >
                  <div className="cursor-pointer group flex flex-col items-center">
                    {/* Hover Callout with Grant & Progress */}
                    <div
                      className={`mb-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-md transition-all whitespace-nowrap flex items-center gap-2 ${
                        isSelected
                          ? "bg-blue-600 text-white ring-2 ring-blue-300 scale-105"
                          : "bg-white text-slate-800 border border-slate-200 opacity-95 group-hover:opacity-100 group-hover:border-blue-400"
                      }`}
                    >
                      <span>₹{(project.totalGrant / 100000).toFixed(1)}L Grant</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-semibold font-mono">
                        {project.progressPercent}% Funded
                      </span>
                    </div>

                    {/* Blue Pin Icon */}
                    <div className="relative">
                      {isSelected && (
                        <div className="absolute -inset-2 bg-blue-400/30 rounded-full animate-ping pointer-events-none" />
                      )}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                          isSelected
                            ? "bg-blue-600 text-white ring-4 ring-blue-100 scale-110"
                            : "bg-white text-blue-600 border-2 border-blue-500 group-hover:bg-blue-50"
                        }`}
                      >
                        <Coins className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </MapMarker>
              );
            })}
          </Map>

          {/* Map Legend */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-2.5 shadow-sm text-[11px] space-y-1.5 pointer-events-auto">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span> Corporate Portfolio Map
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-blue-600 rounded"></span> Expressways & Corridors
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-blue-300 rounded"></span> Primary Roads
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-white border border-slate-300"></span> Natural White Basemap
              </span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Selected Project Escrow & Impact Telemetry */}
        <div className="lg:col-span-4 flex flex-col bg-slate-50/50 p-4 divide-y divide-slate-100 overflow-y-auto">
          <div className="pb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                {selectedProject.sdgTag}
              </span>
              <Badge variant="neutral" className="font-mono text-[10px]">
                {selectedProject.escrowContract}
              </Badge>
            </div>

            <h3 className="text-base font-bold text-slate-900 leading-snug">{selectedProject.title}</h3>

            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Partner NGO: </span>
              <span className="font-semibold text-slate-800">{selectedProject.ngoPartner}</span>
            </div>

            {/* Escrow Progress Bar */}
            <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Escrow Capital Released</span>
                <span className="font-mono font-bold text-blue-700">{selectedProject.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${selectedProject.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-0.5">
                <span>Released: ₹{selectedProject.releasedAmount.toLocaleString()}</span>
                <span>Total: ₹{selectedProject.totalGrant.toLocaleString()}</span>
              </div>
            </div>

            {/* Impact Reach & Current Milestone */}
            <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200/80 text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-600 border-b border-slate-100 pb-1.5">
                <span className="font-medium">Beneficiaries Reached:</span>
                <span className="font-semibold text-slate-900">{selectedProject.beneficiaries}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 border-b border-slate-100 pb-1.5">
                <span className="font-medium">CSR ESG Score:</span>
                <span className="font-mono font-bold text-blue-700">{selectedProject.csrImpactScore}/100</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Active Milestone:</span>
                <span className="font-medium text-slate-800">{selectedProject.currentMilestone}</span>
              </div>
            </div>

            {/* Corporate Actions */}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => handleDisburse(selectedProject.id)}
                disabled={selectedProject.progressPercent >= 100}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs transition-colors shadow-xs"
              >
                <Coins className="w-4 h-4" />
                {selectedProject.progressPercent >= 100 ? "100% Capital Disbursed" : "Authorize Next Milestone Payout"}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => alert(`Opening escrow smart contract ledger: ${selectedProject.escrowContract}`)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-xs transition"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" /> Escrow Ledger
                </button>
                <button
                  onClick={() => alert(`Exporting ESG Audit & Tax Compliance Report for ${selectedProject.id}`)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-xs transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" /> Impact Report
                </button>
              </div>
            </div>
          </div>

          {/* Portfolio List */}
          <div className="pt-4 space-y-2.5 flex-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>CSR Grants Portfolio ({filteredProjects.length})</span>
              <span className="text-[10px] text-blue-600 font-medium">Click to inspect</span>
            </div>

            {filteredProjects.map((p) => {
              const isCurrent = p.id === selectedProject.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isCurrent
                      ? "bg-white border-blue-600 shadow-sm ring-2 ring-blue-100"
                      : "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/20"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">{p.title}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                      <span className="text-blue-700 font-medium">{p.sdgNumber}</span>
                      <span>&bull;</span>
                      <span className="font-mono font-semibold text-slate-700">₹{(p.totalGrant / 100000).toFixed(1)}L</span>
                      <span>&bull;</span>
                      <span className="text-slate-400">{p.progressPercent}%</span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isCurrent ? "text-blue-600 translate-x-0.5" : "text-slate-300"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
