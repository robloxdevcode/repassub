"use client";

import { SignIn } from "@clerk/nextjs";
import { clerkAuthAppearance } from "@/lib/clerk-auth-appearance";
import { LinklockLogo } from "@/components/brand/linklock-logo";

export default function SignInPage() {
  return (
    <>
      <div className="auth-shell-header">
        <div className="flex justify-center mb-4">
          <LinklockLogo size={48} showWordmark wordmarkClassName="text-retro-text font-semibold" />
        </div>
        <h1>Welcome back</h1>
        <p>Sign in to manage your unlock links</p>
      </div>
      <SignIn
        appearance={clerkAuthAppearance}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
      />
    </>
  );
}
