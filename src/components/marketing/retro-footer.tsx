import Link from "next/link";
import { LinklockLogo } from "@/components/brand/linklock-logo";

export function RetroFooter() {
  return (
    <footer className="ll-footer pro-footer">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="max-w-sm">
            <LinklockLogo size={32} showWordmark wordmarkClassName="text-retro-text font-semibold" />
            <p className="mt-3 text-sm text-retro-text-dim leading-relaxed">
              Readable unlock pages and simple analytics for creators.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <Link href="/help" className="pro-footer-link">
              Help
            </Link>
            <Link href="/terms" className="pro-footer-link">
              Terms
            </Link>
            <Link href="/privacy" className="pro-footer-link">
              Privacy
            </Link>
            <Link href="/support" className="pro-footer-link">
              Support
            </Link>
          </div>
        </div>
        <p className="mt-10 text-xs text-retro-text-muted">© {new Date().getFullYear()} Linklock</p>
      </div>
    </footer>
  );
}
