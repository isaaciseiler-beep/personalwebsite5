"use client";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

const data = [
  { state: "MD", score: 100 },
  { state: "CA", score: 87 },
  { state: "AZ", score: 85 },
  { state: "GA", score: 85 },
  { state: "PA", score: 84 },
  { state: "AL", score: 76 },
  { state: "UT", score: 72 },
  { state: "NJ", score: 72 },
  { state: "MA", score: 71 },
  { state: "DC", score: 71 },
];

export default function ScoreChart() {
  return (
    <div className="w-full h-80 rounded-xl border border-white/10 bg-transparent supports-[backdrop-filter]:backdrop-blur-md">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <XAxis dataKey="state" stroke="currentColor" />
          <YAxis stroke="currentColor" />
          <Tooltip
            contentStyle={{
              background: "rgba(30,30,30,0.9)",
              border: "none",
              color: "white",
            }}
          />
          <Bar dataKey="score" fill="currentColor" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
