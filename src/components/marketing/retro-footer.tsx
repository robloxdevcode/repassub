import Link from "next/link";
import { LinklockLogo } from "@/components/brand/linklock-logo";

export function RetroFooter() {
  return (
    <footer className="simple-footer border-t border-retro-border bg-retro-surface">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
          <div>
            <LinklockLogo size={36} showWordmark wordmarkClassName="text-retro-text font-body text-sm font-bold" />
            <p className="mt-3 text-sm text-retro-text-dim max-w-xs">
              Follow-to-unlock links. Gate downloads behind fan steps — free unlimited links included.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-retro-text-dim">
            <Link href="/pricing" prefetch className="hover:text-retro-accent">
              Pricing
            </Link>
            <Link href="/features" prefetch className="hover:text-retro-accent">
              Features
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
            <Link href="/refund-policy" prefetch className="hover:text-retro-accent">
              Refunds
            </Link>
          </div>
        </div>
        <p className="mt-8 text-xs text-retro-text-muted">&copy; 2026 Linklock</p>
      </div>
    </footer>
  );
}
