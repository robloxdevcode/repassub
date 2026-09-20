"use client";

import { useState } from "react";
import Link from "next/link";
import { RetroButton, RetroInput } from "@/components/retro";
import { useToast } from "@/components/retro";
import { redeemPrizeCode } from "@/lib/actions/prize-codes";
import { SUPPORT_DISCORD_URL } from "@/lib/support-links";
import { AppCard } from "@/components/dashboard/app-page-header";
import { cn } from "@/lib/utils";

export function RedeemCodePanel({
  className,
  compact = false,
  onRedeemed,
}: {
  className?: string;
  compact?: boolean;
  onRedeemed?: () => void;
}) {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRedeem() {
    setLoading(true);
    try {
      const result = await redeemPrizeCode(code);
      if (!result.ok) {
        toast(result.message, "error");
        return;
      }
      setCode("");
      toast(
        `Prize unlocked — ${result.durationLabel} active until ${new Date(result.proExpiresAt).toLocaleDateString()}`,
        "success",
      );
      onRedeemed?.();
    } catch {
      toast("Could not redeem code", "error");
    } finally {
      setLoading(false);
    }
  }

  const inner = (
    <>
      {!compact ? (
        <>
          <p className="text-base text-retro-text-dim leading-relaxed max-w-lg">
            Won a Discord giveaway? Paste the code staff sent you. Codes expire quickly — redeem as soon as you get
            one.
          </p>
          <p className="mt-4 text-sm text-retro-text-dim leading-relaxed">
            Earn codes in giveaways on our{" "}
            <Link
              href={SUPPORT_DISCORD_URL}
              className="text-retro-accent font-semibold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord server
            </Link>
            .
          </p>
        </>
      ) : null}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 min-w-0">
          <RetroInput
            label="Prize code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="LLPRIZE-XXXX-XXXX"
            autoComplete="off"
          />
        </div>
        <RetroButton
          variant="primary"
          loading={loading}
          onClick={handleRedeem}
          className="w-full sm:w-auto min-h-[48px] px-8 shrink-0"
        >
          Redeem code
        </RetroButton>
      </div>
    </>
  );

  if (compact) {
    return <div className={className}>{inner}</div>;
  }

  return (
    <AppCard className={cn("p-6 md:p-10", className)}>
      {inner}
    </AppCard>
  );
}
