"use client";

import { useState, useEffect } from "react";
import { RetroButton } from "@/components/retro";
import { useToast } from "@/components/retro";
import { getPaymentData, createConnectAccount, createBillingPortal } from "@/lib/actions/payments";
import { formatCurrency } from "@/lib/utils";

export default function PaymentsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    totalEarnings: number;
    pendingPayouts: number;
    subscription: { plan: string } | null;
    payments: { id: string; amount: number; status: string; createdAt: Date }[];
    payouts: { id: string; amount: number; status: string; createdAt: Date }[];
  } | null>(null);

  useEffect(() => {
    getPaymentData().then(setData).catch(() => {});
  }, []);

  async function handleConnect() {
    setLoading(true);
    try {
      const { url } = await createConnectAccount();
      if (url) window.location.href = url;
    } catch (e) {
      toast(e instanceof Error ? e.message : "Stripe not configured", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleBilling() {
    setLoading(true);
    try {
      const { url } = await createBillingPortal();
      if (url) window.location.href = url;
    } catch (e) {
      toast(e instanceof Error ? e.message : "No billing account", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl tracking-wider mb-2">PAYMENT TERMINAL</h1>
      <p className="text-sm text-retro-text-dim mb-8">Manage earnings and payouts</p>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="retro-panel p-4">
          <p className="font-display text-xs text-retro-text-dim">TOTAL EARNINGS</p>
          <p className="font-display text-2xl text-retro-glow mt-2">
            {formatCurrency(data?.totalEarnings || 0)}
          </p>
        </div>
        <div className="retro-panel p-4">
          <p className="font-display text-xs text-retro-text-dim">PENDING</p>
          <p className="font-display text-2xl text-retro-warning mt-2">
            {formatCurrency(data?.pendingPayouts || 0)}
          </p>
        </div>
        <div className="retro-panel p-4">
          <p className="font-display text-xs text-retro-text-dim">CURRENT PLAN</p>
          <p className="font-display text-2xl text-retro-accent mt-2">
            {data?.subscription?.plan || "FREE"}
          </p>
        </div>
      </div>

      <div className="retro-panel p-6 mb-8">
        <h2 className="font-display text-sm tracking-widest mb-4">SELECT METHOD</h2>
        <div className="flex flex-wrap gap-3">
          <RetroButton onClick={handleConnect} loading={loading}>STRIPE CONNECT</RetroButton>
          <RetroButton variant="secondary" onClick={handleBilling} loading={loading}>MANAGE BILLING</RetroButton>
        </div>
      </div>

      <div className="retro-panel p-6">
        <h2 className="font-display text-sm tracking-widest mb-4">PAYOUT HISTORY</h2>
        {!data?.payouts.length ? (
          <p className="text-sm text-retro-text-dim">No payouts yet</p>
        ) : (
          <div className="flex flex-col gap-2">
            {data.payouts.map((p) => (
              <div key={p.id} className="flex justify-between border-b border-retro-border-dim/30 py-2">
                <span className="text-sm">{formatCurrency(p.amount)}</span>
                <span className="font-display text-xs text-retro-text-dim">{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
