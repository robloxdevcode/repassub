"use client";

import { ClassicAnimatedBackdrop } from "@/components/marketing/classic-animated-backdrop";
import { MemphisDecorations } from "@/components/retro/memphis-ui";

export function ClassicAuthChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="classic-shell auth-shell relative min-h-screen overflow-hidden">
      <ClassicAnimatedBackdrop />
      <MemphisDecorations />
      <div className="auth-shell-inner relative z-10">{children}</div>
    </div>
  );
}
