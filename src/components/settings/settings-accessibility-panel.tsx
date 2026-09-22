"use client";

import { useEffect, useState } from "react";
import {
  getReduceMotionPreference,
  setReduceMotionPreference,
  prefersOsReducedMotion,
} from "@/lib/motion-preference";

export function SettingsAccessibilityPanel() {
  const [enabled, setEnabled] = useState(false);
  const [osReduced, setOsReduced] = useState(false);

  useEffect(() => {
    setEnabled(getReduceMotionPreference());
    setOsReduced(prefersOsReducedMotion());
  }, []);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    setReduceMotionPreference(next);
  }

  return (
    <div className="settings-plan-panel space-y-4">
      <div>
        <h2 className="font-body text-base font-bold text-retro-text">Motion</h2>
        <p className="mt-2 text-sm text-retro-text-dim leading-relaxed">
          Turn off moving backgrounds and animated dots across Linklock. Your system may also limit motion
          automatically.
        </p>
        {osReduced ? (
          <p className="mt-2 text-xs font-semibold text-retro-text-muted">
            Your device has &quot;Reduce motion&quot; enabled — animations are already minimized.
          </p>
        ) : null}
      </div>
      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border-2 border-[#0a0a0a] bg-retro-surface-2 px-4 py-3">
        <span className="text-sm font-semibold text-retro-text">Reduce motion in Linklock</span>
        <input
          type="checkbox"
          checked={enabled}
          onChange={toggle}
          className="h-5 w-5 accent-retro-accent"
        />
      </label>
      <p className="text-xs text-retro-text-muted">
        Stored on this browser only. Panning profile backgrounds, app grid glow, and dot animations pause when
        on.
      </p>
    </div>
  );
}
