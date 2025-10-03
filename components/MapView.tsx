// components/MapView.tsx — FULL REPLACEMENT
"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import Map, { MapRef, Marker } from "react-map-gl";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/types/project";

/* theme watcher (client-safe) */
function useTheme(): "dark" | "light" {
  const [t, setT] = useState<"dark" | "light">("dark");
  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    const set = () =>
      setT(el.getAttribute("data-theme") === "light" ? "light" : "dark");
    set();
    const obs = new MutationObserver(set);
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return t;
}

export default function MapView({
  photos,
  collapsedHeight = 220,
  expandedHeight = 420,
}: {
  photos: Project[];
  collapsedHeight?: number;
  expandedHeight?: number;
}) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const theme = useTheme();
  const mapRef = useRef<MapRef | null>(null);

  const [expanded, setExpanded] = useState(false);
  const [zoom, setZoom] = useState(3);

  const points = useMemo(
    () =>
      (photos || [])
        .filter((p) => typeof p.lat === "number" && typeof p.lng === "number")
        .map((p) => ({
          slug: p.slug,
          title: p.title,
          location: p.location,
          lng: Number(p.lng),
          lat: Number(p.lat),
        })),
    [photos]
  );

  const initial =
    points.length > 0
      ? { longitude: points[0].lng, latitude: points[0].lat, zoom: 3 }
      : { longitude: 0, latitude: 20, zoom: 1.5 };

  const mapStyle =
    theme === "light"
      ? "mapbox://styles/mapbox/light-v11"
      : "mapbox://styles/mapbox/dark-v11";

  // ensure correct sizing on mount/expand
  useEffect(() => {
    const id = window.setTimeout(() => mapRef.current?.resize(), 160);
    return () => window.clearTimeout(id);
  }, [expanded]);

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-subtle transition-[height] duration-200 ease-[cubic-bezier(.2,0,0,1)]"
      style={{ height: expanded ? expandedHeight : collapsedHeight }}
    >
      {!token ? (
        <div className="flex h-full items-center justify-center text-sm text-muted">
          set NEXT_PUBLIC_MAPBOX_TOKEN to show the map
        </div>
      ) : (
        <Map
          ref={mapRef}
          initialViewState={initial}
          mapboxAccessToken={token}
          mapStyle={mapStyle}
          style={{ width: "100%", height: "100%" }}
          scrollZoom={false}
          doubleClickZoom={false}
          touchZoomRotate={false}
          dragRotate={false}
          attributionControl
        >
          {/* zoom controls (top-right) */}
          <div className="absolute right-2 top-2 z-10 flex flex-col gap-2">
            <button
              onClick={() => {
                const z = Math.min(14, zoom + 0.6);
                setZoom(z);
                mapRef.current?.flyTo({ zoom: z, duration: 220 });
              }}
              className="rounded-md border border-subtle bg-[color:var(--color-bg)]/70 px-2 py-1 text-sm backdrop-blur hover:border-[color:var(--color-accent)]/60"
              aria-label="zoom in"
            >
              +
            </button>
            <button
              onClick={() => {
                const z = Math.max(1, zoom - 0.6);
                setZoom(z);
                mapRef.current?.flyTo({ zoom: z, duration: 220 });
              }}
              className="rounded-md border border-subtle bg-[color:var(--color-bg)]/70 px-2 py-1 text-sm backdrop-blur hover:border-[color:var(--color-accent)]/60"
              aria-label="zoom out"
            >
              −
            </button>
          </div>

          {/* non-clickable, differentiated pins */}
          {points.map((p) => (
            <Marker key={p.slug} longitude={p.lng} latitude={p.lat}>
              <div className="pin">
                <span className="pin-core" />
                <span className="pin-ring" />
              </div>
            </Marker>
          ))}
        </Map>
      )}

      {/* expand / collapse */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="absolute bottom-1 left-1/2 z-10 -translate-x-1/2 rounded-full border border-subtle bg-[color:var(--color-bg)]/70 px-2 py-0.5 text-xs backdrop-blur hover:border-[color:var(--color-accent)]/60"
        aria-label={expanded ? "minimize map" : "expand map"}
        title={expanded ? "minimize map" : "expand map"}
      >
        {expanded ? "▾" : "▴"}
      </button>

      {/* attribution + pins styling */}
      <style jsx global>{`
        .mapboxgl-ctrl-attrib {
          background: none !important;
          font-size: 11px !important;
          color: rgba(231, 231, 234, 0.7) !important; /* light grey */
          letter-spacing: 0.02em;
          padding: 2px 6px !important;
        }
        .mapboxgl-ctrl-attrib a {
          color: rgba(231, 231, 234, 0.85) !important;
          text-decoration: none !important;
        }
        .mapboxgl-ctrl-attrib a:hover { text-decoration: underline !important; }

        .pin {
          position: relative;
          width: 18px; height: 18px;
        }
        .pin-core {
          position: absolute; inset: 3px;
          border-radius: 9999px;
          background: radial-gradient(circle at 30% 30%, #fff, #e2e8f0);
          box-shadow: 0 0 0 2px rgba(14,165,233,0.85), 0 4px 10px rgba(0,0,0,0.35);
        }
        .pin-ring {
          position: absolute; inset: 0; border-radius: 9999px;
          animation: pinPulse 1600ms ease-in-out infinite;
          background: radial-gradient(circle, rgba(14,165,233,0.28) 0%, rgba(14,165,233,0) 60%);
        }
        @keyframes pinPulse {
          0% { transform: scale(0.9); opacity: 0.7; }
          70% { transform: scale(1.2); opacity: 0; }
          100% { transform: scale(0.9); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
