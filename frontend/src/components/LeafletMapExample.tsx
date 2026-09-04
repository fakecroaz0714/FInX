"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Search, MapPin, Loader2, Compass, Navigation, X } from "lucide-react";
import { searchAddress, reverseGeocode, NominatimPlace } from "@/lib/nominatim";

// Dynamic import with SSR disabled
const LeafletMapInner = dynamic(() => import("./LeafletMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] flex items-center justify-center bg-slate-100 rounded-xl text-slate-400 text-sm animate-pulse">
      <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mr-2" />
      Loading OpenStreetMap Leaflet Engine...
    </div>
  ),
});

const PRESET_LOCATIONS = [
  { label: "Shirur (Pune CSR Site)", query: "Shirur, Pune, Maharashtra" },
  { label: "Pune", query: "Pune, Maharashtra, India" },
  { label: "Mumbai", query: "Mumbai, Maharashtra, India" },
  { label: "Bengaluru", query: "Bengaluru, Karnataka, India" },
  { label: "New Delhi", query: "New Delhi, Delhi, India" },
];

export function LeafletMapExample() {
  const [coords, setCoords] = useState<[number, number]>([18.5204, 73.8567]); // Pune
  const [zoom, setZoom] = useState<number>(13);
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<NominatimPlace[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isReverseLoading, setIsReverseLoading] = useState<boolean>(false);
  const [locationTitle, setLocationTitle] = useState<string>("Shirur Village CSR Site");
  const [locationDetails, setLocationDetails] = useState<string>(
    "Pune District, Maharashtra, India"
  );
  const [showResultsDropdown, setShowResultsDropdown] = useState<boolean>(false);

  // Handle Nominatim text search
  const handleSearch = async (searchTerm?: string) => {
    const q = (searchTerm !== undefined ? searchTerm : query).trim();
    if (!q || q.length < 2) return;

    setIsSearching(true);
    setShowResultsDropdown(true);

    try {
      const places = await searchAddress(q, 5);
      setResults(places);
    } catch (err) {
      console.error("Nominatim Search Error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Select a location from Nominatim search results
  const handleSelectLocation = (place: NominatimPlace) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);

    setCoords([lat, lon]);
    setZoom(14);
    setLocationTitle(place.name || place.display_name.split(",")[0]);
    setLocationDetails(place.display_name);
    setQuery(place.display_name.split(",")[0]);
    setShowResultsDropdown(false);
  };

  // Handle click on map -> Reverse geocode coordinates using Nominatim
  const handleMapClick = async (lat: number, lng: number) => {
    setCoords([lat, lng]);
    setIsReverseLoading(true);

    try {
      const place = await reverseGeocode(lat, lng);
      if (place) {
        setLocationTitle(
          place.address?.village ||
            place.address?.suburb ||
            place.address?.town ||
            place.address?.city ||
            "Pinpointed Location"
        );
        setLocationDetails(place.display_name);
      } else {
        setLocationTitle("Custom Coordinates");
        setLocationDetails(`${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E`);
      }
    } catch (err) {
      console.error("Nominatim Reverse Geocoding Error:", err);
      setLocationTitle("Selected Point");
      setLocationDetails(`${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E`);
    } finally {
      setIsReverseLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Nominatim Search Control Bar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <div className="relative max-w-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (!showResultsDropdown && e.target.value.length >= 3) {
                    handleSearch(e.target.value);
                  }
                }}
                onFocus={() => results.length > 0 && setShowResultsDropdown(true)}
                placeholder="Search village, city, district or CSR site with Nominatim..."
                className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                    setShowResultsDropdown(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </button>
          </form>

          {/* Autocomplete / Results Dropdown */}
          {showResultsDropdown && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto divide-y divide-slate-100">
              {results.map((place) => (
                <button
                  key={place.place_id}
                  type="button"
                  onClick={() => handleSelectLocation(place)}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-indigo-50/70 transition-colors flex items-start gap-2.5 text-xs text-slate-700"
                >
                  <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {place.name || place.display_name.split(",")[0]}
                    </p>
                    <p className="text-slate-500 text-[11px] truncate leading-normal">
                      {place.display_name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Location Chips */}
        <div className="flex items-center gap-1.5 flex-wrap mt-2.5 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Compass className="w-3 h-3 text-slate-400" /> Presets:
          </span>
          {PRESET_LOCATIONS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setQuery(preset.query);
                handleSearch(preset.query);
              }}
              className="px-2 py-0.5 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-full text-slate-600 transition-colors text-[11px]"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas */}
      <div className="px-4 pb-4">
        <div className="h-[440px] w-full rounded-xl overflow-hidden border border-slate-200 relative shadow-inner">
          <LeafletMapInner
            center={coords}
            zoom={zoom}
            markerTitle={locationTitle}
            markerDescription={locationDetails}
            onMapClick={handleMapClick}
          />

          {/* Reverse Geocoding Indicator */}
          {isReverseLoading && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-medium flex items-center gap-2 z-[1000] backdrop-blur-sm">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              Reverse-geocoding via Nominatim...
            </div>
          )}
        </div>

        {/* Selected Location Info Bar */}
        <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2 min-w-0">
            <Navigation className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{locationTitle}</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-mono font-medium border border-emerald-200">
                  OSM Geocoded
                </span>
              </div>
              <p className="text-slate-500 text-[11px] truncate max-w-xl mt-0.5">
                {locationDetails}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto font-mono text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100">
            <span>
              Lat: <strong className="text-slate-900">{coords[0].toFixed(5)}</strong>
            </span>
            <span>
              Lng: <strong className="text-slate-900">{coords[1].toFixed(5)}</strong>
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
          💡 <span className="font-semibold text-slate-500">Tip:</span> Click anywhere on the map to trigger instant Nominatim reverse-geocoding for that coordinate.
        </p>
      </div>
    </div>
  );
}
