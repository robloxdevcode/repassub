"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#c8ff00", "#5865f2", "#ff0000", "#1db954", "#888888"];

interface BreakdownProps {
  breakdown: {
    bySource: { source: string | null; _count: { source: number } }[];
    byDevice: { device: string | null; _count: { device: number } }[];
    byCountry: { country: string | null; _count: { country: number } }[];
    campaigns: { id: string; title: string; slug: string }[];
  };
}

export function AnalyticsCharts({ breakdown }: BreakdownProps) {
  const sourceData = breakdown.bySource.map((s) => ({
    name: s.source || "Direct",
    value: s._count.source,
  }));

  const deviceData = breakdown.byDevice.map((d) => ({
    name: d.device || "Unknown",
    value: d._count.device,
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="retro-panel p-4">
        <h3 className="font-display text-xs tracking-widest text-retro-text-dim mb-4">BY SOURCE</h3>
        {sourceData.length === 0 ? (
          <p className="text-sm text-retro-text-dim">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sourceData}>
              <XAxis dataKey="name" tick={{ fill: "#8888aa", fontSize: 10 }} />
              <YAxis tick={{ fill: "#8888aa", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#12121f", border: "1px solid #3d5afe" }} />
              <Bar dataKey="value" fill="#c8ff00" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="retro-panel p-4">
        <h3 className="font-display text-xs tracking-widest text-retro-text-dim mb-4">BY DEVICE</h3>
        {deviceData.length === 0 ? (
          <p className="text-sm text-retro-text-dim">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={deviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                {deviceData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#12121f", border: "1px solid #3d5afe" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
