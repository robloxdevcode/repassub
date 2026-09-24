export type FaqItem = { q: string; a: string };

export const FAQ_SECTIONS: { title: string; items: FaqItem[] }[] = [
  {
    title: "For fans (unlock pages)",
    items: [
      {
        q: "Why does a step show “Verifying step…”?",
        a: "After you tap a step and complete the action on YouTube, Instagram, TikTok, or another site, Linklock checks that you actually visited the link (including time away from this tab) before marking it complete. There’s no countdown — just wait until the step turns green.",
      },
      {
        q: "How do fan steps work?",
        a: "Each step opens a link (subscribe, follow, join Discord, visit a site, etc.). Finish every step and the download or content unlocks. You don't need a Linklock account to unlock.",
      },
      {
        q: "A step won't turn green — what do I do?",
        a: "Complete the action in the other tab, stay there at least a few seconds, then come back. If you return too quickly, you'll be asked to redo the quest. Tap the step again if needed.",
      },
    ],
  },
  {
    title: "For creators",
    items: [
      {
        q: "What can I gate behind a link?",
        a: "File links, download URLs, text codes, keys, or messages. Paste what fans should get after they complete your steps.",
      },
      {
        q: "Which platforms work as steps?",
        a: "YouTube, Instagram, TikTok, Spotify, Discord, Twitch, X, and custom visit links. Paste the URL and we detect the platform.",
      },
      {
        q: "Free vs Pro — what's the difference?",
        a: "Free: unlimited links, 1 step per link, views & unlock stats, Linklock ads on pages. Pro: up to 5 steps, your logo/colors/music/video, full funnel analytics (sources, devices, countries, drop-off), Pro themes, and no Linklock branding or ads on unlock pages.",
      },
    ],
  },
  {
    title: "Billing & refunds",
    items: [
      {
        q: "How do I upgrade to Pro?",
        a: "Open Plan & billing in your dashboard or visit Pricing while signed in. Checkout supports card, PayPal, Apple Pay, and Google Pay via Stripe.",
      },
      {
        q: "What's your refund policy?",
        a: "Subscriptions are handled by Stripe. See our Refund Policy page for details. You can cancel anytime from Plan & billing — access continues until the end of your billing period.",
      },
    ],
  },
];
