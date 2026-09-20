export const clerkAuthAppearance = {
  variables: {
    colorPrimary: "#ffe566",
    colorBackground: "#141422",
    colorInputBackground: "#1c1c2e",
    colorText: "#f4f4f5",
    colorTextSecondary: "#b4b4c8",
    borderRadius: "0.875rem",
  },
  elements: {
    rootBox: "mx-auto w-full max-w-md",
    card: "bg-[#141422] border border-[#2e2e42] shadow-lg rounded-xl font-body",
    headerTitle: "font-body text-lg font-semibold text-[#f4f4f5]",
    headerSubtitle: "font-body text-sm text-[#b4b4c8]",
    formButtonPrimary:
      "bg-[#ffe566] hover:bg-[#f5d547] text-[#141414] font-bold rounded-lg transition-transform active:scale-[0.98]",
    formFieldInput:
      "bg-[#1c1c2e] border border-[#2e2e42] text-[#f4f4f5] font-body rounded-lg",
    formFieldLabel: "font-body text-sm font-medium text-[#f4f4f5]",
    formFieldErrorText: "font-body text-sm text-retro-error font-medium",
    alertText: "font-body text-sm text-retro-error",
    footerActionLink: "text-[#6ee7ff] font-semibold underline",
    identityPreviewText: "font-body text-sm text-[#f4f4f5]",
    formFieldSuccessText: "font-body text-sm text-[#4ade80]",
    captcha: "my-4 flex justify-center",
    captchaWidget: "mx-auto",
    socialButtonsBlockButton:
      "border border-[#2e2e42] bg-[#1c1c2e] hover:bg-[#252538] font-body rounded-lg text-[#f4f4f5] [&_*]:text-[#f4f4f5]",
    socialButtonsBlockButtonText: "text-[#f4f4f5] font-medium",
    dividerLine: "bg-[#2e2e42]",
    dividerText: "text-[#8b8ba3]",
  },
} as const;
