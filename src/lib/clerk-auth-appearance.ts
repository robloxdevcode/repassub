export const clerkAuthAppearance = {
  variables: {
    colorPrimary: "#141414",
    colorBackground: "#ffffff",
    colorInputBackground: "#f5f1ea",
    colorText: "#141414",
    colorTextSecondary: "#52525b",
    borderRadius: "1rem",
  },
  elements: {
    rootBox: "mx-auto w-full max-w-md",
    card: "bg-white border border-[#e8e2d9] shadow-[0_20px_50px_rgba(20,20,20,0.08)] rounded-2xl font-body",
    headerTitle: "font-body text-xl font-bold text-[#141414] tracking-tight",
    headerSubtitle: "font-body text-sm text-[#52525b]",
    formButtonPrimary:
      "bg-[#141414] hover:bg-[#2a2a2a] text-white font-bold rounded-xl transition-transform active:scale-[0.98]",
    formFieldInput:
      "bg-[#f5f1ea] border border-[#e8e2d9] text-[#141414] font-body rounded-xl",
    formFieldLabel: "font-body text-sm font-semibold text-[#141414]",
    formFieldErrorText: "font-body text-sm text-[#e11d48] font-medium",
    alertText: "font-body text-sm text-[#e11d48]",
    footerActionLink: "text-[#0ea5e9] font-semibold underline",
    identityPreviewText: "font-body text-sm text-[#141414]",
    formFieldSuccessText: "font-body text-sm text-[#16a34a]",
    captcha: "my-4 flex justify-center",
    captchaWidget: "mx-auto",
    socialButtonsBlockButton:
      "border border-[#e8e2d9] bg-white hover:bg-[#f5f1ea] font-body rounded-xl text-[#141414]",
    socialButtonsBlockButtonText: "text-[#141414] font-medium",
    dividerLine: "bg-[#e8e2d9]",
    dividerText: "text-[#71717a]",
  },
} as const;
