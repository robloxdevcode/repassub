"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";

const DISMISS_KEY = "ll-promo-dismissed";

export function SitePromoBanner() {
  const [hidden, setHidden] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  });

  if (hidden) return null;

  return (
    <div className="site-promo-banner bg-gradient-to-r from-[#ffe566]/20 via-[#6ee7ff]/15 to-[#ff8bc4]/20 text-retro-text text-center text-sm py-2.5 px-4 relative border-b border-retro-border">
      <p>
        <strong>Try Linklock free</strong> — unlimited unlock links, no credit card.{" "}
        <Link href="/sign-up" className="underline font-semibold hover:opacity-90">
          Create your link →
        </Link>
        {" · "}
        <Link href="/grow" className="underline opacity-90 hover:opacity-100">
          Growth kit
        </Link>
      </p>
      <button
        type="button"
        aria-label="Dismiss"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-80 hover:opacity-100"
        onClick={() => {
          sessionStorage.setItem(DISMISS_KEY, "1");
          setHidden(true);
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
