"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { RetroButton, RetroInput } from "@/components/retro";
import { useToast } from "@/components/retro";
import { redeemPrizeCode } from "@/lib/actions/prize-codes";
import { SUPPORT_DISCORD_URL } from "@/lib/support-links";

export function RedeemPrizeSection({ onRedeemed }: { onRedeemed?: () => void }) {
  const { isSignedIn } = useAuth();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRedeem() {
    if (!isSignedIn) {
      window.location.href = `/sign-in?redirect_url=${encodeURIComponent("/pricing")}`;
      return;
    }

    setLoading(true);
    try {
      const result = await redeemPrizeCode(code);
      if (!result.ok) {
        toast(result.message, "error");
        return;
      }
      setCode("");
      toast(`Prize unlocked — ${result.durationLabel} active until ${new Date(result.proExpiresAt).toLocaleDateString()}`, "success");
      onRedeemed?.();
    } catch {
      toast("Could not redeem code", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="ll-plan-card max-w-3xl mx-auto mt-12 p-6 md:p-8">
      <h2 className="text-xl font-bold text-retro-text">Redeem a prize</h2>
      <p className="mt-2 text-sm text-retro-text-dim leading-relaxed">
        To earn a prize, join our giveaways in the{" "}
        <Link href={SUPPORT_DISCORD_URL} className="text-retro-accent font-semibold hover:underline" target="_blank" rel="noopener noreferrer">
          Discord server
        </Link>
        . Winners receive a code from staff — paste it below while signed in.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <RetroInput
          label="Prize code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="LLPRIZE-XXXX-XXXX"
          className="flex-1"
        />
        <RetroButton
          variant="primary"
          loading={loading}
          onClick={handleRedeem}
          className="sm:self-end shrink-0"
        >
          {isSignedIn ? "Redeem" : "Sign in to redeem"}
        </RetroButton>
      </div>
    </section>
  );
}
