"use client";

import { SignUp } from "@clerk/nextjs";
import { clerkAuthAppearance } from "@/lib/clerk-auth-appearance";
import { LinklockLogo } from "@/components/brand/linklock-logo";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-retro-yellow/40">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <LinklockLogo size={48} />
          </div>
          <h1 className="font-body text-2xl font-bold">Create your account</h1>
          <p className="font-body text-sm text-retro-text-dim mt-2">
            Free forever · No card required · Bot-protected sign-up
          </p>
        </div>
        <SignUp
          appearance={clerkAuthAppearance}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/dashboard"
          forceRedirectUrl="/dashboard"
        />
        <p className="mt-6 font-body text-xs text-retro-text-dim text-center leading-relaxed">
          Sign-up error? In Clerk Dashboard → User &amp; authentication: set sign-up to{" "}
          <strong>Public</strong>, enable <strong>Email + Password</strong>, and turn off required{" "}
          <strong>Phone</strong>.
        </p>
      </div>
    </div>
  );
}
