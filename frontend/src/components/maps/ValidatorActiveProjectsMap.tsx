"use client";

import { useState } from "react";
import { Map, MapControls, MapMarker } from "@/components/ui/map";
import { NATURAL_BLUE_STYLE } from "@/lib/mapStyles";
import { Badge } from "@/components/ui/Badge";
import {
  ShieldCheck,
  ShieldAlert,
  FileCheck2,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Eye,
  Camera,
  Layers,
  MapPin,
  RefreshCw,
  Search,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { GeotagProofModal } from "@/components/maps/GeotagProofModal";
import { PROJECT_PROOFS_MAP } from "@/lib/projectProofsData";

export interface ValidatorActiveProject {
  id: string;
  title: string;
  ngoName: string;
  stage: "Milestone 2 Inspection" | "Satellite Tree Audit" | "Physical Geo-Check" | "Milestone 1 Audit" | "Final Handover";
  trustScore: number;
  status: "In Review" | "Physical Audit Needed" | "Approved" | "High Risk Flagged";
  assignedValidator: string;
  coordinates: [number, number]; // [lng, lat]
  locationName: string;
  gpsAccuracy: string;
  budget: string;
  evidenceCount: number;
  description: string;
}

const INITIAL_VALIDATOR_PROJECTS: ValidatorActiveProject[] = [
  {
    id: "VAL-PUN-084",
    title: "Check Dam Water Harvest Basin",
    ngoName: "Jal Seva Trust",
    stage: "Milestone 2 Inspection",
    trustScore: 94,
    status: "In Review",
    assignedValidator: "Rajesh Kulkarni (Civil Auditor)",
    coordinates: [73.8567, 18.5204],
    locationName: "Haveli Block, Pune District",
    gpsAccuracy: "±1.8m (High Precision)",
    budget: "₹1,500,000",
    evidenceCount: 8,
    description: "Concrete bunding wall inspected. 8 geotagged site photos matched with municipal cadastral maps.",
  },
  {
    id: "VAL-NSK-112",
    title: "Western Ghats Afforestation Nursery",
    ngoName: "Green Earth Foundation",
    stage: "Satellite Tree Audit",
    trustScore: 88,
    status: "Approved",
    assignedValidator: "Dr. Ananya Sharma (Ecology Auditor)",
    coordinates: [73.7898, 19.9975],
    locationName: "Igatpuri Foothills, Nashik",
    gpsAccuracy: "±2.4m (Drone Orthomosaic)",
    budget: "₹2,400,000",
    evidenceCount: 14,
    description: "Drone multi-spectral survey verified 12,000 native saplings planted with 92% canopy survival index.",
  },
  {
    id: "VAL-MUM-209",
    title: "Urban Slum Sanitation & Bio-Toilets",
    ngoName: "Urban Health Initiative",
    stage: "Physical Geo-Check",
    trustScore: 42,
    status: "High Risk Flagged",
    assignedValidator: "Sunil Mehta (Municipal Field Inspector)",
    coordinates: [72.857, 19.043],
    locationName: "Sector 5, Dharavi, Mumbai",
    gpsAccuracy: "±18.5m (Discrepancy Detected)",
    budget: "₹850,000",
    evidenceCount: 3,
    description: "Photo metadata coordinates diverge by 420m from actual project site. Flagged for physical surveyor re-inspection.",
  },
  {
    id: "VAL-STR-047",
    title: "Krishna River Silt Extraction & Canal Bunding",
    ngoName: "Watershed Vikas Trust",
    stage: "Milestone 1 Audit",
    trustScore: 91,
    status: "In Review",
    assignedValidator: "Meera Deshmukh (Hydrology Specialist)",
    coordinates: [73.9903, 17.6805],
    locationName: "Wai Canal Corridor, Satara",
    gpsAccuracy: "±2.0m (RTK Surveyor)",
    budget: "₹3,100,000",
    evidenceCount: 11,
    description: "Milestone 1 excavated 45,000 cubic meters of silt. Digital flow sensor logs submitted for escrow payout verification.",
  },
  {
    id: "VAL-AHM-163",
    title: "Tribal Residential School Solar Microgrid",
    ngoName: "EduCare Org",
    stage: "Final Handover",
    trustScore: 96,
    status: "Approved",
    assignedValidator: "Vikram Shinde (Electrical Inspector)",
    coordinates: [74.7496, 19.0948],
    locationName: "Akole Tribal Block, Ahmednagar",
    gpsAccuracy: "±1.2m (Smart Inverter Telemetry)",
    budget: "₹1,800,000",
    evidenceCount: 16,
    description: "15kW rooftop solar panels with lithium battery bank verified online. Inverter IoT telemetry linked to FINX smart contract.",
  },
];

export function ValidatorActiveProjectsMap() {
  const [projects, setProjects] = useState<ValidatorActiveProject[]>(INITIAL_VALIDATOR_PROJECTS);
  const [selectedId, setSelectedId] = useState<string>("VAL-PUN-084");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [notification, setNotification] = useState<string | null>(null);
  const [proofsModalOpen, setProofsModalOpen] = useState(false);

  const selectedProject = projects.find((p) => p.id === selectedId) || projects[0];
  const currentProjectProofs = PROJECT_PROOFS_MAP[selectedProject.id] || [];

  const filteredProjects = projects.filter((p) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "Flagged") return p.status === "High Risk Flagged";
    if (statusFilter === "In Review") return p.status === "In Review";
    if (statusFilter === "Approved") return p.status === "Approved";
    return true;
  });

  const handleApprove = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Approved" as const, trustScore: Math.min(99, p.trustScore + 3) } : p))
    );
    setNotification(`Project ${id} successfully verified and signed by validator key!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleFlag = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "High Risk Flagged" as const } : p))
    );
    setNotification(`Project ${id} has been flagged for on-ground audit re-investigation.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleApproveProof = (proofId: string) => {
    setNotification(`Evidence ${proofId} verified and recorded on-chain!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleFlagProof = (proofId: string) => {
    handleFlag(selectedProject.id);
    setNotification(`Evidence ${proofId} flagged: Project ${selectedProject.id} set to High Risk.`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      {/* Top Banner with Validator Context */}
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/60 via-white to-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-sm ring-4 ring-blue-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Active Field Validation Projects</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                Maharashtra Audit Grid
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Government and independent validator geo-verification queue. Inspect GPS coordinates, audit documents, and release milestones.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {["All", "In Review", "Flagged", "Approved"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {notification && (
        <div className="bg-blue-700 text-white text-xs px-4 py-2 font-medium flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> {notification}
          </span>
          <button onClick={() => setNotification(null)} className="text-blue-200 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Main Container: Map (2/3) + Details Panel (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px] flex-1">
        {/* The White Background & Blue Roads Map */}
        <div className="lg:col-span-8 relative h-[380px] lg:h-auto w-full bg-white border-b lg:border-b-0 lg:border-r border-slate-200">
          <Map
            center={[selectedProject.coordinates[0], selectedProject.coordinates[1]]}
            zoom={9.5}
            styles={NATURAL_BLUE_STYLE}
            className="w-full h-full"
          >
            <MapControls position="top-right" showZoom showCompass showFullscreen />

            {/* Exclusive Validator Markers */}
            {filteredProjects.map((project) => {
              const isSelected = project.id === selectedId;
              const isHighRisk = project.status === "High Risk Flagged";

              return (
                <MapMarker
                  key={project.id}
                  longitude={project.coordinates[0]}
                  latitude={project.coordinates[1]}
                  onClick={() => setSelectedId(project.id)}
                >
                  <div className="cursor-pointer group flex flex-col items-center">
                    {/* Hover Callout */}
                    <div
                      className={`mb-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-blue-700 text-white ring-2 ring-blue-300 scale-105"
                          : "bg-white text-slate-800 border border-slate-200 opacity-95 group-hover:opacity-100 group-hover:border-blue-400"
                      }`}
                    >
                      <span>{project.title}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                          project.trustScore > 80
                            ? "bg-blue-100 text-blue-800"
                            : project.trustScore > 50
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {project.trustScore}/100
                      </span>
                    </div>

                    {/* Pin Icon */}
                    <div className="relative">
                      {isSelected && (
                        <div className="absolute -inset-2 bg-blue-500/30 rounded-full animate-ping pointer-events-none" />
                      )}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                          isSelected
                            ? "bg-blue-700 text-white ring-4 ring-blue-200 scale-110"
                            : isHighRisk
                            ? "bg-white text-blue-600 border-2 border-red-400"
                            : "bg-white text-blue-600 border-2 border-blue-600 group-hover:bg-blue-50"
                        }`}
                      >
                        {isHighRisk ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        ) : project.status === "Approved" ? (
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-blue-600" />
                        )}
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
              <span className="w-2 h-2 rounded-full bg-blue-700"></span> NGO Validator Grid
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-blue-600 rounded"></span> Expressways & Arterials
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-blue-300 rounded"></span> State Highways
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-white border border-slate-300"></span> Clean Canvas
              </span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Validator Audit Inspection Card */}
        <div className="lg:col-span-4 flex flex-col bg-slate-50/50 p-4 divide-y divide-slate-100 overflow-y-auto">
          <div className="pb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono font-bold text-blue-700 uppercase tracking-wider">
                {selectedProject.id}
              </span>
              <Badge
                variant={
                  selectedProject.status === "Approved"
                    ? "success"
                    : selectedProject.status === "High Risk Flagged"
                    ? "danger"
                    : "warning"
                }
              >
                {selectedProject.status}
              </Badge>
            </div>

            <h3 className="text-lg font-bold text-slate-900 leading-snug">{selectedProject.title}</h3>

            <div className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Implementing NGO: </span>
              <span className="font-semibold text-slate-800">{selectedProject.ngoName}</span>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedProject.locationName}</span>
            </div>

            {/* Trust Score & GPS Meter */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Trust Score</div>
                <div className="text-2xl font-bold font-mono text-blue-700 mt-0.5">
                  {selectedProject.trustScore}
                  <span className="text-xs text-slate-400 font-normal">/100</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">GPS Precision</div>
                <div className="text-xs font-mono font-bold text-slate-800 mt-1 truncate">
                  {selectedProject.gpsAccuracy}
                </div>
              </div>
            </div>

            {/* Audit Stage & Description */}
            <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200/80 text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-600 border-b border-slate-100 pb-1.5">
                <span className="font-medium">Active Stage:</span>
                <span className="font-bold text-blue-700">{selectedProject.stage}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 border-b border-slate-100 pb-1.5">
                <span className="font-medium">Escrow Budget:</span>
                <span className="font-mono font-bold text-slate-900">{selectedProject.budget}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="font-medium">Assigned Auditor:</span>
                <span className="font-medium text-slate-800">{selectedProject.assignedValidator}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-3 p-2.5 bg-blue-50/50 rounded-lg border border-blue-100 leading-relaxed">
              {selectedProject.description}
            </p>

            {/* Validator Audit Actions */}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => handleApprove(selectedProject.id)}
                disabled={selectedProject.status === "Approved"}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-bold text-xs transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                {selectedProject.status === "Approved" ? "Compliance Approved" : "Sign & Approve Milestone"}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setProofsModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-white border border-slate-300 hover:bg-blue-50/50 hover:border-blue-300 text-slate-700 hover:text-blue-800 rounded-lg font-medium text-xs transition shadow-2xs cursor-pointer group"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" /> Proofs ({currentProjectProofs.length || selectedProject.evidenceCount})
                </button>
                <button
                  onClick={() => handleFlag(selectedProject.id)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-white border border-amber-300 hover:bg-amber-50 text-amber-800 rounded-lg font-medium text-xs transition cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Flag Issue
                </button>
              </div>
            </div>
          </div>

          {/* Queue List */}
          <div className="pt-4 space-y-2.5 flex-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Audit Queue ({filteredProjects.length})</span>
              <span className="text-[10px] text-blue-600 font-medium">Select location</span>
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
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{p.id}</span>
                      <span className="text-xs font-bold text-slate-800 truncate">{p.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                      <span className="text-blue-700 font-medium">{p.ngoName}</span>
                      <span>&bull;</span>
                      <span className="font-mono text-slate-600">{p.budget}</span>
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

      {/* Geotagged Proof Files Modal */}
      <GeotagProofModal
        isOpen={proofsModalOpen}
        onClose={() => setProofsModalOpen(false)}
        projectId={selectedProject.id}
        projectTitle={selectedProject.title}
        ngoName={selectedProject.ngoName}
        locationName={selectedProject.locationName}
        proofs={currentProjectProofs}
        onApproveProof={handleApproveProof}
        onFlagProof={handleFlagProof}
      />
    </div>
  );
}
