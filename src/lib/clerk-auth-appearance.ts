export const clerkAuthAppearance = {
  variables: {
    colorPrimary: "#818cf8",
    colorBackground: "#0f0f12",
    colorInputBackground: "#16161c",
    colorText: "#fafafa",
    colorTextSecondary: "#a1a1aa",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "mx-auto w-full max-w-md",
    card: "bg-[#0f0f12] border border-[#2a2a32] shadow-lg rounded-xl font-body",
    headerTitle: "font-body text-lg font-semibold text-[#fafafa]",
    headerSubtitle: "font-body text-sm text-[#a1a1aa]",
    formButtonPrimary:
      "bg-[#818cf8] hover:bg-[#6366f1] text-white font-semibold rounded-lg transition-transform active:scale-[0.98]",
    formFieldInput:
      "bg-[#16161c] border border-[#2a2a32] text-[#fafafa] font-body rounded-lg",
    formFieldLabel: "font-body text-sm font-medium text-[#fafafa]",
    formFieldErrorText: "font-body text-sm text-retro-error font-medium",
    alertText: "font-body text-sm text-retro-error",
    footerActionLink: "text-[#a5b4fc] font-semibold underline",
    identityPreviewText: "font-body text-sm text-[#fafafa]",
    formFieldSuccessText: "font-body text-sm text-[#34d399]",
    captcha: "my-4 flex justify-center",
    captchaWidget: "mx-auto",
    socialButtonsBlockButton:
      "border border-[#2a2a32] bg-[#16161c] hover:bg-[#1c1c24] font-body rounded-lg text-[#fafafa] [&_*]:text-[#fafafa]",
    socialButtonsBlockButtonText: "text-[#fafafa] font-medium",
    dividerLine: "bg-[#2a2a32]",
    dividerText: "text-[#71717a]",
  },
} as const;
