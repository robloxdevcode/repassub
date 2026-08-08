import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

export interface PaymentBrand {
  id: string;
  name: string;
  Icon: ComponentType<{ className?: string }>;
}

function VisaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden>
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <path
        fill="#fff"
        d="M19.5 21h-3.2l2-12.5h3.2L19.5 21zm11.2-12.2c-.6-.2-1.6-.5-2.8-.5-3.1 0-5.2 1.6-5.2 4 0 1.7 1.6 2.7 2.8 3.3 1.2.6 1.7 1 1.7 1.5 0 .8-1 1.2-2 1.2-1.3 0-2-.3-3.1-.9l-.4-.2-.5 2.8c.8.4 2.3.7 3.8.7 3.3 0 5.4-1.6 5.5-4.1 0-1.4-.9-2.4-2.8-3.3-1.2-.6-1.9-1-1.9-1.6 0-.5.6-1.1 1.9-1.1 1.1 0 1.9.2 2.5.5l.3.1.5-2.7zm8.1-.3h-2.5c-.8 0-1.3.2-1.7 1l-4.6 11.5h3.4l.6-1.7h4.2l.4 1.7H42l-3.2-12.5zm-4.8 8.1 1.7-4.7.9 4.7h-2.6zM14.2 8.5l-3.1 8.5-.4-1.8c-.6-2.2-2.6-4.6-4.8-5.8l2.9 12.5h3.4L17.8 8.5h-3.6z"
      />
      <path fill="#F7B600" d="M10.8 8.5H6.1L6 8.8C9.5 9.7 12 12 13 14.8l-1.2-6.3z" />
    </svg>
  );
}

function MastercardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden>
      <rect width="48" height="32" rx="4" fill="#252525" />
      <circle cx="19" cy="16" r="8" fill="#EB001B" />
      <circle cx="29" cy="16" r="8" fill="#F79E1B" />
      <path d="M24 9.2a8 8 0 0 1 0 13.6 8 8 0 0 1 0-13.6z" fill="#FF5F00" />
    </svg>
  );
}

function AmexIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden>
      <rect width="48" height="32" rx="4" fill="#006FCF" />
      <path
        fill="#fff"
        d="M8 20.5V11.5h3.2l1.8 4.5 1.8-4.5H18v9h-2.3v-5.8l-2 5.8h-1.4l-2-5.8v5.8H8zm14.5-4.5 1.5-3.8 1.5 3.8h-3zm-2.2 4.5 2.2-9h2.8l2.2 9h-2.3l-.4-1.2h-3.4l-.4 1.2h-2.7zm8.8-9h4.8c1.6 0 2.7.4 3.4 1.1.6.6.9 1.4.9 2.4 0 1-.3 1.8-.9 2.4-.7.7-1.8 1.1-3.4 1.1h-2.5v2h-2.3v-9zm2.3 1.5v2.2h2.2c.7 0 1.2-.1 1.5-.4.3-.3.5-.7.5-1.2 0-.5-.2-.9-.5-1.2-.3-.3-.8-.4-1.5-.4h-2.2z"
      />
    </svg>
  );
}

function PayPalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden>
      <rect width="48" height="32" rx="4" fill="#003087" />
      <path
        fill="#009CDE"
        d="M18.5 11h4.2c2.5 0 4.2 1.6 3.8 4.2-.4 2.8-2.6 4.3-5.4 4.3h-2l-.8 4.5h-2.4l2.6-13z"
      />
      <path
        fill="#fff"
        d="M28.5 11h4.2c2.5 0 4.2 1.6 3.8 4.2-.4 2.8-2.6 4.3-5.4 4.3h-2l-.8 4.5h-2.4l2.6-13z"
      />
    </svg>
  );
}

function StripeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden>
      <rect width="48" height="32" rx="4" fill="#635BFF" />
      <path
        fill="#fff"
        d="M24.8 13.2c0-.8-.6-1.2-1.7-1.2-1.5 0-3.4.5-4.9 1.3v-4.8c1.6-.7 3.2-1 4.9-1 4 0 6.2 2.1 6.2 5.6 0 8.6-8.5 7.2-8.5 10.9 0 .9.8 1.4 2.2 1.4 1.8 0 4.1-.7 5.9-1.7v4.8c-1.6.7-3.3 1-5.2 1-4.1 0-6.4-2.1-6.4-5.7 0-9.2 8.5-7.6 8.5-11.6z"
      />
    </svg>
  );
}

function ApplePayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden>
      <rect width="48" height="32" rx="4" fill="#000" />
      <path
        fill="#fff"
        d="M16.2 10.2c.6-.8 1.6-1.4 2.5-1.5.1 1-.3 2-.9 2.7-.6.8-1.6 1.4-2.5 1.3-.1-1 .3-2 .9-2.5zm.9 1.6c-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.8-3.6 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1.1 1.6 2.3 2.7 2.2 1.1 0 1.5-.7 2.8-.7 1.3 0 1.6.7 2.8.7 1.2 0 2-1.1 2.7-2.2.9-1.2 1.2-2.4 1.2-2.5-.1 0-2.4-.9-2.4-3.6 0-2.3 1.8-3.4 1.9-3.5-1-.9-2.6-1.1-3.1-1.1z"
      />
      <path fill="#fff" d="M28 11.5h1.8l2.2 6.1 2.2-6.1H36l-3.4 9h-1.8L28 11.5z" />
    </svg>
  );
}

function GooglePayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden>
      <rect width="48" height="32" rx="4" fill="#fff" />
      <path fill="#EA4335" d="M12 16.5c0-.8.1-1.5.3-2.2H8v4.2h2.3a4.6 4.6 0 0 1-2-2z" />
      <path fill="#34A853" d="M23.5 19.8a4.5 4.5 0 0 1-3.6 1.8 4.5 4.5 0 0 1-4.3-3.1H8v4.3A8 8 0 0 0 19.9 24c2.1 0 3.9-.7 5.2-1.9l-1.6-2.3z" />
      <path fill="#4A90E2" d="M8 16.5a8 8 0 0 0 0 5l3.6-2.8H12a4.5 4.5 0 0 1 0-2.2H8z" />
      <path fill="#FBBC05" d="M19.9 12.7a4.9 4.9 0 0 1 3.5 1.3l2.6-2.6A8 8 0 0 0 8 13.5l3.6 2.8c.8-2.4 3-4.6 8.3-4.6z" />
      <path fill="#5F6368" d="M28 11.5h1.8l2.2 6.1 2.2-6.1H36l-3.4 9h-1.8L28 11.5z" />
    </svg>
  );
}

export const PAYMENT_BRANDS: PaymentBrand[] = [
  { id: "visa", name: "Visa", Icon: VisaIcon },
  { id: "mastercard", name: "Mastercard", Icon: MastercardIcon },
  { id: "amex", name: "Amex", Icon: AmexIcon },
  { id: "paypal", name: "PayPal", Icon: PayPalIcon },
  { id: "stripe", name: "Stripe", Icon: StripeIcon },
  { id: "apple-pay", name: "Apple Pay", Icon: ApplePayIcon },
  { id: "google-pay", name: "Google Pay", Icon: GooglePayIcon },
];

export function PaymentBrandChip({
  brand,
  className,
}: {
  brand: PaymentBrand;
  className?: string;
}) {
  const { Icon, name } = brand;

  return (
    <div
      className={cn(
        "shrink-0 flex items-center gap-3 border-2 border-retro-ink bg-white px-4 py-2.5 brutal-shadow-sm hover-lift",
        className
      )}
    >
      <Icon className="h-6 w-9 shrink-0" />
      <span className="text-xs font-bold text-retro-ink font-body whitespace-nowrap">{name}</span>
    </div>
  );
}
