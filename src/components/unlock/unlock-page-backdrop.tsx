"use client";

import {
  Gamepad2,
  Headphones,
  Music2,
  Disc3,
  Radio,
  Trophy,
  Volume2,
  Mic2,
  Tv,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FLOATING_ICONS: {
  Icon: typeof Gamepad2;
  top: string;
  left: string;
  rotate: number;
  tone: string;
  delay: string;
  size: number;
}[] = [
  { Icon: Gamepad2, top: "7%", left: "5%", rotate: -14, tone: "unlock-icon-red", delay: "0s", size: 22 },
  { Icon: Headphones, top: "14%", left: "82%", rotate: 10, tone: "unlock-icon-blue", delay: "1.2s", size: 24 },
  { Icon: Music2, top: "72%", left: "8%", rotate: 8, tone: "unlock-icon-yellow", delay: "0.6s", size: 20 },
  { Icon: Disc3, top: "78%", left: "88%", rotate: -8, tone: "unlock-icon-spotify", delay: "1.8s", size: 22 },
  { Icon: Radio, top: "42%", left: "3%", rotate: 12, tone: "unlock-icon-purple", delay: "2.4s", size: 18 },
  { Icon: Trophy, top: "28%", left: "91%", rotate: -6, tone: "unlock-icon-yellow", delay: "0.3s", size: 20 },
  { Icon: Volume2, top: "58%", left: "92%", rotate: 14, tone: "unlock-icon-red", delay: "1.5s", size: 18 },
  { Icon: Mic2, top: "86%", left: "42%", rotate: -10, tone: "unlock-icon-blue", delay: "2.1s", size: 19 },
  { Icon: Tv, top: "6%", left: "48%", rotate: 6, tone: "unlock-icon-purple", delay: "0.9s", size: 21 },
  { Icon: Zap, top: "52%", left: "78%", rotate: -12, tone: "unlock-icon-yellow", delay: "1.1s", size: 17 },
];

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${((i * 19 + 5) % 96) + 2}%`,
  top: `${((i * 27 + 13) % 94) + 3}%`,
  size: 3 + (i % 4),
  delay: `${(i % 10) * 0.55}s`,
  duration: `${5 + (i % 6)}s`,
  tone: i % 3 === 0 ? "bg-retro-accent" : i % 3 === 1 ? "bg-retro-blue" : "bg-retro-yellow",
}));

const SHAPES: {
  top: string;
  left: string;
  w: number;
  h: number;
  rotate: number;
  tone: string;
  delay: string;
  round?: boolean;
}[] = [
  { top: "18%", left: "22%", w: 28, h: 28, rotate: 12, tone: "bg-retro-yellow", delay: "0s" },
  { top: "65%", left: "18%", w: 20, h: 20, rotate: 45, tone: "bg-retro-blue", delay: "1s" },
  { top: "35%", left: "72%", w: 24, h: 24, rotate: -20, tone: "bg-retro-accent", delay: "2s" },
  { top: "80%", left: "68%", w: 16, h: 16, rotate: 0, tone: "bg-retro-success", delay: "0.5s", round: true },
  { top: "48%", left: "12%", w: 14, h: 14, rotate: 30, tone: "bg-retro-yellow", delay: "1.7s", round: true },
];

export function UnlockPageBackdrop({ videoUrl }: { videoUrl?: string | null }) {
  if (videoUrl) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          src={videoUrl}
        />
        <div className="absolute inset-0 bg-retro-bg/55" />
        <div className="unlock-backdrop-grid absolute inset-0 opacity-[0.04]" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="unlock-backdrop-stage absolute inset-0" />
      <div className="unlock-backdrop-grid absolute inset-0" />
      <div className="marketing-grain absolute inset-0" />

      <div className="hero-orb hero-orb-red opacity-[0.14]" />
      <div className="hero-orb hero-orb-blue opacity-[0.12]" />
      <div className="hero-orb hero-orb-yellow opacity-[0.16]" />

      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className={cn("unlock-particle absolute border border-retro-ink/40", p.tone)}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {SHAPES.map((shape, i) => (
        <div
          key={i}
          className="unlock-float-shape-wrap absolute"
          style={{ top: shape.top, left: shape.left, animationDelay: shape.delay }}
        >
          <div
            className={cn("unlock-float-shape", shape.tone, shape.round && "rounded-full")}
            style={{
              width: shape.w,
              height: shape.h,
              transform: `rotate(${shape.rotate}deg)`,
            }}
          />
        </div>
      ))}

      {FLOATING_ICONS.map(({ Icon, top, left, rotate, tone, delay, size }, i) => (
        <div
          key={i}
          className="unlock-float-wrap absolute"
          style={{ top, left, animationDelay: delay }}
        >
          <div
            className={cn("unlock-float-icon border-2 border-retro-ink brutal-shadow-sm", tone)}
            style={{ transform: `rotate(${rotate}deg)` }}
          >
            <Icon size={size} strokeWidth={2.5} />
          </div>
        </div>
      ))}

      <div className="unlock-scanlines absolute inset-0 opacity-[0.035]" />
    </div>
  );
}
