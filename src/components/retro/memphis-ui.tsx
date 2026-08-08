"use client";

import { cn } from "@/lib/utils";

interface RetroWindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerColor?: "tan" | "purple" | "teal" | "pink";
  showControls?: boolean;
}

const headerColors = {
  tan: "bg-memphis-tan",
  purple: "bg-memphis-purple",
  teal: "bg-memphis-teal",
  pink: "bg-memphis-pink",
};

export function RetroWindow({
  title = "REPASSUB.EXE",
  children,
  className,
  headerColor = "tan",
  showControls = true,
}: RetroWindowProps) {
  return (
    <div className={cn("memphis-window", className)}>
      <div className={cn("memphis-window-header", headerColors[headerColor])}>
        <span className="font-display text-[10px] md:text-xs tracking-wide truncate">{title}</span>
        {showControls && (
          <div className="flex gap-1.5 shrink-0">
            <span className="memphis-window-btn bg-memphis-yellow" />
            <span className="memphis-window-btn bg-memphis-teal" />
            <span className="memphis-window-btn bg-memphis-red" />
          </div>
        )}
      </div>
      <div className="memphis-window-body">{children}</div>
    </div>
  );
}

export function MemphisDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="memphis-star absolute top-[12%] left-[8%] text-memphis-yellow animate-float" />
      <div className="memphis-star absolute top-[20%] right-[12%] text-memphis-pink animate-float" style={{ animationDelay: "1s" }} />
      <div className="memphis-star absolute bottom-[30%] left-[15%] text-memphis-teal animate-float" style={{ animationDelay: "2s" }} />
      <div className="memphis-squiggle absolute top-[40%] right-[5%] opacity-60" />
      <div className="memphis-squiggle absolute bottom-[20%] left-[5%] opacity-40 rotate-180" />
      <div className="absolute top-[60%] right-[20%] h-8 w-8 border-4 border-black bg-memphis-purple rotate-12 animate-float" style={{ animationDelay: "0.5s" }} />
      <div className="absolute top-[15%] left-[40%] h-6 w-6 rounded-full border-4 border-black bg-memphis-teal animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute bottom-[40%] right-[30%] h-5 w-5 border-4 border-black bg-memphis-yellow rotate-45" />
    </div>
  );
}

const PAYMENT_METHODS = [
  { id: "visa", label: "VISA", color: "bg-[#1a1f71]", text: "VISA" },
  { id: "mastercard", label: "MC", color: "bg-[#eb001b]", text: "MC" },
  { id: "amex", label: "AMEX", color: "bg-[#006fcf]", text: "AMEX" },
  { id: "paypal", label: "PayPal", color: "bg-[#003087]", text: "PP" },
  { id: "stripe", label: "Stripe", color: "bg-[#635bff]", text: "STR" },
  { id: "apple", label: "Apple Pay", color: "bg-black", text: "" },
];

export function PaymentMethods({ className }: { className?: string }) {
  return (
    <div className={cn("text-center", className)}>
      <p className="font-display text-[10px] md:text-xs tracking-widest text-retro-text mb-4">
        ACCEPTED PAYMENTS
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {PAYMENT_METHODS.map((method) => (
          <div
            key={method.id}
            className={cn(
              "memphis-payment-badge",
              method.color,
              method.id === "apple" && "flex items-center justify-center"
            )}
            title={method.label}
          >
            {method.id === "apple" ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.08-3.11-1.05.04-2.31.72-3.06 1.56-.68.77-1.27 1.99-1.11 3.17 1.18.09 2.38-.6 3.09-1.62" />
              </svg>
            ) : (
              <span className="font-display text-[8px] md:text-[10px] text-white tracking-wider">
                {method.text}
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-retro-text-dim font-body">
        Secured by Stripe · No card data stored on our servers
      </p>
    </div>
  );
}
