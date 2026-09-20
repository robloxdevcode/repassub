"use client";

import { MemphisDecorations } from "@/components/retro/memphis-ui";
import { RetroBackground } from "@/components/retro/retro-background";

export function ClassicAuthChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="classic-shell auth-shell relative overflow-hidden">
      <RetroBackground />
      <MemphisDecorations />
      <div className="auth-shell-inner relative z-10">{children}</div>
    </div>
  );
}
