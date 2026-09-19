export type FaqItem = { q: string; a: string };

export const FAQ_SECTIONS: { title: string; items: FaqItem[] }[] = [
  {
    title: "For fans (unlock pages)",
    items: [
      {
        q: "Why does it say verifying for about 10 seconds?",
        a: "After you tap a step and complete the action on YouTube, Instagram, TikTok, or another site, Linklock waits ~10 seconds before marking it complete. That gives you time to actually subscribe, follow, or join — then the step turns green.",
      },
      {
        q: "How do fan steps work?",
        a: "Each step opens a link (subscribe, follow, join Discord, visit a site, etc.). Finish every step and the download or content unlocks. You don't need a Linklock account to unlock.",
      },
      {
        q: "A step won't turn green — what do I do?",
        a: "Make sure you completed the action in the other tab, then wait the full verify timer. Refresh and try the step again if needed.",
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
        a: "Free: unlimited links, up to 4 steps per link, views & unlock stats, Linklock ads on pages. Pro: up to 10 steps, your logo/colors/music/video, advanced analytics (sources, devices, countries), and no Linklock branding on unlock pages.",
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
