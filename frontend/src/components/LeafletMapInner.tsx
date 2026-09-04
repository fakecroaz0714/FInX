"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix standard Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapInnerProps {
  center: [number, number];
  zoom: number;
  markerTitle: string;
  markerDescription: string;
  onMapClick?: (lat: number, lng: number) => void;
}

function MapController({ center, zoom, onMapClick }: {
  center: [number, number];
  zoom: number;
  onMapClick?: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);

  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
}

export default function LeafletMapInner({
  center,
  zoom,
  markerTitle,
  markerDescription,
  onMapClick,
}: MapInnerProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Nominatim Search'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController center={center} zoom={zoom} onMapClick={onMapClick} />
      <Marker position={center}>
        <Popup>
          <div className="p-1 max-w-xs space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">{markerTitle}</h4>
            <p className="text-xs text-slate-600 leading-snug">{markerDescription}</p>
            <div className="text-[10px] font-mono text-indigo-600 pt-1 border-t border-slate-100">
              {center[0].toFixed(5)}° N, {center[1].toFixed(5)}° E
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
