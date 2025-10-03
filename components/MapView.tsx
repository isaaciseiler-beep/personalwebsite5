// components/MapView.tsx — FULL REPLACEMENT
// Theme-aware, smooth expand/collapse, fit-to-points, pulsing pins,
// click popups (location-only), custom zoom controls, no wheel zoom.
// Works even if some photos have no lat/lng.

"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, Popup, MapRef, ViewState, LngLatBounds } from "react-map-gl";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/types/project";

// ---- theme hook (reads <html data-theme="...">) -----------------------------
function useTheme(): "dark" | "light" {
  const [t, setT] = useState<"dark" | "light">(
    (typeof document !== "undefined" &&
      (document.documentElement.getAttribute("data-theme") as "dark" | "light")) || "dark"
  );
  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => {
      setT(el.getAttribute("data-theme") === "light" ? "light" : "dark");
    });
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return t;
}

// ---- helpers ----------------------------------------------------------------
function fitBoundsToPoints(points: Array<{ lng: number; lat: number }>) {
  if (points.length === 0) return undefined;
  if (points.length === 1) {
    return { longitude: points[0].lng, latitude: points[0].lat, zoom: 6 } as ViewState;
  }
  const b = new LngLatBounds();
  points.forEach((p) => b.extend([p.lng, p.lat]));
  const sw = b.getSouthWest();
  const ne = b.getNorthEast();
  // center
  const longitude = (sw.lng + ne.lng) / 2;
  const latitude = (sw.lat + ne.lat) / 2;
  return { longitude, latitude, zoom: 3.5 } as ViewState;
}

export default function MapView({
  photos,
  collapsedHeight = 220,
  expandedHeight = 420
}: {
  photos: Project[];
  collapsedHeight?: number;
  expandedHeight?: number;
}) {
  const theme = useTheme();
  const mapRef = useRef<MapRef | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [zoom, setZoom] = useState(3);
  const [sel, setSel] = useState<string | null>(null);

  const points = useMemo(
    () =>
      photos
        .filter((p) => typeof p.lat === "number" && typeof p.lng === "number")
        .map((p) => ({
          slug: p.slug,
          title: p.title,
          location: p.location,
          lng: Number(p.lng),
          lat: Number(p.lat)
        })),
    [photos]
  );

  const initial = useMemo(() => fitBoundsToPoints(points.map(({ lng, lat }) => ({ lng, lat }))), [points]);
  const mapStyle = theme === "light" ? "mapbox://styles/mapbox/light-v11" : "mapbox://styles/mapbox/dark-v11";

  // resize/fit on expand
  useEffect(() => {
    if (!mapRef.current) return;
    const id = window.setTimeout(() => {
      mapRef.current?.resize();
      if (points.length > 1 && initial) {
        mapRef.current?.fitBounds(
          [
            [Math.min(...points.map((p) => p.lng)), Math.min(...points.map((p) => p.lat))],
            [Math.max(...points.map((p) => p.lng)), Math.max(...points.map((p) => p.lat))]
          ],
          { padding: 40, duration: 300 }
        );
      }
    }, 260);
    return () => window.clearTimeout(id);
  }, [expanded, initial, points]);

  if (points.length === 0) return null;

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-subtle transition-[height] duration-200 ease-[cubic-bezier(.2,0,0,1)]"
      style={{ height: expanded ? expandedHeight : collapsedHeight }}
    >
      <Map
        ref={mapRef}
        initialViewState={initial || { longitude: points[0].lng, latitude: points[0].lat, zoom }}
        mapStyle={mapStyle}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
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
              mapRef.current?.flyTo({ zoom: z, duration: 200 });
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
              mapRef.current?.flyTo({ zoom: z, duration: 200 });
            }}
            className="rounded-md border border-subtle bg-[color:var(--color-bg)]/70 px-2 py-1 text-sm backdrop-blur hover:border-[color:var(--color-accent)]/60"
            aria-label="zoom out"
          >
            −
          </button>
        </div>

        {/* pulsing pins */}
        {points.map((p) => (
          <Marker key={p.slug} longitude={p.lng} latitude={p.lat}>
            <button
              className="relative h-3.5 w-3.5 rounded-full bg-white shadow-[0_0_0_2px_rgba(14,165,233,0.9)]"
              onClick={() => setSel(p.slug)}
              aria-label={`show ${p.location ?? p.title}`}
            >
              <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[color:var(--color-accent)]/40" />
            </button>
          </Marker>
        ))}

        {/* location-only popup */}
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

      {/* expand/collapse chevron (bottom-center) */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="absolute bottom-1 left-1/2 z-10 -translate-x-1/2 rounded-full border border-subtle bg-[color:var(--color-bg)]/70 px-2 py-0.5 text-xs backdrop-blur hover:border-[color:var(--color-accent)]/60"
        aria-label={expanded ? "minimize map" : "expand map"}
        title={expanded ? "minimize map" : "expand map"}
      >
        {expanded ? "▾" : "▴"}
      </button>
    </div>
  );
}
