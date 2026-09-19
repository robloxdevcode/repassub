"use client";

import { EasterEggTrigger } from "@/components/easter-egg/easter-egg-trigger";

export function FinePrintTrapdoorTrigger() {
  return (
    <EasterEggTrigger
      eggId="fine-print-trapdoor"
      clicks={5}
      as="button"
      className="inline-block h-1.5 w-1.5 rounded-full bg-retro-text-muted/20 align-super opacity-40 hover:opacity-80 ml-0.5"
    >
      ·
    </EasterEggTrigger>
  );
}
