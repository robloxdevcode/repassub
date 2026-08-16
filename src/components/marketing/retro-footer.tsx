import Link from "next/link";
import { LinklockLogo } from "@/components/brand/linklock-logo";

const links = {
  Product: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/how-it-works", label: "How it works" },
  ],
  Legal: [
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
    { href: "/refund-policy", label: "Refunds" },
    { href: "/support", label: "Support" },
  ],
};

export function RetroFooter() {
  return (
    <footer className="ll-calm-footer">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div>
            <LinklockLogo size={32} showWordmark wordmarkClassName="text-retro-text font-semibold" />
            <p className="mt-3 text-sm text-retro-text-muted max-w-xs leading-relaxed">
              Simple unlock pages for gated content.
            </p>
          </div>
          <div className="flex gap-16">
            {Object.entries(links).map(([group, items]) => (
              <div key={group}>
                <p className="text-xs font-medium text-retro-text-muted mb-3">{group}</p>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        prefetch
                        className="text-sm text-retro-text-dim hover:text-retro-text transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-10 pt-6 border-t border-retro-border text-xs text-retro-text-muted">
          © {new Date().getFullYear()} Linklock
        </p>
      </div>
    </footer>
  );
}
