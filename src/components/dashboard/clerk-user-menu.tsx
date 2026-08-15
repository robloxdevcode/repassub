"use client";

import { UserButton } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import { PlanBadge, planDisplayName } from "@/components/dashboard/plan-badge";

export function ClerkUserMenu({ plan = "FREE" }: { plan?: string }) {
  return (
    <div className="flex items-center gap-3">
      <UserButton
        appearance={{
          elements: {
            rootBox: "flex",
            userButtonBox: "flex-row-reverse justify-end",
            userButtonTrigger:
              "rounded-xl border border-retro-border hover:bg-retro-surface-2 transition-colors",
          },
        }}
      >
        <UserButton.MenuItems>
          <UserButton.Link
            label={`${planDisplayName(plan)} plan`}
            labelIcon={<CreditCard size={14} />}
            href="/billing"
          />
        </UserButton.MenuItems>
      </UserButton>
      <PlanBadge plan={plan} />
    </div>
  );
}
