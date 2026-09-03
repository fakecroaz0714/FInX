"use client";

import { useState } from "react";
import { Map, MapControls, MapMarker } from "@/components/ui/map";
import { NATURAL_BLUE_STYLE } from "@/lib/mapStyles";
import { Badge } from "@/components/ui/Badge";
import {
  MapPin,
  Droplets,
  Sun,
  GraduationCap,
  HeartPulse,
  Lightbulb,
  ThumbsUp,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Layers,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export interface CitizenNearbyProject {
  id: string;
  title: string;
  category: "Water" | "Education" | "Healthcare" | "Solar" | "Sanitation";
  distance: string;
  coordinates: [number, number]; // [lng, lat]
  address: string;
  impact: string;
  votes: number;
  status: "Adopted by NGO" | "Milestone Active" | "Completed" | "Seeking Sponsor";
  ngoAdopted?: string;
  userVoted?: boolean;
}

const INITIAL_NEARBY_PROJECTS: CitizenNearbyProject[] = [
  {
    id: "CIT-PUN-01",
    title: "Solar Micro-Pump Irrigation",
    category: "Water",
    distance: "0.8 km",
    coordinates: [73.928, 18.5089],
    address: "Hadapsar Rural Ward, Pune",
    impact: "Supplies uninterrupted solar borehole water to 80 smallholder vegetable farms.",
    votes: 428,
    status: "Adopted by NGO",
    ngoAdopted: "Jal Seva Trust",
  },
  {
    id: "CIT-PUN-02",
    title: "Primary School Weatherproof Roof",
    category: "Education",
    distance: "1.4 km",
    coordinates: [73.8478, 18.5314],
    address: "Shivajinagar Municipal Block, Pune",
    impact: "Rebuilding reinforced roof tiles to stop monsoon flooding for 250 local students.",
    votes: 612,
    status: "Milestone Active",
    ngoAdopted: "EduCare Org",
  },
  {
    id: "CIT-PUN-03",
    title: "Community Health & Maternity Sub-Center",
    category: "Healthcare",
    distance: "2.3 km",
    coordinates: [73.805, 18.5074],
    address: "Kothrud South Sector, Pune",
    impact: "Refurbished triage clinic, cold storage for vaccines, and sanitised labor room.",
    votes: 540,
    status: "Completed",
    ngoAdopted: "HealthFirst Foundation",
  },
  {
    id: "CIT-PUN-04",
    title: "Solar Streetlights for Village Approach",
    category: "Solar",
    distance: "3.1 km",
    coordinates: [73.8062, 18.558],
    address: "Aundh Rural Extension, Pune",
    impact: "40 solar LED light poles installed across dark transit corridors for evening safety.",
    votes: 318,
    status: "Seeking Sponsor",
  },
  {
    id: "CIT-PUN-05",
    title: "Smart Clean Water Dispensing Kiosk",
    category: "Sanitation",
    distance: "4.0 km",
    coordinates: [73.9143, 18.5679],
    address: "Viman Nagar Peri-Urban Border, Pune",
    impact: "Reverse-osmosis water dispensing ATM supplying purified water at ₹1 per 20 litres.",
    votes: 275,
    status: "Milestone Active",
    ngoAdopted: "AquaPure Initiative",
  },
];

export function CitizenNearbyProjectsMap() {
  const [projects, setProjects] = useState<CitizenNearbyProject[]>(INITIAL_NEARBY_PROJECTS);
  const [selectedId, setSelectedId] = useState<string>("CIT-PUN-01");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const selectedProject = projects.find((p) => p.id === selectedId) || projects[0];

  const filteredProjects = projects.filter((p) => {
    if (categoryFilter === "All") return true;
    return p.category === categoryFilter;
  });

  const handleVote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const alreadyVoted = votedMap[id];
    setVotedMap((prev) => ({ ...prev, [id]: !alreadyVoted }));
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, votes: alreadyVoted ? p.votes - 1 : p.votes + 1 };
        }
        return p;
      })
    );
    setFeedbackMessage(
      alreadyVoted
        ? "Your endorsement was removed."
        : "Thank you! Your citizen petition endorsement has been registered."
    );
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const getCategoryIcon = (category: CitizenNearbyProject["category"]) => {
    switch (category) {
      case "Water":
        return <Droplets className="w-4 h-4 text-blue-600" />;
      case "Education":
        return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case "Healthcare":
        return <HeartPulse className="w-4 h-4 text-blue-600" />;
      case "Solar":
        return <Sun className="w-4 h-4 text-blue-600" />;
      case "Sanitation":
        return <Lightbulb className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      {/* Top Banner with Citizen Context */}
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/70 via-white to-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm ring-4 ring-blue-100">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Nearby Citizen Impact Projects</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                Pune Local Hub
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Showing grassroots projects within your geographic vicinity. Upvote local needs or report field progress.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {["All", "Water", "Education", "Healthcare", "Solar", "Sanitation"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                categoryFilter === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {feedbackMessage && (
        <div className="bg-blue-600 text-white text-xs px-4 py-2 font-medium flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> {feedbackMessage}
          </span>
          <button onClick={() => setFeedbackMessage(null)} className="text-blue-200 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Main Container: Map (2/3) + Interactive List (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px] flex-1">
        {/* The White Background & Blue Roads Map */}
        <div className="lg:col-span-8 relative h-[380px] lg:h-auto w-full bg-white border-b lg:border-b-0 lg:border-r border-slate-200">
          <Map
            center={[selectedProject.coordinates[0], selectedProject.coordinates[1]]}
            zoom={12.8}
            styles={NATURAL_BLUE_STYLE}
            className="w-full h-full"
          >
            <MapControls position="top-right" showZoom showCompass showFullscreen />

            {/* Render exclusive Citizen Markers */}
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
                    {/* Callout badge on hover / selection */}
                    <div
                      className={`mb-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-blue-600 text-white ring-2 ring-blue-300 scale-105"
                          : "bg-white text-slate-800 border border-slate-200 opacity-90 group-hover:opacity-100 group-hover:border-blue-400"
                      }`}
                    >
                      <span>{project.title}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-semibold">
                        {project.distance}
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
                        {getCategoryIcon(project.category)}
                      </div>
                    </div>
                  </div>
                </MapMarker>
              );
            })}
          </Map>

          {/* Map Legend Overlay */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-2.5 shadow-sm text-[11px] space-y-1.5 pointer-events-auto">
            <div className="font-bold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span> Citizen Portal Map
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-blue-600 rounded"></span> Blue Highway
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-blue-300 rounded"></span> Local Road
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-white border border-slate-300"></span> White Land
              </span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Selected Project Details & Citizen Actions */}
        <div className="lg:col-span-4 flex flex-col bg-slate-50/50 p-4 divide-y divide-slate-100 overflow-y-auto">
          {/* Active Project Highlight */}
          <div className="pb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5" /> {selectedProject.distance} away
              </span>
              <Badge
                variant={
                  selectedProject.status === "Completed"
                    ? "success"
                    : selectedProject.status === "Milestone Active"
                    ? "default"
                    : selectedProject.status === "Adopted by NGO"
                    ? "neutral"
                    : "warning"
                }
              >
                {selectedProject.status}
              </Badge>
            </div>

            <h3 className="text-lg font-bold text-slate-900 leading-snug">{selectedProject.title}</h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {selectedProject.address}
            </p>

            <p className="text-xs text-slate-600 mt-3 p-3 bg-white rounded-xl border border-slate-200/80 leading-relaxed shadow-xs">
              {selectedProject.impact}
            </p>

            {selectedProject.ngoAdopted && (
              <div className="mt-3 flex items-center justify-between text-xs p-2.5 bg-blue-50/60 rounded-lg border border-blue-100 text-blue-900">
                <span className="text-slate-600">Adopted By NGO:</span>
                <span className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> {selectedProject.ngoAdopted}
                </span>
              </div>
            )}

            {/* Citizen Endorsement & Actions */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={(e) => handleVote(selectedProject.id, e)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all shadow-xs ${
                  votedMap[selectedProject.id]
                    ? "bg-blue-600 text-white shadow-blue-200"
                    : "bg-white text-slate-700 border border-slate-300 hover:border-blue-500 hover:text-blue-600"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                {votedMap[selectedProject.id] ? "Endorsed!" : "Endorse Petition"} ({selectedProject.votes})
              </button>

              <button
                onClick={() =>
                  alert(`Reporting field progress for "${selectedProject.title}". Thank you for your on-ground civic input!`)
                }
                className="py-2.5 px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                title="Confirm field progress or submit photo evidence"
              >
                Confirm Ground Reality
              </button>
            </div>
          </div>

          {/* List of other nearby projects */}
          <div className="pt-4 space-y-2.5 flex-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Other Nearby Projects ({filteredProjects.length})</span>
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
                      ? "bg-white border-blue-500 shadow-sm ring-2 ring-blue-100"
                      : "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/20"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                      {getCategoryIcon(p.category)}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-800 truncate">{p.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-blue-700">{p.distance}</span>
                        <span>&bull;</span>
                        <span>{p.votes} endorsements</span>
                      </div>
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
