"use client";

import { useState } from "react";
import Link from "next/link";
import { MARKETING_KIT } from "@/lib/marketing-kit";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { RetroButton } from "@/components/retro";
import { useToast } from "@/components/retro";

function CopyBlock({ label, text }: { label: string; text: string }) {
  const { toast } = useToast();
  return (
    <div className="retro-panel p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <p className="text-sm font-semibold">{label}</p>
        <RetroButton
          type="button"
          size="sm"
          variant="secondary"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
              toast("Copied!", "success");
            } catch {
              toast("Copy failed", "error");
            }
          }}
        >
          Copy
        </RetroButton>
      </div>
      <p className="text-sm text-retro-text-dim whitespace-pre-wrap font-mono leading-relaxed">{text}</p>
    </div>
  );
}

export function GrowPageClient({ signedIn }: { signedIn: boolean }) {
  const [tab, setTab] = useState<"dm" | "social" | "reddit">("dm");
  const tabs = [
    { id: "dm" as const, label: "DM templates" },
    { id: "social" as const, label: "TikTok & bio" },
    { id: "reddit" as const, label: "Reddit & Discord" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-wider text-retro-accent mb-2">Creator kit</p>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Grow with Linklock</h1>
      <p className="text-lg text-retro-text-dim leading-relaxed mb-8">
        Copy-paste templates for DMs, bios, TikTok hooks, and community posts. Swap in your link and
        ship.
      </p>

      {!signedIn ? (
        <div className="retro-panel p-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm">Sign in free to create your first unlock link.</p>
          <MarketingAuthLink href="/sign-up">
            <RetroButton size="sm">Create free account</RetroButton>
          </MarketingAuthLink>
        </div>
      ) : (
        <div className="retro-panel p-4 mb-8">
          <p className="text-sm font-semibold mb-1">Ready to share</p>
          <p className="text-xs text-retro-text-muted mb-3">Copy a template below and paste your unlock link from the dashboard.</p>
          <Link href="/dashboard" className="text-sm text-retro-accent hover:underline font-semibold">
            Open dashboard →
          </Link>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`text-sm font-semibold px-4 py-2 rounded-lg border transition-colors ${
              tab === t.id
                ? "border-retro-accent bg-retro-accent/10 text-retro-accent"
                : "border-retro-border text-retro-text-dim hover:bg-retro-surface-2"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dm" && (
        <div className="space-y-4">
          {MARKETING_KIT.dmTemplates.map((t) => (
            <CopyBlock key={t.title} label={t.title} text={t.body} />
          ))}
        </div>
      )}

      {tab === "social" && (
        <div className="space-y-6">
          <div>
            <h2 className="font-bold mb-3">TikTok / Reels hooks</h2>
            <ul className="space-y-2">
              {MARKETING_KIT.tiktokHooks.map((h) => (
                <li key={h} className="text-sm text-retro-text-dim flex gap-2">
                  <span className="text-retro-accent">→</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-bold mb-3">Bio lines (replace [YOUR LINK])</h2>
            <div className="space-y-3">
              {MARKETING_KIT.bioLines.map((line) => (
                <CopyBlock key={line} label="Bio line" text={line} />
              ))}
            </div>
          </div>
          <p className="text-xs text-retro-text-muted">
            Hashtags: {MARKETING_KIT.hashtags.join(" ")}
          </p>
        </div>
      )}

      {tab === "reddit" && (
        <div className="space-y-4">
          <CopyBlock label="Reddit comment / post" text={MARKETING_KIT.redditTemplate} />
          <CopyBlock label="Discord announcement" text={MARKETING_KIT.discordTemplate} />
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-retro-border text-center">
        <MarketingAuthLink href="/sign-up">
          <RetroButton size="lg">Create your first unlock link</RetroButton>
        </MarketingAuthLink>
        <p className="mt-3 text-xs text-retro-text-muted">
          <Link href="/alternatives/rekonise" className="hover:text-retro-accent underline">
            Compare vs Rekonise
          </Link>
          {" · "}
          <Link href="/blog" className="hover:text-retro-accent underline">
            SEO guides
          </Link>
        </p>
      </div>
    </div>
  );
}
