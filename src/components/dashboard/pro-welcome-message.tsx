import Link from "next/link";
import { PartyPopper, Sparkles } from "lucide-react";
import { AppCard } from "@/components/dashboard/app-page-header";
import { RetroLink } from "@/components/retro";
import { ClearProWelcomeQuery } from "@/components/dashboard/clear-pro-welcome-query";

export function ProWelcomeMessage() {
  return (
    <>
      <AppCard className="p-6 mb-6 border-retro-success bg-retro-success/10" accent="green">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-retro-success/20 border-2 border-retro-success">
            <PartyPopper size={24} className="text-retro-success" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg tracking-wide text-retro-ink">Thank you for going Pro!</p>
            <p className="text-sm text-retro-text-dim mt-2 leading-relaxed">
              You&apos;re all set. Enjoy <strong className="text-retro-ink">10 steps per link</strong>, your own branding,
              full analytics, and ad-free unlock pages.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <RetroLink href="/create" size="sm" variant="primary">
                <Sparkles size={14} />
                Create a Pro link
              </RetroLink>
              <RetroLink href="/billing" size="sm" variant="ghost">
                Manage billing
              </RetroLink>
            </div>
          </div>
        </div>
      </AppCard>
      <ClearProWelcomeQuery />
    </>
  );
}

export function ProWelcomePendingMessage() {
  return (
    <AppCard className="p-5 mb-6 border-retro-accent bg-retro-accent/10" accent="yellow">
      <p className="font-body font-bold text-retro-ink">Payment received</p>
      <p className="text-sm text-retro-text-dim mt-1">
        Your Pro upgrade is still syncing. Refresh in a moment or open{" "}
        <Link href="/billing" className="text-retro-blue hover:underline">
          Billing
        </Link>
        .
      </p>
      <ClearProWelcomeQuery />
    </AppCard>
  );
}
