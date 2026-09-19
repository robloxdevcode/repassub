export const clerkAuthAppearance = {
  variables: {
    colorPrimary: "#d4ff58",
    colorBackground: "#0c0c0f",
    colorInputBackground: "#121218",
    colorText: "#fafafa",
    colorTextSecondary: "#a1a1aa",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "mx-auto w-full max-w-md",
    card: "bg-[#0c0c0f] border border-[#27272a] shadow-lg rounded-xl font-body",
    headerTitle: "font-body text-lg font-semibold text-[#fafafa]",
    headerSubtitle: "font-body text-sm text-[#a1a1aa]",
    formButtonPrimary:
      "bg-[#d4ff58] hover:bg-[#b8e040] text-[#0a0a0a] font-bold rounded-lg",
    formFieldInput:
      "bg-[#121218] border border-[#27272a] text-[#fafafa] font-body rounded-lg",
    formFieldLabel: "font-body text-sm font-medium text-[#fafafa]",
    formFieldErrorText: "font-body text-sm text-retro-error font-medium",
    alertText: "font-body text-sm text-retro-error",
    footerActionLink: "text-[#d4ff58] font-semibold underline",
    identityPreviewText: "font-body text-sm text-[#fafafa]",
    formFieldSuccessText: "font-body text-sm text-[#4ade80]",
    captcha: "my-4 flex justify-center",
    captchaWidget: "mx-auto",
    socialButtonsBlockButton:
      "border border-[#27272a] bg-[#121218] hover:bg-[#18181f] font-body rounded-lg text-[#fafafa]",
    dividerLine: "bg-[#27272a]",
    dividerText: "text-[#71717a]",
  },
} as const;
