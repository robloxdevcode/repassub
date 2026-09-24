import Link from "next/link";
import { LinklockLogo } from "@/components/brand/linklock-logo";

const links = {
  Product: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/use-cases", label: "Use cases" },
    { href: "/help", label: "Help & FAQ" },
  ],
  Grow: [
    { href: "/creators", label: "For creators" },
    { href: "/grow", label: "Growth kit" },
    { href: "/alternatives/rekonise", label: "Rekonise alternative" },
    { href: "/blog", label: "Blog" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/support", label: "Support" },
    { href: "/docs", label: "Docs" },
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
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <LinklockLogo size={52} variant="lockup" />
            <p className="mt-4 text-sm text-retro-text-dim leading-relaxed max-w-xs">
              Free subscribe-to-download links for creators — gate preset packs, beats, and mods behind
              follow, sub, and join steps.
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
        <div className="mt-12 pt-8 border-t border-retro-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-retro-text-muted">
          <span>© {new Date().getFullYear()} Linklock</span>
          <a
            href="https://discord.gg/DQQTf6XXg3"
            target="_blank"
            rel="noopener noreferrer"
            className="text-retro-accent hover:underline font-medium"
          >
            Discord support
          </a>
        </div>
      </div>
    </footer>
  );
}
