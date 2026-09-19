import Link from "next/link";
import { LinklockLogo } from "@/components/brand/linklock-logo";

export function RetroFooter() {
  return (
    <footer className="ll-footer rk-footer">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="max-w-sm">
            <LinklockLogo size={32} showWordmark wordmarkClassName="text-retro-text font-bold" />
            <p className="mt-3 text-sm text-retro-text-dim leading-relaxed">
              Unlock links for creators — orange-smooth UX, green growth stats, fans never need an account.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium">
            <Link href="/help" className="rk-footer-link">
              Help
            </Link>
            <Link href="/terms" className="rk-footer-link">
              Terms
            </Link>
            <Link href="/privacy" className="rk-footer-link">
              Privacy
            </Link>
            <Link href="/sign-up" className="rk-footer-link text-retro-accent">
              Get started →
            </Link>
          </div>
        </div>
        <p className="mt-10 text-xs text-retro-text-muted">© {new Date().getFullYear()} Linklock</p>
      </div>
    </footer>
  );
}
