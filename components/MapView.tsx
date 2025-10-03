// components/MapView.tsx — FULL REPLACEMENT (client-safe, no SSR "document")
"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import Map, { MapRef, Marker, Popup } from "react-map-gl";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/types/project";

function useTheme(): "dark" | "light" {
  const [t, setT] = useState<"dark" | "light">("dark"); // default, updated after mount
  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    const set = () => setT(el.getAttribute("data-theme") === "light" ? "light" : "dark");
    set();
    const obs = new MutationObserver(set);
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return t;
}

export default function MapView({
  photos,
  height = 220,
}: {
  photos: Project[];
  height?: number;
}) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const theme = useTheme();
  const mapRef = useRef<MapRef | null>(null);
  const [sel, setSel] = useState<string | null>(null);

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
    theme === "light" ? "mapbox://styles/mapbox/light-v11" : "mapbox://styles/mapbox/dark-v11";

  // ensure canvas sizes correctly on mount
  useEffect(() => {
    const id = window.setTimeout(() => mapRef.current?.resize(), 150);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl border border-subtle" style={{ height }}>
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
          {points.map((p) => (
            <Marker key={p.slug} longitude={p.lng} latitude={p.lat}>
              <button
                className="relative h-3.5 w-3.5 rounded-full bg-white shadow-[0_0_0_2px_rgba(14,165,233,0.9)]"
                aria-label={`show ${p.location ?? p.title}`}
                onClick={() => setSel(p.slug)}
              >
                <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[color:var(--color-accent)]/40" />
              </button>
            </Marker>
          ))}
          {sel &&
            (() => {
              const p = points.find((x) => x.slug === sel)!;
              return (
                <Popup
                  longitude={p.lng}
                  latitude={p.lat}
                  onClose={() => setSel(null)}
                  closeButton
                  closeOnClick={false}
                  offset={10}
                  anchor="bottom"
                >
                  <div className="text-sm">{p.location ?? p.title}</div>
                </Popup>
              );
            })()}
        </Map>
      )}
      {token && points.length === 0 && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-muted">
          no geotagged photos to show
        </div>
      )}
    </div>
  );
}
