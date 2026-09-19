import Link from "next/link";
import { LinklockLogo } from "@/components/brand/linklock-logo";

export function RetroFooter() {
  return (
    <footer className="ll-footer llv2-footer">
      <div className="mx-auto max-w-5xl px-4 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <LinklockLogo size={32} showWordmark wordmarkClassName="text-retro-text font-semibold" />
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-retro-text-muted">
          <Link href="/terms" className="hover:text-retro-text transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-retro-text transition-colors">
            Privacy
          </Link>
          <Link href="/support" className="hover:text-retro-text transition-colors">
            Support
          </Link>
        </div>
        <p className="text-xs text-retro-text-muted">© {new Date().getFullYear()} Linklock</p>
      </div>
    </footer>
  );
}
