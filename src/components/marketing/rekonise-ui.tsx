"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Lock, Play, MessageCircle, Music2, UserPlus } from "lucide-react";
import { PAYMENT_BRANDS, PaymentBrandChip } from "@/components/marketing/payment-logos";

interface UnlockPreviewProps {
  title: string;
  actions: Array<{ label: string; platform: "youtube" | "discord" | "spotify" | "generic" }>;
  progress: number;
  total: number;
  unlockLabel?: string;
  faded?: boolean;
  className?: string;
}

const platformIcons = {
  youtube: Play,
  discord: MessageCircle,
  spotify: Music2,
  generic: UserPlus,
};

const platformClasses = {
  youtube: "platform-youtube",
  discord: "platform-discord",
  spotify: "platform-spotify",
  generic: "platform-generic",
};

export function UnlockPreviewCard({
  title,
  actions,
  progress,
  total,
  unlockLabel = "UNLOCK",
  faded = false,
  className,
}: UnlockPreviewProps) {
  const done = progress >= total;

  return (
    <div className={cn("unlock-preview-card pixel-shadow", faded && "faded", className)}>
      <p className="font-display text-[8px] text-retro-hot mb-1">{title.toUpperCase()}</p>
      <p className="font-body text-xs text-retro-text-dim mb-5">Complete all tasks</p>

      <div className="flex flex-col gap-2 mb-5">
        {actions.map((action, i) => {
          const Icon = platformIcons[action.platform];
          return (
            <div key={i} className={cn("platform-btn", platformClasses[action.platform])}>
              <Icon size={14} />
              <span className="font-body">{action.label}</span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between font-body text-xs text-retro-text-dim mb-2">
        <span>Progress</span>
        <span className="text-retro-hot font-semibold">{progress}/{total}</span>
      </div>
      <div className="retro-progress mb-5">
        <div className="retro-progress-fill" style={{ width: `${(progress / total) * 100}%` }} />
      </div>

      <button
        disabled={!done}
        className={cn(
          "w-full py-3 font-display text-[8px] border-2 border-black transition-colors",
          done
            ? "bg-retro-accent text-white pixel-shadow"
            : "bg-retro-surface-2 text-retro-text-muted cursor-not-allowed"
        )}
      >
        <span className="inline-flex items-center justify-center gap-2">
          <Lock size={10} />
          {unlockLabel}
        </span>
      </button>
    </div>
  );
}

const PLATFORMS = ["YouTube", "Discord", "Spotify", "TikTok", "Instagram", "X", "Twitch"];

export function PlatformStrip({ className }: { className?: string }) {
  const items = [...PLATFORMS, ...PLATFORMS, ...PLATFORMS];
  return (
    <div className={cn("overflow-hidden", className)}>
      <div className="platform-marquee-track">
        {items.map((p, i) => (
          <span
            key={`${p}-${i}`}
            className="font-display text-[8px] border-2 border-retro-accent text-retro-accent px-4 py-2 shrink-0 hover:bg-retro-accent hover:text-white transition-colors"
          >
            {p.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
}

export function PaymentMethods({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-3", className)}>
      {PAYMENT_BRANDS.map((brand) => (
        <PaymentBrandChip key={brand.id} brand={brand} />
      ))}
    </div>
  );
}

export function AnalyticsMock() {
  const base = [35, 70, 50, 90, 60, 100, 75];
  const [heights, setHeights] = useState(base);

  useEffect(() => {
    const id = setInterval(() => {
      setHeights(base.map((h) => Math.max(25, Math.min(100, h + (Math.random() - 0.5) * 30))));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="retro-panel pixel-shadow p-6 md:p-8 bg-black">
      <div className="flex items-center gap-2 mb-6">
        <p className="font-display text-[8px] text-retro-hot">LIVE STATS</p>
        <span className="live-dot live-dot-active" />
      </div>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { label: "Unlocks", value: "247" },
          { label: "Views", value: "12K" },
          { label: "Conv.", value: "54%" },
        ].map((s) => (
          <div key={s.label} className="border-2 border-retro-border p-3 text-center">
            <p className="font-display text-[10px] text-retro-accent tabular-nums">{s.value}</p>
            <p className="font-body text-[10px] text-retro-text-dim mt-2 uppercase">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-1 h-24 border-2 border-retro-border p-2 bg-retro-surface">
        {heights.map((h, i) => (
          <div
            key={i}
            className="flex-1 transition-all duration-700 ease-out"
            style={{
              height: `${h}%`,
              background: i % 2 === 0 ? "var(--retro-accent)" : "var(--retro-hot)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const SOCIAL_TASKS = [
  { label: "Subscribe", platform: "platform-youtube", Icon: Play },
  { label: "Join server", platform: "platform-discord", Icon: MessageCircle },
  { label: "Follow", platform: "platform-spotify", Icon: Music2 },
];

export function SocialActionsMock() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % SOCIAL_TASKS.length), 1600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="retro-panel pixel-shadow p-6 bg-black">
      <p className="font-display text-[8px] text-retro-hot mb-4">TASK LIST</p>
      <div className="flex flex-col gap-2">
        {SOCIAL_TASKS.map((task, i) => (
          <div
            key={task.label}
            className={cn(
              "platform-btn transition-all duration-300",
              task.platform,
              i === active && "translate-x-2 scale-[1.02] ring-2 ring-black"
            )}
          >
            <task.Icon size={14} /> {task.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TestimonialCard({
  quote,
  name,
  handle,
  stat,
}: {
  quote: string;
  name: string;
  handle: string;
  stat: string;
}) {
  return (
    <div className="retro-panel pixel-shadow p-6 bg-retro-surface-2 h-full flex flex-col transition-transform duration-200 hover:-translate-y-2 hover:border-retro-accent group">
      <p className="font-body text-sm text-retro-text leading-relaxed flex-1">&ldquo;{quote}&rdquo;</p>
      <div className="mt-6 pt-4 border-t-2 border-retro-border flex items-end justify-between">
        <div>
          <p className="font-display text-[8px]">{name.toUpperCase()}</p>
          <p className="font-body text-xs text-retro-text-muted mt-1">{handle}</p>
        </div>
        <span className="font-display text-[8px] text-retro-hot group-hover:scale-110 inline-block transition-transform">{stat}</span>
      </div>
    </div>
  );
}
