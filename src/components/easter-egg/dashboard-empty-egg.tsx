"use client";

import { Link2 } from "lucide-react";
import { EasterEggTrigger } from "@/components/easter-egg/easter-egg-trigger";

export function DashboardEmptyEggIcon() {
  return (
    <EasterEggTrigger eggId="grape-key" clicks={7} className="dash-empty-icon inline-flex">
      <Link2 size={24} />
    </EasterEggTrigger>
  );
}
