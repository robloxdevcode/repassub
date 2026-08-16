"use client";

import { UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";

export function ClerkUserMenu({ plan: _plan = "FREE" }: { plan?: string }) {

  return (
    <div className="flex items-center gap-3 min-w-0 px-1">
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
        </UserButton.MenuItems>
      </UserButton>
      <p className="text-xs text-retro-text-muted truncate">Account & profile</p>
    </div>
  );
}
