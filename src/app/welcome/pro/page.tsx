import { redirect } from "next/navigation";
import { fulfillCheckoutSession, syncProSubscriptionFromStripe } from "@/lib/actions/payments";

export default async function ProWelcomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sessionId = typeof params.session_id === "string" ? params.session_id : undefined;

  if (sessionId) {
    try {
      await fulfillCheckoutSession(sessionId);
    } catch {
      await syncProSubscriptionFromStripe();
    }
  }

  redirect("/dashboard?upgraded=1");
}
