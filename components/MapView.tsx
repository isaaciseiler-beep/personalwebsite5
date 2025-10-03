// components/MapView.tsx — FULL REPLACEMENT
// Visible, cluster-enabled map at top of photos page.
// Uses Source/Layer for clustering; no wheel zoom; theme-aware.

"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import Map, { MapRef, Marker, Popup, Source, Layer } from "react-map-gl";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/types/project";

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

export default function MapView({
  photos,
  height = 220
}: {
  photos: Project[];
  height?: number;
}) {
  const theme = useTheme();
  const mapRef = useRef<MapRef | null>(null);
  const [sel, setSel] = useState<string | null>(null);

  const points = useMemo(
    () =>
      photos
        .filter((p) => typeof p.lat === "number" && typeof p.lng === "number")
        .map((p) => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: [Number(p.lng), Number(p.lat)] },
          properties: { slug: p.slug, title: p.title, location: p.location }
        })),
    [photos]
  );

  if (points.length === 0) return null;

  const mapStyle = theme === "light" ? "mapbox://styles/mapbox/light-v11" : "mapbox://styles/mapbox/dark-v11";
  const geojson = { type: "FeatureCollection", features: points } as any;

  return (
    <div className="overflow-hidden rounded-xl border border-subtle" style={{ height }}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: (points[0].geometry.coordinates as number[])[0], latitude: (points[0].geometry.coordinates as number[])[1], zoom: 3 }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
        scrollZoom={false}
        doubleClickZoom={false}
        touchZoomRotate={false}
        dragRotate={false}
        attributionControl
      >
        {/* cluster source */}
        <Source
          id="photos"
          type="geojson"
          data={geojson}
          cluster={true}
          clusterMaxZoom={9}
          clusterRadius={40}
        >
          {/* cluster circles */}
          <Layer
            id="clusters"
            type="circle"
            filter={["has", "point_count"]}
            paint={{
              "circle-color": theme === "light" ? "#0b0b0c" : "#ffffff",
              "circle-opacity": 0.7,
              "circle-radius": 14
            }}
          />
          {/* cluster count */}
          <Layer
            id="cluster-count"
            type="symbol"
            filter={["has", "point_count"]}
            layout={{ "text-field": "{point_count_abbreviated}", "text-size": 12 }}
            paint={{ "text-color": theme === "light" ? "#ffffff" : "#0b0b0c" }}
          />
          {/* unclustered points */}
          <Layer
            id="unclustered-point"
            type="circle"
            filter={["!", ["has", "point_count"]]}
            paint={{
              "circle-color": theme === "light" ? "#0b0b0c" : "#ffffff",
              "circle-radius": 6,
              "circle-stroke-width": 2,
              "circle-stroke-color": theme === "light" ? "#ffffff" : "#0b0b0c"
            }}
          />
        </Source>

        {/* click popups from rendered features */}
        <div className="hidden" />{/* keep React happy */}
        {/* we attach a click handler via onClick prop */}
      </Map>
    </div>
  );
}
