"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, Popup, ViewState } from "react-map-gl";
import { useState } from "react";
import type { Project } from "@/types/project";

export default function MapView({ photos }: { photos: Project[] }) {
  const [popup, setPopup] = useState<Project | null>(null);

  const coords = photos.filter((p) => p.lat && p.lng);
  if (coords.length === 0) return null;

  const center = { longitude: coords[0].lng as number, latitude: coords[0].lat as number };

  return (
    <div className="overflow-hidden rounded-xl border border-subtle">
      <Map
        initialViewState={{ ...center, zoom: 3 } as ViewState}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: "100%", height: 360 }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >
        {coords.map((p) => (
          <Marker
            key={p.slug}
            longitude={p.lng as number}
            latitude={p.lat as number}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopup(p);
            }}
          >
            <div className="h-5 w-5 rounded-full bg-accent border-2 border-white shadow" />
          </Marker>
        ))}
        {popup && (
          <Popup
            longitude={popup.lng as number}
            latitude={popup.lat as number}
            onClose={() => setPopup(null)}
            closeOnClick={false}
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
