"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  tint: number;
};

type Props = {
  variant?: "dark" | "light";
  className?: string;
  connectLines?: boolean;
  density?: number;
};

function createDots(width: number, height: number, count: number): Dot[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.4 + 0.8,
    alpha: Math.random() * 0.45 + 0.2,
    tint: Math.random(),
  }));
}

export function AnimatedDotBackground({
  variant = "dark",
  className,
  connectLines = true,
  density = 1,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dark = variant === "dark";
    const dotCount = Math.floor((dark ? 72 : 48) * density);
    const linkDist = dark ? 120 : 90;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dotsRef.current = createDots(w, h, dotCount);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const tick = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dots = dotsRef.current;
      ctx.clearRect(0, 0, w, h);

      if (!reducedMotion) {
        for (const d of dots) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < 0) d.x = w;
          if (d.x > w) d.x = 0;
          if (d.y < 0) d.y = h;
          if (d.y > h) d.y = 0;
        }
      }

      if (connectLines) {
        for (let i = 0; i < dots.length; i++) {
          for (let j = i + 1; j < dots.length; j++) {
            const a = dots[i];
            const b = dots[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.hypot(dx, dy);
            if (dist < linkDist) {
              const fade = 1 - dist / linkDist;
              if (dark) {
                ctx.strokeStyle = `rgba(240, 62, 62, ${fade * 0.12})`;
              } else {
                ctx.strokeStyle = `rgba(240, 62, 62, ${fade * 0.08})`;
              }
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      for (const d of dots) {
        if (dark) {
          if (d.tint > 0.82) {
            ctx.fillStyle = `rgba(255, 107, 107, ${d.alpha + 0.15})`;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${d.alpha * 0.55})`;
          }
        } else if (d.tint > 0.85) {
          ctx.fillStyle = `rgba(240, 62, 62, ${d.alpha * 0.35})`;
        } else {
          ctx.fillStyle = `rgba(0, 0, 0, ${d.alpha * 0.12})`;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [variant, connectLines, density]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("ll-dot-canvas", className)}
      aria-hidden
    />
  );
}
