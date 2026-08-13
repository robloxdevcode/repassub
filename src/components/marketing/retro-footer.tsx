import Link from "next/link";
import { LinklockLogo } from "@/components/brand/linklock-logo";

export function RetroFooter() {
  return (
    <footer className="simple-footer border-t border-retro-border bg-retro-surface">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
          <LinklockLogo size={36} showWordmark wordmarkClassName="text-retro-text" />
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-retro-text-dim">
            <Link href="/pricing" className="hover:text-retro-accent">Pricing</Link>
            <Link href="/features" className="hover:text-retro-accent">Features</Link>
            <Link href="/support" className="hover:text-retro-accent">Support</Link>
            <Link href="/terms" className="hover:text-retro-accent">Terms</Link>
            <Link href="/privacy" className="hover:text-retro-accent">Privacy</Link>
            <Link href="/refund-policy" className="hover:text-retro-accent">Refunds</Link>
          </div>
        </div>
        <p className="mt-8 text-xs text-retro-text-muted">&copy; 2026 Linklock</p>
      </div>
    </footer>
  );
}
