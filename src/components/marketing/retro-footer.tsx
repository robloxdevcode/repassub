import Link from "next/link";
import { LinklockLogo } from "@/components/brand/linklock-logo";

export function RetroFooter() {
  return (
    <footer className="bg-ink text-retro-text-on-dark border-t-[3px] border-retro-ink">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <LinklockLogo size={40} showWordmark wordmarkClassName="text-retro-yellow" />
        <div className="flex flex-wrap gap-x-4 gap-y-2 font-body text-sm text-white/70">
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
          <Link href="/#faq" className="hover:text-white">FAQ</Link>
          <Link href="/support" className="hover:text-white">Support</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
        </div>
      </div>
      <p className="text-center font-body text-xs text-white/40 pb-6">&copy; 2026 Linklock</p>
    </footer>
  );
}
