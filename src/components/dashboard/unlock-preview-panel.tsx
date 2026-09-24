"use client";

import { PlatformBrandIcon } from "@/components/marketing/platform-brand-icon";
import { getPlatform } from "@/lib/unlock-platforms";
import { unlockThemeClass } from "@/lib/unlock-themes";
import { cn } from "@/lib/utils";
import { Check, ExternalLink } from "lucide-react";

type PreviewAction = {
  platformId: string;
  label: string;
  url: string;
};

export function UnlockPreviewPanel({
  title,
  description,
  buttonText,
  theme,
  actions,
  className,
}: {
  title: string;
  description: string;
  buttonText: string;
  theme: string;
  actions: PreviewAction[];
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border-2 border-dashed border-retro-accent/40 bg-retro-surface-2/50 p-4", className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-retro-accent mb-3">Preview — what fans see</p>
      <div className={cn("w-full max-w-sm mx-auto unlock-preview-card", unlockThemeClass(theme))}>
        <h3 className="font-display text-lg font-bold text-retro-text">{title || "Your page title"}</h3>
        {description ? (
          <p className="text-sm text-retro-text-dim mt-1 mb-3">{description}</p>
        ) : (
          <p className="text-sm text-retro-text-dim mt-1 mb-3 italic">Your description shows here.</p>
        )}
        <p className="text-sm text-retro-text-dim mb-3">
          Complete each step below. We verify in the background after you finish on the other site (loading spinner, no countdown).
        </p>
        <div className="flex flex-col gap-2 mb-4">
          {actions.length === 0 ? (
            <p className="text-sm text-retro-text-muted py-2">Add fan steps to preview them here.</p>
          ) : (
            actions.map((action, index) => {
              const platform = getPlatform(action.platformId);
              return (
                <div
                  key={`${action.platformId}-${index}`}
                  className="platform-btn relative overflow-hidden border-[#5865f2] bg-[#5865f2]/10"
                >
                  {platform ? <PlatformBrandIcon platform={platform.id} size="sm" /> : null}
                  <span className="flex items-center gap-1 text-left text-sm">
                    {action.label || "Complete this step"} <ExternalLink size={12} />
                  </span>
                </div>
              );
            })
          )}
          {actions.length > 0 ? (
            <div className="platform-btn platform-btn--done opacity-60">
              <Check size={16} strokeWidth={3} />
              <span>Example completed step</span>
            </div>
          ) : null}
        </div>
        <div className="w-full py-3 text-center font-bold text-sm border-2 border-retro-ink bg-retro-yellow rounded-lg">
          {buttonText || "Unlock"}
        </div>
      </div>
    </div>
  );
}
