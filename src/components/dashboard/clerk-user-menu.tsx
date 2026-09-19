"use client";

import { UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";
import { clerkAuthAppearance } from "@/lib/clerk-auth-appearance";

export function ClerkUserMenu() {
  return (
    <div className="sidebar-account">
      <UserButton
        appearance={{
          ...clerkAuthAppearance,
          elements: {
            ...clerkAuthAppearance.elements,
            rootBox: "flex shrink-0 w-auto",
            userButtonTrigger: "rounded-full flex shrink-0",
            userButtonPopoverCard: "bg-retro-surface border border-retro-border shadow-lg rounded-xl",
          },
        }}
      >
        <UserButton.MenuItems>
          <UserButton.Link label="Profile" labelIcon={<User size={14} />} href="/profile" />
        </UserButton.MenuItems>
      </UserButton>
      <p className="text-xs text-retro-text-muted">Account & profile</p>
    </div>
  );
}
