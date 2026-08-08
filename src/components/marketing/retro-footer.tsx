import Link from "next/link";

const links = {
  Product: [
    { href: "/how-it-works", label: "How it works" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
  ],
  Resources: [
    { href: "/docs", label: "Docs" },
    { href: "/blog", label: "Blog" },
    { href: "/support", label: "Support" },
  ],
  Legal: [
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
  ],
};

export function RetroFooter() {
  return (
    <footer className="bg-ink text-retro-text-on-dark border-t-[3px] border-retro-ink">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 mb-14">
          <div className="max-w-xs">
            <p className="font-display text-[10px] text-retro-yellow mb-4">REPASSUB</p>
            <p className="font-body text-sm text-retro-text-on-dark/70 leading-relaxed">
              The unlock link platform for creators who want growth, not guesswork.
            </p>
            <Link
              href="/sign-up"
              className="inline-block mt-6 font-display text-[8px] bg-retro-accent text-white px-4 py-2 border-2 border-white brutal-shadow-sm"
            >
              START FREE
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
            {Object.entries(links).map(([section, items]) => (
              <div key={section}>
                <h4 className="font-display text-[8px] text-retro-yellow mb-4">{section.toUpperCase()}</h4>
                <ul className="space-y-2">
                  {items.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="font-body text-sm text-white/70 hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="font-body text-xs text-white/40 border-t border-white/10 pt-8">
          © 2026 Repassub. Built for creators.
        </p>
      </div>
    </footer>
  );
}
