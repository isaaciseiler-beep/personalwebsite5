// components/MapView.tsx — FULL REPLACEMENT
"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, Popup, MapRef } from "react-map-gl";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/types/project";

function useTheme(): "dark" | "light" {
  const [t, setT] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const el = document.documentElement;
    const cb = () => setT(el.getAttribute("data-theme") === "light" ? "light" : "dark");
    cb();
    const obs = new MutationObserver(cb);
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return t;
}

export default function MapView({
  photos,
  expanded = false
}: {
  photos: Project[];
  expanded?: boolean;
}) {
  const theme = useTheme();
  const points = useMemo(
    () => photos.filter((p) => typeof p.lat === "number" && typeof p.lng === "number"),
    [photos]
  );
  const styleId =
    theme === "light" ? "mapbox://styles/mapbox/light-v11" : "mapbox://styles/mapbox/dark-v11";

  // hooks must run unconditionally
  const mapRef = useRef<MapRef | null>(null);
  const [zoom, setZoom] = useState(3);

  const center = useMemo(() => {
    if (points.length > 0) return { longitude: points[0].lng as number, latitude: points[0].lat as number };
    // default center (Pacific) if no points; component will return null below
    return { longitude: 0, latitude: 0 };
  }, [points]);

  const zoomBy = (delta: number) => {
    const z = Math.min(14, Math.max(1, zoom + delta));
    setZoom(z);
    mapRef.current?.flyTo({ zoom: z, duration: 200 });
  };

  if (points.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-subtle">
      <Map
        ref={mapRef}
        initialViewState={{ ...center, zoom }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: "100%", height: expanded ? 420 : 220 }}
        mapStyle={styleId}
        scrollZoom={false}
        doubleClickZoom={false}
        touchZoomRotate={false}
        dragRotate={false}
      >
        {/* zoom controls */}
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-2">
          <button
            onClick={() => zoomBy(+0.6)}
            className="rounded-md bg-[color:var(--color-bg)]/70 px-2 py-1 text-sm backdrop-blur hover:bg-[color:var(--color-bg)]/85"
            aria-label="zoom in"
          >
            +
          </button>
          <button
            onClick={() => zoomBy(-0.6)}
            className="rounded-md bg-[color:var(--color-bg)]/70 px-2 py-1 text-sm backdrop-blur hover:bg-[color:var(--color-bg)]/85"
            aria-label="zoom out"
          >
            −
          </button>
        </div>

        {/* dynamic pins */}
        {points.map((p) => (
          <Marker key={p.slug} longitude={p.lng as number} latitude={p.lat as number}>
            <div className="relative">
              <div className="h-3.5 w-3.5 rounded-full bg-white shadow-[0_0_0_2px_rgba(14,165,233,0.9)]" />
              <div className="absolute inset-0 rounded-full animate-ping bg-[color:var(--color-accent)]/40" />
            </div>
          </Marker>
        ))}

        {/* location-only popups (simple, defined) */}
        {points.map(
          (p) =>
            p.location && (
              <Popup
                key={`${p.slug}-popup`}
                longitude={p.lng as number}
                latitude={p.lat as number}
                closeButton={false}
                offset={16}
                anchor="bottom"
              >
                <div className="popup-card">{p.location}</div>
              </Popup>
            )
        )}
      </Map>
    </div>
  );
}
