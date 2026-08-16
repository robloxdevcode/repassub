export const clerkAuthAppearance = {

  variables: {

    colorPrimary: "#6366f1",

    colorBackground: "#ffffff",

    colorInputBackground: "#f8fafc",

    borderRadius: "0.75rem",

  },

  elements: {

    rootBox: "mx-auto w-full max-w-md",

    card: "bg-retro-surface border border-retro-border shadow-sm rounded-xl font-body",

    headerTitle: "font-body text-lg font-semibold",

    headerSubtitle: "font-body text-sm text-retro-text-dim",

    formButtonPrimary:

      "bg-retro-accent text-white font-semibold rounded-xl shadow-[0_2px_8px_rgba(99,102,241,0.25)]",

    formFieldInput: "bg-retro-bg border border-retro-border font-body rounded-lg",

    formFieldLabel: "font-body text-sm font-medium",

    formFieldErrorText: "font-body text-sm text-retro-error font-medium",

    alertText: "font-body text-sm text-retro-error",

    footerActionLink: "text-retro-accent font-medium",

    identityPreviewText: "font-body text-sm",

    formFieldSuccessText: "font-body text-sm text-retro-success",

    captcha: "my-4 flex justify-center",

    captchaWidget: "mx-auto",

  },

} as const;

