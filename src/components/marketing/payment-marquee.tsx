"use client";

import { PAYMENT_BRANDS, PaymentBrandChip } from "@/components/marketing/payment-logos";

export function PaymentMarquee() {
  const brands = [...PAYMENT_BRANDS, ...PAYMENT_BRANDS];

  return (
    <section className="bg-retro-surface border-t-[3px] border-retro-ink py-10 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 mb-6">
        <p className="font-display text-[8px] text-retro-text-dim">PAYMENTS</p>
        <p className="font-body text-sm font-semibold mt-1">Logo + name at checkout · Secured by Stripe</p>
      </div>
      <div className="payment-marquee-mask">
        <div className="payment-marquee-track px-4">
          {brands.map((brand, i) => (
            <PaymentBrandChip key={`${brand.id}-${i}`} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
