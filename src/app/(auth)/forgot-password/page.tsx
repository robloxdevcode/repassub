"use client";

import { SignIn } from "@clerk/nextjs";
import { RetroBackground } from "@/components/retro";

const clerkAppearance = {
  variables: { colorPrimary: "#c8ff00", colorBackground: "#141414", borderRadius: "12px" },
  elements: {
    card: "bg-retro-surface border border-retro-border rounded-2xl",
    formButtonPrimary: "bg-retro-accent text-white rounded-lg",
    footerActionLink: "text-retro-accent",
  },
};

export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <RetroBackground />
      <div className="relative z-10 w-full max-w-md">
        <h1 className="font-display text-xl font-bold text-center mb-6">Reset password</h1>
        <SignIn appearance={clerkAppearance} routing="path" path="/forgot-password" />
      </div>
    </div>
  );
}
