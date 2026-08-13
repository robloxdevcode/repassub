import Link from "next/link";
import { LinklockLogo } from "@/components/brand/linklock-logo";

export function RetroFooter() {
  return (
    <footer className="simple-footer border-t border-retro-border bg-retro-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <LinklockLogo size={32} showWordmark wordmarkClassName="text-retro-text font-body text-sm font-bold" />
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-retro-text-dim">
          <Link href="/pricing" prefetch className="hover:text-retro-accent">
            Pricing
          </Link>
          <Link href="/support" prefetch className="hover:text-retro-accent">
            Support
          </Link>
          <Link href="/terms" prefetch className="hover:text-retro-accent">
            Terms
          </Link>
          <Link href="/privacy" prefetch className="hover:text-retro-accent">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
