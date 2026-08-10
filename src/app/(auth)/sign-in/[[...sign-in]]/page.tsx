"use client";

import { SignIn } from "@clerk/nextjs";
import { clerkAuthAppearance } from "@/lib/clerk-auth-appearance";
import { LinklockLogo } from "@/components/brand/linklock-logo";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-retro-bg">
      <div className="w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <LinklockLogo size={48} />
          </div>
          <h1 className="font-body text-2xl font-bold">Welcome back</h1>
        </div>
        <SignIn
          appearance={clerkAuthAppearance}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
          forceRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
