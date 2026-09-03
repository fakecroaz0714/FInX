"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Eye,
  Camera,
  MapPin,
  Compass,
  Crosshair,
  Calendar,
  Clock,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  ZoomIn,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Layers,
  FileCheck,
  Hash,
  Activity,
  Cpu,
} from "lucide-react";

export interface GeotagProof {
  id: string;
  title: string;
  imageUrl: string;
  timestamp: string;
  lat: number;
  lng: number;
  altitude: string;
  azimuth: string;
  device: string;
  accuracy: string;
  status: "verified" | "flagged" | "in_review";
  statusReason?: string;
  ipfsHash: string;
  sha256: string;
  surveyor: string;
  milestone: string;
  notes: string;
}

interface GeotagProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
  ngoName: string;
  locationName: string;
  proofs: GeotagProof[];
  onApproveProof?: (proofId: string) => void;
  onFlagProof?: (proofId: string) => void;
}

export function GeotagProofModal({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  ngoName,
  locationName,
  proofs,
  onApproveProof,
  onFlagProof,
}: GeotagProofModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHudOverlay, setShowHudOverlay] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset index when modal opens with new proofs
  useEffect(() => {
    setCurrentIndex(0);
    setIsZoomed(false);
  }, [projectId, isOpen]);

  // Keyboard navigation & ESC handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : proofs.length - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev < proofs.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, proofs.length, onClose]);

  if (!isOpen || proofs.length === 0) return null;

  const currentProof = proofs[currentIndex] || proofs[0];

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isFlagged = currentProof.status === "flagged";
  const isVerified = currentProof.status === "verified";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-6xl max-h-[94vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:px-6 py-3.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                  {projectId}
                </span>
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {projectTitle}
                </h3>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isFlagged
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : isVerified
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {isFlagged ? "GPS Discrepancy Flagged" : isVerified ? "Cadastral Verified" : "Review Pending"}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                NGO: <span className="font-semibold text-slate-700">{ngoName}</span> &bull; Location:{" "}
                <span className="font-semibold text-slate-700">{locationName}</span> &bull; Proof{" "}
                {currentIndex + 1} of {proofs.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHudOverlay(!showHudOverlay)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                showHudOverlay
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              {showHudOverlay ? "Surveyor HUD: ON" : "Surveyor HUD: OFF"}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Warning Banner if Discrepancy detected */}
        {isFlagged && (
          <div className="px-6 py-2.5 bg-rose-50 border-b border-rose-200 text-rose-900 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">
                <strong>Discrepancy Detected:</strong> {currentProof.statusReason || "GPS metadata diverges from registered project boundaries."}
              </span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-800 shrink-0">
              Action Required
            </span>
          </div>
        )}

        {/* Main Body Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {/* Left Column: Image Viewer (lg:col-span-7) */}
          <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col bg-slate-900 justify-between">
            {/* Image Container with HUD */}
            <div className="relative flex-1 min-h-[340px] sm:min-h-[420px] rounded-xl overflow-hidden bg-black/40 flex items-center justify-center border border-slate-800 group select-none">
              {/* Actual Image */}
              <img
                src={currentProof.imageUrl}
                alt={currentProof.title}
                className={`w-full h-full object-contain transition-transform duration-300 ${
                  isZoomed ? "scale-125 cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              {/* Prev / Next Navigation Arrows */}
              {proofs.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : proofs.length - 1));
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition shadow-md opacity-80 hover:opacity-100"
                    title="Previous Proof (Left Arrow)"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex((prev) => (prev < proofs.length - 1 ? prev + 1 : 0));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition shadow-md opacity-80 hover:opacity-100"
                    title="Next Proof (Right Arrow)"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Top Controls Overlay */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                <a
                  href={currentProof.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white/90 hover:text-white backdrop-blur-sm transition text-xs flex items-center gap-1"
                  title="Open Raw Proof Image"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </a>
                <a
                  href={currentProof.imageUrl}
                  download={`geotag-proof-${currentProof.id}.jpg`}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white/90 hover:text-white backdrop-blur-sm transition text-xs flex items-center gap-1"
                  title="Download Proof File"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Live Surveyor Camera HUD Overlay */}
              {showHudOverlay && (
                <div className="absolute inset-0 pointer-events-none p-3 sm:p-4 flex flex-col justify-between">
                  {/* Top HUD Line */}
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-emerald-400 tracking-wider bg-black/40 backdrop-blur-xs p-1.5 rounded-md self-start border border-emerald-500/30">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      FINX GEO-EXIF VERIFIER &bull; PROOF #{currentProof.id}
                    </span>
                  </div>

                  {/* Center Crosshair */}
                  <div className="self-center flex flex-col items-center justify-center opacity-40">
                    <div className="w-12 h-12 border border-dashed border-white/60 rounded-full flex items-center justify-center">
                      <Crosshair className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Bottom HUD Box (Solocator style) */}
                  <div className="p-2.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] leading-relaxed shadow-lg max-w-sm">
                    <div className="text-amber-400 font-bold flex items-center gap-1.5 border-b border-white/10 pb-1 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {currentProof.lat.toFixed(5)}° N, {currentProof.lng.toFixed(5)}° E
                      </span>
                      <span className="ml-auto text-[10px] text-slate-300 font-normal">
                        ALT: {currentProof.altitude}
                      </span>
                    </div>
                    <div className="text-slate-300 flex justify-between text-[10px]">
                      <span>AZI: {currentProof.azimuth}</span>
                      <span>TIME: {currentProof.timestamp}</span>
                    </div>
                    <div className="text-slate-400 text-[10px] truncate mt-0.5">
                      DEV: {currentProof.device} &bull; ACC:{" "}
                      <span className={isFlagged ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                        {currentProof.accuracy}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
              {proofs.map((proof, idx) => {
                const isSelected = idx === currentIndex;
                const proofFlagged = proof.status === "flagged";
                return (
                  <button
                    key={proof.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsZoomed(false);
                    }}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all group ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-400/40"
                        : "border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-500"
                    }`}
                  >
                    <img
                      src={proof.imageUrl}
                      alt={proof.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                      <span className="text-[9px] font-mono font-bold text-white truncate">
                        #{idx + 1}
                      </span>
                      {proofFlagged && (
                        <AlertTriangle className="w-3 h-3 text-rose-400 ml-auto shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: EXIF Telemetry & Forensic Review (lg:col-span-5) */}
          <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto bg-slate-50/50 space-y-5">
            <div className="space-y-4">
              {/* Active Proof Title */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {currentProof.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {currentProof.milestone}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-1">
                  {currentProof.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {currentProof.notes}
                </p>
              </div>

              {/* Forensic EXIF & Telemetry Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600" /> Embedded Geotag Metadata
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    EXIF 2.32
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* GPS Latitude/Longitude */}
                  <div className="col-span-2 p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">GPS Coordinates</div>
                      <div className="font-mono font-bold text-slate-800 mt-0.5">
                        {currentProof.lat.toFixed(6)}° N, {currentProof.lng.toFixed(6)}° E
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(`${currentProof.lat}, ${currentProof.lng}`, "coords")}
                      className="p-1.5 rounded hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 transition"
                      title="Copy Coordinates"
                    >
                      {copiedField === "coords" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Altitude & Heading */}
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Elevation / Azimuth</div>
                    <div className="font-mono font-bold text-slate-800 mt-0.5">
                      {currentProof.altitude} &bull; {currentProof.azimuth}
                    </div>
                  </div>

                  {/* Accuracy Status */}
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Cadastral Precision</div>
                    <div
                      className={`font-mono font-bold mt-0.5 text-[11px] truncate ${
                        isFlagged ? "text-rose-700" : "text-emerald-700"
                      }`}
                    >
                      {currentProof.accuracy}
                    </div>
                  </div>

                  {/* Hardware Device */}
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Capturing Device</div>
                    <div className="font-semibold text-slate-800 mt-0.5 truncate text-[11px]">
                      {currentProof.device}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Timestamp (IST)</div>
                    <div className="font-mono text-slate-800 mt-0.5 text-[11px] truncate">
                      {currentProof.timestamp}
                    </div>
                  </div>
                </div>

                {/* Field Surveyor */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Field Surveyor:
                  </span>
                  <span className="font-semibold text-slate-800">{currentProof.surveyor}</span>
                </div>
              </div>

              {/* Cryptographic Proof & Smart Contract CID */}
              <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-600" /> On-Chain Attestation
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Polygon PoS L2
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">IPFS CID:</span>
                    <div className="flex items-center gap-1 font-mono text-slate-700">
                      <span className="truncate max-w-[170px]">{currentProof.ipfsHash}</span>
                      <button
                        onClick={() => handleCopy(currentProof.ipfsHash, "ipfs")}
                        className="p-1 hover:text-blue-600"
                        title="Copy IPFS Hash"
                      >
                        {copiedField === "ipfs" ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">SHA-256 Digest:</span>
                    <div className="flex items-center gap-1 font-mono text-slate-700">
                      <span className="truncate max-w-[170px]">
                        {currentProof.sha256.slice(0, 16)}...{currentProof.sha256.slice(-8)}
                      </span>
                      <button
                        onClick={() => handleCopy(currentProof.sha256, "sha256")}
                        className="p-1 hover:text-blue-600"
                        title="Copy SHA-256"
                      >
                        {copiedField === "sha256" ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Auditor Actions Footer */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onApproveProof?.(currentProof.id)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve Evidence
                </button>
                <button
                  onClick={() => onFlagProof?.(currentProof.id)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-800 font-bold text-xs transition"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Flag Discrepancy
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
