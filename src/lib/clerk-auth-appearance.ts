export const clerkAuthAppearance = {
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
    headerSubtitle: "font-body text-sm text-retro-text-dim",
    formButtonPrimary: "bg-retro-accent text-white font-display text-[8px] border-2 border-black",
    formFieldInput: "bg-retro-bg border-2 border-black font-body",
    formFieldLabel: "font-body text-sm font-semibold",
    formFieldErrorText: "font-body text-sm text-retro-accent font-semibold",
    alertText: "font-body text-sm text-retro-accent",
    footerActionLink: "text-retro-blue font-semibold",
    identityPreviewText: "font-body text-sm",
    formFieldSuccessText: "font-body text-sm text-green-700",
  },
} as const;
