"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, Popup, ViewState } from "react-map-gl";
import { useState } from "react";
import type { Project } from "@/types/project";

export default function MapView({ photos }: { photos: Project[] }) {
  const [popup, setPopup] = useState<Project | null>(null);

  const points = photos.filter(p => typeof p.lat === "number" && typeof p.lng === "number");
  if (points.length === 0) return null;

  const center = { longitude: points[0].lng as number, latitude: points[0].lat as number };

  return (
    <div className="overflow-hidden rounded-xl border border-subtle">
      <Map
        initialViewState={{ ...center, zoom: 3 } as ViewState}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: "100%", height: 360 }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >
        {points.map(p => (
          <Marker
            key={p.slug}
            longitude={p.lng as number}
            latitude={p.lat as number}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopup(p);
            }}
          >
            <div className="relative">
              <div className="h-3.5 w-3.5 rounded-full bg-white shadow-[0_0_0_2px_rgba(14,165,233,0.8)]" />
              <div className="absolute inset-0 rounded-full animate-ping bg-accent/40" />
            </div>
          </Marker>
        ))}
        {popup && (
          <Popup
            longitude={popup.lng as number}
            latitude={popup.lat as number}
            onClose={() => setPopup(null)}
            closeOnClick={false}
            offset={12}
          >
            <div className="text-sm">
              <div className="font-medium">{popup.title}</div>
              {popup.location && <div className="text-muted">{popup.location}</div>}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
