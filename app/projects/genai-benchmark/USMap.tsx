// app/projects/genai-benchmark/USMap.tsx — FULL FILE REPLACEMENT
"use client";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// IMPORTANT: use a string URL (runtime fetch), not an ES import
const geoUrl =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const scores: Record<string, number> = {
  MD: 100, CA: 87, AZ: 85, GA: 85, PA: 84, AL: 76, UT: 72, NJ: 72, MA: 71, DC: 71,
};

export default function USMap() {
  return (
    <div className="w-full h-[480px] rounded-xl border border-white/10 bg-transparent supports-[backdrop-filter]:backdrop-blur-md overflow-hidden">
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              // react-simple-maps exposes USPS code as geo.properties.postal
              const code = (geo.properties as any).postal as string | undefined;
              const score = code ? scores[code] : undefined;
              const fill = score == null
                ? "#1e293b"
                : score > 80 ? "#7dd3fc"
                : score > 60 ? "#38bdf8"
                : score > 40 ? "#0ea5e9"
                : "#172554";
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="#0f172a"
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#a5f3fc", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
