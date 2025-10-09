"use client";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "2023-01", actions: 2 },
  { month: "2023-06", actions: 8 },
  { month: "2023-12", actions: 14 },
  { month: "2024-06", actions: 20 },
  { month: "2024-12", actions: 27 },
  { month: "2025-06", actions: 32 },
];

export default function TimelineChart() {
  return (
    <div className="w-full h-80 rounded-xl border border-white/10 bg-transparent supports-[backdrop-filter]:backdrop-blur-md">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" stroke="currentColor" />
          <YAxis stroke="currentColor" />
          <Tooltip
            contentStyle={{
              background: "rgba(30,30,30,0.9)",
              border: "none",
              color: "white",
            }}
          />
          <Area
            type="monotone"
            dataKey="actions"
            stroke="#38bdf8"
            fill="url(#colorA)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
