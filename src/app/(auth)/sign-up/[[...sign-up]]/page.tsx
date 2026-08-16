"use client";

import { SignUp } from "@clerk/nextjs";
import { clerkAuthAppearance } from "@/lib/clerk-auth-appearance";
import { LinklockLogo } from "@/components/brand/linklock-logo";

export default function SignUpPage() {
  return (
    <>
      <div className="auth-shell-header">
        <div className="flex justify-center mb-4">
          <LinklockLogo size={48} showWordmark wordmarkClassName="text-retro-text font-semibold" />
        </div>
        <h1>Create your account</h1>
        <p>Free to start · No credit card required</p>
      </div>
      <SignUp
        appearance={clerkAuthAppearance}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
      />
    </>
  );
}
