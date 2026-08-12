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
    campaignStats?: {
      id: string;
      title: string;
      slug: string;
      views: number;
      unlocked: number;
      conversion: number;
    }[];
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

  const countryData = breakdown.byCountry.map((c) => ({
    name: c.country || "Unknown",
    value: c._count.country,
  }));

  const campaignStats = breakdown.campaignStats || [];

  return (
    <div className="space-y-6">
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

      <div className="retro-panel p-4">
        <h3 className="font-display text-xs tracking-widest text-retro-text-dim mb-4">BY COUNTRY</h3>
        {countryData.length === 0 ? (
          <p className="text-sm text-retro-text-dim">No country data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={countryData} layout="vertical">
              <XAxis type="number" tick={{ fill: "#8888aa", fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={80} tick={{ fill: "#8888aa", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#12121f", border: "1px solid #3d5afe" }} />
              <Bar dataKey="value" fill="#5865f2" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="retro-panel p-4 overflow-x-auto">
        <h3 className="font-display text-xs tracking-widest text-retro-text-dim mb-4">PER LINK</h3>
        {campaignStats.length === 0 ? (
          <p className="text-sm text-retro-text-dim">No links yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-retro-border-dim text-left text-retro-text-dim">
                <th className="py-2 pr-4 font-display text-xs">LINK</th>
                <th className="py-2 pr-4 font-display text-xs">VIEWS</th>
                <th className="py-2 pr-4 font-display text-xs">UNLOCKS</th>
                <th className="py-2 font-display text-xs">CONV.</th>
              </tr>
            </thead>
            <tbody>
              {campaignStats.map((row) => (
                <tr key={row.id} className="border-b border-retro-border-dim/30">
                  <td className="py-3 pr-4 font-semibold max-w-[200px] truncate">{row.title}</td>
                  <td className="py-3 pr-4 tabular-nums">{row.views}</td>
                  <td className="py-3 pr-4 tabular-nums">{row.unlocked}</td>
                  <td className="py-3 tabular-nums">{row.conversion.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
