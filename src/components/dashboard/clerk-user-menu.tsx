"use client";

import { UserButton } from "@clerk/nextjs";
import { CreditCard, User } from "lucide-react";
import { PlanBadge, planDisplayName } from "@/components/dashboard/plan-badge";

export function ClerkUserMenu({ plan = "FREE" }: { plan?: string }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <UserButton
        appearance={{
          elements: {
            rootBox: "flex shrink-0",
            userButtonTrigger: "rounded-full hover:opacity-90 transition-opacity",
          },
        }}
      >
        <UserButton.MenuItems>
          <UserButton.Link label="Profile" labelIcon={<User size={14} />} href="/profile" />
          <UserButton.Link
            label={`${planDisplayName(plan)} plan`}
            labelIcon={<CreditCard size={14} />}
            href="/billing"
          />
        </UserButton.MenuItems>
      </UserButton>
      <div className="min-w-0">
        <PlanBadge plan={plan} />
      </div>
    </div>
  );
}
