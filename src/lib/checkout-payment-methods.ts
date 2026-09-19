/** Card, PayPal (+ Apple Pay / Google Pay wallets when enabled in Stripe Dashboard). */
export function getCheckoutPaymentMethodTypes(): ("card" | "paypal")[] {
  return ["card", "paypal"];
}
