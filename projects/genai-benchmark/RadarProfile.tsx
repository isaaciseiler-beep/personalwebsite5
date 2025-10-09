"use client";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { category: "Implementation", National: 5.2, Top5: 8.6 },
  { category: "Infrastructure", National: 4.1, Top5: 7.8 },
  { category: "Employee Readiness", National: 3.7, Top5: 7.0 },
];

export default function RadarProfile() {
  return (
    <div className="w-full h-96 rounded-xl border border-white/10 bg-transparent supports-[backdrop-filter]:backdrop-blur-md">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="currentColor" />
          <PolarAngleAxis dataKey="category" stroke="currentColor" />
          <PolarRadiusAxis stroke="currentColor" />
          <Radar
            name="National Average"
            dataKey="National"
            stroke="#64748b"
            fill="#64748b"
            fillOpacity={0.3}
          />
          <Radar
            name="Top 5 Average"
            dataKey="Top5"
            stroke="#38bdf8"
            fill="#38bdf8"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
