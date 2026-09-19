export function checkoutErrorMessage(error: unknown) {
  const message = typeof error === "string" ? error : error instanceof Error ? error.message : "";
  if (message === "Unauthorized" || message === "Sign in again to upgrade.") {
    return "Sign in first, then try upgrading again.";
  }
  if (message === "Sign in again to manage billing.") {
    return "Sign in again to open billing.";
  }
  if (message === "Account suspended") {
    return "Your account is suspended. Contact support if you need help.";
  }
  if (message === "Already subscribed") {
    return "You're already on Pro. Open Plan & billing to manage your subscription.";
  }
  if (message === "No billing account") {
    return "No billing account yet. Upgrade to Pro first, then you can manage billing.";
  }
  if (message.includes("Stripe not configured")) {
    return "Payments aren't configured on this server yet.";
  }
  if (message.includes("Billing portal not configured")) {
    return "Billing portal isn't set up yet. Contact support.";
  }
  if (message.includes("paypal") || message.includes("PayPal")) {
    return "PayPal isn't enabled on our Stripe account yet. Try card, Apple Pay, or Google Pay.";
  }
  return "Something went wrong. Try again in a moment.";
}
