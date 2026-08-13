export const clerkAuthAppearance = {
  variables: {
    colorPrimary: "#059669",
    colorBackground: "#ffffff",
    colorInputBackground: "#f8fafc",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "mx-auto w-full max-w-md",
    card: "bg-retro-surface border border-retro-border shadow-sm rounded-xl font-body",
    headerTitle: "font-body text-lg font-bold",
    headerSubtitle: "font-body text-sm text-retro-text-dim",
    formButtonPrimary: "bg-retro-accent text-white font-semibold rounded-xl",
    formFieldInput: "bg-retro-bg border border-retro-border font-body rounded-lg",
    formFieldLabel: "font-body text-sm font-semibold",
    formFieldErrorText: "font-body text-sm text-retro-error font-semibold",
    alertText: "font-body text-sm text-retro-error",
    footerActionLink: "text-retro-blue font-semibold",
    identityPreviewText: "font-body text-sm",
    formFieldSuccessText: "font-body text-sm text-retro-success",
    captcha: "my-4 flex justify-center",
    captchaWidget: "mx-auto",
  },
} as const;
