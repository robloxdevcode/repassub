"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function DashboardRefresh({ intervalMs = 120000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    function tick() {
      if (document.hidden) return;
      router.refresh();
    }

    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
