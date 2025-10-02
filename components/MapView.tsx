"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, Popup, MapRef } from "react-map-gl";
import { useEffect, useMemo, useRef, useState } from "react";
import { m } from "framer-motion";
import type { Project } from "@/types/project";

/* theme watcher */
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
  expanded = false,
  onToggle
}: {
  photos: Project[];
  expanded?: boolean;
  onToggle?: () => void;
}) {
  const theme = useTheme();

  /* hooks must run unconditionally */
  const points = useMemo(
    () => photos.filter(p => typeof p.lat === "number" && typeof p.lng === "number"),
    [photos]
  );
  const mapRef = useRef<MapRef | null>(null);
  const [zoom, setZoom] = useState(3);

  const center = useMemo(() => {
    if (points.length > 0) {
      return { longitude: points[0].lng as number, latitude: points[0].lat as number };
    }
    return { longitude: 0, latitude: 0 };
  }, [points]);

  const styleId =
    theme === "light" ? "mapbox://styles/mapbox/light-v11" : "mapbox://styles/mapbox/dark-v11";

  const zoomBy = (delta: number) => {
    const z = Math.min(14, Math.max(1, zoom + delta));
    setZoom(z);
    mapRef.current?.flyTo({ zoom: z, duration: 200 });
  };

  /* render even when no points to keep layout stable */
  if (points.length === 0) {
    return (
      <m.div
        className="relative overflow-hidden rounded-xl border border-subtle"
        initial={false}
        animate={{ height: expanded ? 420 : 220 }}
        transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
        style={{ height: expanded ? 420 : 220 }}
      >
        {/* chevron toggle only */}
        <button
          onClick={onToggle}
          className="absolute inset-x-0 bottom-0 z-10 mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--color-bg)]/70 text-[color:var(--color-fg)] backdrop-blur hover:bg-[color:var(--color-bg)]/85"
          aria-label={expanded ? "minimize map" : "expand map"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            {expanded ? (
              <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </m.div>
    );
  }

  return (
    <m.div
      className="relative overflow-hidden rounded-xl border border-subtle"
      initial={false}
      animate={{ height: expanded ? 420 : 220 }}
      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
      style={{ height: expanded ? 420 : 220 }}
    >
      <Map
        ref={mapRef}
        initialViewState={{ ...center, zoom }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
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

        {/* pulsing pins */}
        {points.map(p => (
          <Marker key={p.slug} longitude={p.lng as number} latitude={p.lat as number}>
            <div className="relative">
              <div className="h-3.5 w-3.5 rounded-full bg-white shadow-[0_0_0_2px_rgba(14,165,233,0.9)]" />
              <div className="absolute inset-0 rounded-full animate-ping bg-[color:var(--color-accent)]/40" />
            </div>
          </Marker>
        ))}

        {/* location-only popups */}
        {points.map(
          p =>
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

      {/* bottom gradient when minimized */}
      {!expanded && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0), var(--color-bg))" }}
        />
      )}

      {/* chevron toggle */}
      <button
        onClick={onToggle}
        className="absolute inset-x-0 bottom-0 z-10 mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--color-bg)]/70 text-[color:var(--color-fg)] backdrop-blur hover:bg-[color:var(--color-bg)]/85"
        aria-label={expanded ? "minimize map" : "expand map"}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          {expanded ? (
            <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
      </button>
    </m.div>
  );
}
