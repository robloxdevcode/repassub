"use client";

import { SignIn } from "@clerk/nextjs";

const clerkAppearance = {
  variables: {
    colorPrimary: "#ff2b2b",
    colorBackground: "#ffffff",
    colorInputBackground: "#f6f2ea",
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

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-retro-bg">
      <div className="w-full">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center bg-retro-accent border-2 border-retro-ink brutal-shadow-sm mb-4">
            <span className="font-display text-[10px] text-white">R</span>
          </div>
          <h1 className="font-body text-2xl font-bold">Welcome back</h1>
        </div>
        <SignIn appearance={clerkAppearance} />
      </div>
    </div>
  );
}
