"use client";

import { EasterEggTrigger } from "@/components/easter-egg/easter-egg-trigger";

export function AnalyticsHeaderEgg() {
  return (
    <EasterEggTrigger eggId="deep-dive" clicks={4}>
      <h1 className="font-body text-2xl font-bold mb-2">Stats</h1>
    </EasterEggTrigger>
  );
}
