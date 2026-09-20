export const clerkAuthAppearance = {
  variables: {
    colorPrimary: "#ffe566",
    colorBackground: "#ffffff",
    colorInputBackground: "#f5f1ea",
    colorText: "#0a0a0a",
    colorTextSecondary: "#52525b",
    borderRadius: "0",
  },
  elements: {
    rootBox: "mx-auto w-full max-w-md",
    card:
      "bg-white border-[3px] border-[#0a0a0a] shadow-[6px_6px_0_#0a0a0a] rounded-none font-body",
    headerTitle: "font-display text-[0.5625rem] md:text-xs text-[#0a0a0a] leading-relaxed uppercase",
    headerSubtitle: "font-body text-sm text-[#52525b] font-semibold",
    formButtonPrimary:
      "bg-[#ffe566] hover:bg-[#f5d547] text-[#0a0a0a] font-bold rounded-none border-[3px] border-[#0a0a0a] shadow-[4px_4px_0_#0a0a0a] hover:shadow-[5px_5px_0_#0a0a0a] active:translate-x-[2px] active:translate-y-[2px]",
    formFieldInput:
      "bg-[#f5f1ea] border-[2px] border-[#0a0a0a] text-[#0a0a0a] font-body rounded-none font-semibold",
    formFieldLabel: "font-body text-sm font-bold text-[#0a0a0a]",
    formFieldErrorText: "font-body text-sm text-[#e11d48] font-bold",
    alertText: "font-body text-sm text-[#e11d48] font-semibold",
    footerActionLink: "text-[#0ea5e9] font-bold underline",
    identityPreviewText: "font-body text-sm text-[#0a0a0a] font-semibold",
    formFieldSuccessText: "font-body text-sm text-[#16a34a] font-bold",
    captcha: "my-4 flex justify-center",
    captchaWidget: "mx-auto",
    socialButtonsBlockButton:
      "border-[2px] border-[#0a0a0a] bg-white hover:bg-[#f5f1ea] font-body rounded-none text-[#0a0a0a] shadow-[3px_3px_0_#0a0a0a] font-bold",
    socialButtonsBlockButtonText: "text-[#0a0a0a] font-bold",
    dividerLine: "bg-[#0a0a0a]",
    dividerText: "text-[#71717a] font-bold",
  },
} as const;
