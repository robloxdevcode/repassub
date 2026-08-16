import Link from "next/link";
import { LinklockLogo } from "@/components/brand/linklock-logo";

const links = {
  Product: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/how-it-works", label: "How it works" },
  ],
  Company: [
    { href: "/support", label: "Support" },
    { href: "/docs", label: "Docs" },
    { href: "/blog", label: "Blog" },
  ],
  Legal: [
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
    { href: "/refund-policy", label: "Refunds" },
  ],
};

export function RetroFooter() {
  return (
    <footer className="ll-footer">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <LinklockLogo size={36} showWordmark wordmarkClassName="text-retro-text font-bold" />
            <p className="mt-4 text-sm text-retro-text-dim leading-relaxed max-w-xs">
              Unlock links for creators. Gate downloads, grow your audience.
            </p>
          </div>
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-wider text-retro-text-muted mb-4">
                {group}
              </p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      prefetch
                      className="text-sm text-retro-text-dim hover:text-retro-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-retro-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-retro-text-muted">
          <span>© {new Date().getFullYear()} Linklock</span>
          <span>linklock.org</span>
        </div>
      </div>
    </footer>
  );
}
