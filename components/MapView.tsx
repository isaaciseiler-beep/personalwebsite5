// components/MapView.tsx — FULL REPLACEMENT
"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import Map, { MapRef, Marker } from "react-map-gl/mapbox";
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
    const obs = new MutationObserver(set);
    set();
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return t;
}

/* pin type */
type Pin = {
  slug: string;
  title: string;
  lat: number;
  lng: number;
};

/* build pins from projects with geo */
function usePins(projects: Project[]): Pin[] {
  return useMemo(
    () =>
      projects
        .filter((p) => p.location && typeof p.location.lat === "number" && typeof p.location.lng === "number")
        .map((p) => ({
          slug: p.slug,
          title: p.title,
          lat: p.location!.lat!,
          lng: p.location!.lng!,
        })),
    [projects]
  );
}

type Props = {
  projects: Project[];
  initialZoom?: number;
  className?: string;
};

export default function MapView({ projects, initialZoom = 2.6, className }: Props) {
  const theme = useTheme();
  const points = usePins(projects);

  const mapRef = useRef<MapRef | null>(null);
  const [zoom, setZoom] = useState(initialZoom);

  const styleUrl =
    theme === "light"
      ? "mapbox://styles/mapbox/light-v11"
      : "mapbox://styles/mapbox/dark-v11";

  // bounds from pins
  const bounds = useMemo<[number, number, number, number] | null>(() => {
    if (points.length === 0) return null;
    let minLng = Infinity,
      minLat = Infinity,
      maxLng = -Infinity,
      maxLat = -Infinity;
    for (const p of points) {
      if (p.lng < minLng) minLng = p.lng;
      if (p.lat < minLat) minLat = p.lat;
      if (p.lng > maxLng) maxLng = p.lng;
      if (p.lat > maxLat) maxLat = p.lat;
    }
    return [minLng, minLat, maxLng, maxLat];
  }, [points]);

  useEffect(() => {
    if (!mapRef.current || !bounds) return;
    // fit to bounds with padding
    try {
      mapRef.current.fitBounds(bounds, { padding: 80, duration: 600 });
    } catch {}
  }, [bounds]);

  return (
    <div className={className ?? ""}>
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle={styleUrl}
        initialViewState={{
          longitude: 0,
          latitude: 20,
          zoom: initialZoom,
        }}
        style={{ width: "100%", height: "520px", borderRadius: "12px" }}
        attributionControl={false}
      >
        {/* zoom controls */}
        <div className="pointer-events-auto absolute right-3 top-3 z-10 flex flex-col gap-2">
          <button
            onClick={() => {
              const z = Math.min(18, zoom + 0.6);
              setZoom(z);
              mapRef.current?.flyTo({ zoom: z, duration: 220 });
            }}
            className="rounded-md border border-subtle bg-[color:var(--color-elevated)] px-2 py-1 text-sm backdrop-blur hover:border-[color:var(--color-accent)]/60"
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
            className="rounded-md border border-subtle bg-[color:var(--color-elevated)] px-2 py-1 text-sm backdrop-blur hover:border-[color:var(--color-accent)]/60"
            aria-label="zoom out"
          >
            −
          </button>
        </div>

        {/* non-clickable, differentiated pins */}
        {points.map((p) => (
          <Marker key={p.slug} longitude={p.lng} latitude={p.lat} anchor="bottom">
            <div className="relative">
              <div className="pin-dot" />
              <div className="pin-stem" />
              <div className="pin-ring" />
              <div className="sr-only">{p.title}</div>
            </div>
          </Marker>
        ))}
      </Map>

      <style jsx global>{`
        .pin-dot {
          width: 10px;
          height: 10px;
          background: var(--color-accent);
          border: 2px solid rgba(255, 255, 255, 0.9);
          border-radius: 9999px;
          transform: translateY(2px);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        }
        .pin-stem {
          width: 2px;
          height: 12px;
          margin: 0 auto;
          background: var(--color-accent);
          transform: translateY(-2px);
          border-radius: 1px;
        }
        .pin-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          animation: pinPulse 1600ms ease-in-out infinite;
          background: radial-gradient(
            circle,
            rgba(14, 165, 233, 0.28) 0%,
            rgba(14, 165, 233, 0) 60%
          );
        }
        @keyframes pinPulse {
          0% {
            transform: scale(0.9);
            opacity: 0.7;
          }
          70% {
            transform: scale(1.2);
            opacity: 0;
          }
          100% {
            transform: scale(0.9);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
