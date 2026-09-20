"use client";

import { MemphisDecorations } from "@/components/retro/memphis-ui";
import { ClassicAnimatedBackdrop } from "@/components/marketing/classic-animated-backdrop";
import { RetroFooter } from "@/components/marketing/retro-footer";
import { RetroNav } from "@/components/marketing/retro-nav";

export function ClassicMarketingChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="classic-shell ll-shell relative flex min-h-screen flex-col">
      <ClassicAnimatedBackdrop />
      <MemphisDecorations />
      <div className="classic-nav relative z-10">
        <RetroNav />
      </div>
      <main className="relative z-10 flex-1">{children}</main>
      <div className="relative z-10">
        <RetroFooter />
      </div>
    </div>
  );
}
