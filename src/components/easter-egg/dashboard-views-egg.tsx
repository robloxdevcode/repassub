"use client";

import { Eye } from "lucide-react";
import { EasterEggTrigger } from "@/components/easter-egg/easter-egg-trigger";

export function DashboardViewsEgg({
  viewsLabel,
  viewsValue,
}: {
  viewsLabel: string;
  viewsValue: string;
}) {
  return (
    <EasterEggTrigger eggId="stat-stalker" clicks={5} className="dash-metric block text-left">
      <span className="dash-metric-label">
        <Eye size={14} />
        {viewsLabel}
      </span>
      <span className="dash-metric-value">{viewsValue}</span>
    </EasterEggTrigger>
  );
}
