"use client";

import { SignUp } from "@clerk/nextjs";

const clerkAppearance = {
  variables: {
    colorPrimary: "#ff2b2b",
    colorBackground: "#ffffff",
    borderRadius: "0px",
  },
  elements: {
    rootBox: "mx-auto w-full max-w-md",
    card: "bg-white border-[3px] border-black shadow-[6px_6px_0_#111] font-body",
    headerTitle: "font-display text-[10px]",
    formButtonPrimary: "bg-retro-accent text-white font-display text-[8px] border-2 border-black",
    formFieldInput: "bg-retro-bg border-2 border-black font-body",
    footerActionLink: "text-retro-blue font-semibold",
  },
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-retro-yellow/40">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="font-body text-2xl font-bold">Create your account</h1>
          <p className="font-body text-sm text-retro-text-dim mt-2">Free forever · No card required</p>
        </div>
        <SignUp appearance={clerkAppearance} />
      </div>
    </div>
  );
}
