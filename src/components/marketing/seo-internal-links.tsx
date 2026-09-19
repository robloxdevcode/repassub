import Link from "next/link";

const SEO_HUB_LINKS = [
  { href: "/alternatives/rekonise", label: "Rekonise alternative" },
  { href: "/use-cases/preset-packs", label: "Preset pack unlock links" },
  { href: "/use-cases/beat-packs", label: "Beat pack downloads" },
  { href: "/blog/subscribe-to-download-link", label: "Subscribe to download guide" },
  { href: "/blog/link-in-bio-unlock", label: "Link in bio unlock" },
  { href: "/help", label: "Help & FAQ" },
  { href: "/pricing", label: "Pricing" },
];

export function SeoInternalLinks({ title = "Popular guides" }: { title?: string }) {
  return (
    <aside className="mt-12 pt-8 border-t border-retro-border" aria-label="Related pages">
      <h2 className="text-sm font-bold text-retro-text mb-3">{title}</h2>
      <ul className="grid sm:grid-cols-2 gap-2">
        {SEO_HUB_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-retro-accent hover:underline underline-offset-2"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
