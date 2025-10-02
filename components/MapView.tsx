"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, Popup, ViewState } from "react-map-gl";
import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/types/project";

function useTheme(): "dark" | "light" {
  const [theme, setTheme] = useState<"dark" | "light">(
    (typeof document !== "undefined" &&
      (document.documentElement.getAttribute("data-theme") as "dark" | "light")) || "dark"
  );

  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => {
      const t = el.getAttribute("data-theme") === "light" ? "light" : "dark";
      setTheme(t);
    });
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  return theme;
}

export default function MapView({ photos }: { photos: Project[] }) {
  const theme = useTheme();

  const points = useMemo(
    () => photos.filter(p => typeof p.lat === "number" && typeof p.lng === "number"),
    [photos]
  );
  if (points.length === 0) return null;

  const center = { longitude: points[0].lng as number, latitude: points[0].lat as number };
  const styleId = theme === "light" ? "mapbox://styles/mapbox/light-v11" : "mapbox://styles/mapbox/dark-v11";

  const pinInner = theme === "light" ? "bg-[var(--color-fg)]" : "bg-white";
  const pinRing =
    theme === "light"
      ? "shadow-[0_0_0_2px_rgba(14,165,233,0.8)]"
      : "shadow-[0_0_0_2px_rgba(14,165,233,0.8)]";

  return (
    <div className="overflow-hidden rounded-xl border border-subtle">
      <Map
        initialViewState={{ ...center, zoom: 3 } as ViewState}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: "100%", height: 360 }}
        mapStyle={styleId}
      >
        {points.map(p => (
          <Marker
            key={p.slug}
            longitude={p.lng as number}
            latitude={p.lat as number}
            onClick={e => {
              e.originalEvent.stopPropagation();
            }}
          >
            <div className="relative">
              <div className={`h-3.5 w-3.5 rounded-full ${pinInner} ${pinRing}`} />
              <div className="absolute inset-0 rounded-full animate-ping bg-[color:var(--color-accent)]/40" />
            </div>
          </Marker>
        ))}

        {/* optional popup example (click-to-open could be added if desired)
        {popup && (
          <Popup ...>...</Popup>
        )} */}
      </Map>
    </div>
  );
}
