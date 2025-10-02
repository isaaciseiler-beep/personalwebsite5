"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, Popup, ViewState } from "react-map-gl";
import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/types/project";

function useTheme(): "dark" | "light" {
  const [t, setT] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const el = document.documentElement;
    const cb = () => setT(el.getAttribute("data-theme") === "light" ? "light" : "dark");
    const obs = new MutationObserver(cb); cb();
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return t;
}

export default function MapView({ photos }: { photos: Project[] }) {
  const theme = useTheme();
  const points = useMemo(() => photos.filter(p => typeof p.lat === "number" && typeof p.lng === "number"), [photos]);
  if (points.length === 0) return null;

  const center = { longitude: points[0].lng as number, latitude: points[0].lat as number };
  const styleId = theme === "light" ? "mapbox://styles/mapbox/light-v11" : "mapbox://styles/mapbox/dark-v11";

  return (
    <div className="overflow-hidden rounded-xl border border-subtle">
      <Map
        initialViewState={{ ...center, zoom: 3 } as ViewState}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: "100%", height: 360 }}
        mapStyle={styleId}
      >
        {points.map(p => (
          <Marker key={p.slug} longitude={p.lng as number} latitude={p.lat as number}>
            <div className="relative">
              <div className={`h-3.5 w-3.5 rounded-full ${theme === "light" ? "bg-[var(--color-fg)]" : "bg-white"} shadow-[0_0_0_2px_rgba(14,165,233,0.8)]`} />
              <div className="absolute inset-0 rounded-full animate-ping bg-[color:var(--color-accent)]/40" />
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
