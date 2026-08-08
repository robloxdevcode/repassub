"use client";

import { useState } from "react";
import { RetroButton, RetroInput } from "@/components/retro";
import { cn } from "@/lib/utils";
import { UserProfile } from "@clerk/nextjs";

const TABS = ["ACCOUNT", "SECURITY", "NOTIFICATIONS", "APPEARANCE"];

export default function SettingsPage() {
  const [tab, setTab] = useState("ACCOUNT");
  const [theme, setTheme] = useState("dark");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl tracking-wider mb-2">SYSTEM SETTINGS</h1>
      <p className="text-sm text-retro-text-dim mb-8">Configure your account</p>

      <div className="flex gap-1 mb-8 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "font-display text-xs tracking-widest px-4 py-2 border-2 transition-all whitespace-nowrap",
              tab === t
                ? "border-retro-glow bg-retro-accent/20 text-retro-glow"
                : "border-retro-border-dim text-retro-text-dim hover:border-retro-border"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="retro-panel p-6">
        {tab === "ACCOUNT" && (
          <div className="flex flex-col gap-4">
            <p className="font-display text-xs text-retro-text-dim mb-2">Manage account via Clerk</p>
            <UserProfile
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-retro-surface border-2 border-retro-border shadow-none",
                },
              }}
            />
          </div>
        )}

        {tab === "SECURITY" && (
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-sm tracking-wider">ACTIVE SESSIONS</h3>
            <p className="text-sm text-retro-text-dim">Manage sessions through your Clerk account security settings.</p>
            <h3 className="font-display text-sm tracking-wider mt-4">TWO-FACTOR AUTH</h3>
            <p className="text-sm text-retro-text-dim">Enable 2FA in your Clerk security settings for enhanced protection.</p>
          </div>
        )}

        {tab === "NOTIFICATIONS" && (
          <div className="flex flex-col gap-4">
            {["Email notifications", "Payment notifications", "Security alerts"].map((item) => (
              <label key={item} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-retro-accent" />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        )}

        {tab === "APPEARANCE" && (
          <div className="flex flex-col gap-4">
            <p className="font-display text-xs text-retro-text-dim">THEME</p>
            <div className="flex gap-3">
              {(["dark", "light", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    "font-display text-xs px-4 py-2 border-2 uppercase tracking-wider",
                    theme === t ? "border-retro-glow text-retro-glow" : "border-retro-border-dim text-retro-text-dim"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
