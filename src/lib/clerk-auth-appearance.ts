export const clerkAuthAppearance = {
  variables: {
    colorPrimary: "#f97316",
    colorBackground: "#111111",
    colorInputBackground: "#1a1a1a",
    colorText: "#f5f5f5",
    colorTextSecondary: "#a3a3a3",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "mx-auto w-full max-w-md",
    card: "bg-[#111111] border border-[#2e2e2e] shadow-lg rounded-xl font-body",
    headerTitle: "font-body text-lg font-semibold text-[#f5f5f5]",
    headerSubtitle: "font-body text-sm text-[#a3a3a3]",
    formButtonPrimary:
      "bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold rounded-lg transition-transform active:scale-[0.98]",
    formFieldInput:
      "bg-[#1a1a1a] border border-[#2e2e2e] text-[#f5f5f5] font-body rounded-lg",
    formFieldLabel: "font-body text-sm font-medium text-[#f5f5f5]",
    formFieldErrorText: "font-body text-sm text-retro-error font-medium",
    alertText: "font-body text-sm text-retro-error",
    footerActionLink: "text-[#fb923c] font-semibold underline",
    identityPreviewText: "font-body text-sm text-[#f5f5f5]",
    formFieldSuccessText: "font-body text-sm text-[#34d399]",
    captcha: "my-4 flex justify-center",
    captchaWidget: "mx-auto",
    socialButtonsBlockButton:
      "border border-[#2e2e2e] bg-[#1a1a1a] hover:bg-[#222222] font-body rounded-lg text-[#f5f5f5] [&_*]:text-[#f5f5f5]",
    socialButtonsBlockButtonText: "text-[#f5f5f5] font-medium",
    dividerLine: "bg-[#2e2e2e]",
    dividerText: "text-[#737373]",
  },
} as const;
