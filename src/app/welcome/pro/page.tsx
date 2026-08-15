import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { fulfillCheckoutSession, syncProSubscriptionFromStripe } from "@/lib/actions/payments";
import { LinklockLogo } from "@/components/brand/linklock-logo";
import { RetroButton } from "@/components/retro";

export default async function ProWelcomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sessionId = typeof params.session_id === "string" ? params.session_id : undefined;

  if (sessionId) {
    try {
      await fulfillCheckoutSession(sessionId);
    } catch {
      await syncProSubscriptionFromStripe();
    }
  }

  return (
    <div className="min-h-screen bg-retro-bg flex flex-col">
      <header className="border-b border-retro-border bg-retro-surface px-4 py-4">
        <Link href="/" className="inline-block">
          <LinklockLogo size={36} showWordmark />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center ll-app-card p-8 md:p-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-retro-success/15 border-2 border-retro-success mb-6">
            <PartyPopper size={32} className="text-retro-success" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl tracking-wide text-retro-ink mb-3">
            Thank you for upgrading
          </h1>
          <p className="text-sm md:text-base text-retro-text-dim leading-relaxed mb-2">
            You&apos;re on <strong className="text-retro-ink">Linklock Pro</strong>. Payment went through and your account is active.
          </p>
          <p className="text-sm text-retro-text-muted mb-8">
            10 steps per link, custom branding, full stats, background media, and ad-free unlock pages.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard">
              <RetroButton size="lg" className="w-full sm:w-auto">
                Go to dashboard
              </RetroButton>
            </Link>
            <Link href="/create">
              <RetroButton size="lg" variant="secondary" className="w-full sm:w-auto">
                Create a link
              </RetroButton>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
