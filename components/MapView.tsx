"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Project } from "@/types/project";
import { useMemo } from "react";

const icon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='#0ea5e9'><path d='M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z'/></svg>`
    ),
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -22],
});

export default function MapView({ photos }: { photos: Project[] }) {
  const points = useMemo(
    () => photos.filter(p => typeof p.lat === "number" && typeof p.lng === "number"),
    [photos]
  );

  if (points.length === 0) return null;

  const center = [points[0].lat as number, points[0].lng as number] as [number, number];

  return (
    <div className="overflow-hidden rounded-xl border border-subtle">
      <MapContainer
        center={center}
        zoom={4}
        scrollWheelZoom={false}
        style={{ height: 360, width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {points.map(p => (
          <Marker key={p.slug} position={[p.lat as number, p.lng as number]} icon={icon}>
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
