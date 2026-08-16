"use client";

import { SignIn } from "@clerk/nextjs";
import { clerkAuthAppearance } from "@/lib/clerk-auth-appearance";
import { LinklockLogo } from "@/components/brand/linklock-logo";

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="auth-shell-header">
        <div className="flex justify-center mb-4">
          <LinklockLogo size={48} showWordmark wordmarkClassName="text-retro-text font-semibold" />
        </div>
        <h1>Reset password</h1>
        <p>We&apos;ll email you a link to get back in</p>
      </div>
      <SignIn appearance={clerkAuthAppearance} routing="path" path="/forgot-password" />
    </>
  );
}
