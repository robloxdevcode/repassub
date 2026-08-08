import Link from "next/link";

export function PromoPill() {
  return (
    <Link
      href="/pricing"
      className="inline-block text-xs text-retro-text-dim hover:text-retro-accent font-body border border-retro-border px-3 py-1"
    >
      Pro yearly — 50% off
    </Link>
  );
}
