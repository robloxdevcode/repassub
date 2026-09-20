"use client";

import Link from "next/link";
import { RedeemCodePanel } from "@/components/dashboard/redeem-code-panel";
import { SUPPORT_DISCORD_URL } from "@/lib/support-links";

export function RedeemPrizeSection({ onRedeemed }: { onRedeemed?: () => void }) {
  return (
    <section className="ll-plan-card max-w-3xl mx-auto mt-12 p-6 md:p-8">
      <h2 className="text-xl font-bold text-retro-text">Redeem a prize</h2>
      <p className="mt-2 text-sm text-retro-text-dim leading-relaxed">
        To earn a prize, join our giveaways in the{" "}
        <Link
          href={SUPPORT_DISCORD_URL}
          className="text-retro-accent font-semibold hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Discord server
        </Link>
        . Or redeem from your dashboard under{" "}
        <Link href="/redeem" className="text-retro-accent font-semibold hover:underline">
          Redeem a code
        </Link>
        .
      </p>
      <RedeemCodePanel compact onRedeemed={onRedeemed} className="mt-6" />
    </section>
  );
}
