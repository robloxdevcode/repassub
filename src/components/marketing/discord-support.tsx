import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { SUPPORT_DISCORD_LABEL, SUPPORT_DISCORD_URL } from "@/lib/support-links";

export function DiscordSupportStrip({ className = "" }: { className?: string }) {
  return (
    <section
      className={`border-t border-retro-border bg-retro-surface ${className}`.trim()}
      aria-label="Community support"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-retro-accent">Need help?</p>
          <h2 className="mt-1 text-lg font-semibold text-retro-text">Join our Discord support server</h2>
          <p className="mt-2 text-sm text-retro-text-dim max-w-md">
            Questions about unlock links, billing, or your account — our team and community respond in Discord.
          </p>
        </div>
        <a
          href={SUPPORT_DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="llv2-cta ui-instant inline-flex items-center gap-2 shrink-0"
        >
          <MessageCircle size={18} aria-hidden />
          {SUPPORT_DISCORD_LABEL}
        </a>
      </div>
    </section>
  );
}

export function DiscordSupportCard() {
  return (
    <div className="retro-panel p-6 mb-10 text-center max-w-lg mx-auto">
      <p className="text-xs font-semibold uppercase tracking-wider text-retro-accent mb-2">Support</p>
      <h2 className="font-body text-xl font-semibold text-retro-text mb-2">Discord community</h2>
      <p className="text-sm text-retro-text-dim mb-6 leading-relaxed">
        For help with Linklock, billing, or your creator setup — join our official Discord. We do not offer
        phone or email support.
      </p>
      <a
        href={SUPPORT_DISCORD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="llv2-cta ui-instant inline-flex items-center justify-center gap-2 min-w-[200px]"
      >
        <MessageCircle size={18} aria-hidden />
        Open Discord
      </a>
      <p className="mt-4 text-xs text-retro-text-muted">
        Invite link:{" "}
        <Link href={SUPPORT_DISCORD_URL} className="text-retro-accent hover:underline">
          discord.gg/DQQTf6XXg3
        </Link>
      </p>
    </div>
  );
}
