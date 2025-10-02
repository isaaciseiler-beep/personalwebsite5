"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import * as L from "leaflet";
import type { Project } from "@/types/project";
import { useMemo } from "react";

const pinSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'>
  <defs>
    <filter id='s' x='-50%' y='-50%' width='200%' height='200%'>
      <feDropShadow dx='0' dy='1' stdDeviation='1.2' flood-color='rgba(0,0,0,0.6)'/>
    </filter>
  </defs>
  <path d='M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z' fill='#ffffff' stroke='#0a0a0a' stroke-width='1.5' filter='url(#s)'/>
  <circle cx='12' cy='9.5' r='2.6' fill='#0a0a0a'/>
</svg>`;

const icon = new L.Icon({
  iconUrl: "data:image/svg+xml;utf8," + encodeURIComponent(pinSvg),
  iconSize: [28, 28],
  iconAnchor: [14, 26],
  popupAnchor: [0, -24]
});

export default function MapView({ photos }: { photos: Project[] }) {
  const points = useMemo(
    () =>
      photos.filter(
        (p) => typeof p.lat === "number" && typeof p.lng === "number"
      ),
    [photos]
  );

  if (points.length === 0) return null;

  const center = [
    points[0].lat as number,
    points[0].lng as number
  ] as [number, number];

  return (
    <div className="relative z-0 overflow-hidden rounded-xl border border-subtle">
      <MapContainer
        center={center}
        zoom={4}
        scrollWheelZoom={false}
        zoomControl={true}
        className="monochrome-map"
        style={{ height: 360, width: "100%" }}
      >
        <TileLayer
          // OSM tiles, styled via CSS filters for monochrome
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {points.map((p) => (
          <Marker
            key={p.slug}
            position={[p.lat as number, p.lng as number]}
            icon={icon}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-medium">{p.title}</div>
                {p.location && <div className="text-muted">{p.location}</div>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
