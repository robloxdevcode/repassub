type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM?.trim());
}

export async function sendTransactionalEmail(input: SendEmailInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  if (!apiKey || !from) {
    return { ok: false, error: "Email not configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text ?? input.html.replace(/<[^>]+>/g, " "),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[sendTransactionalEmail]", res.status, body);
      return { ok: false, error: "Could not send email" };
    }

    return { ok: true };
  } catch (error) {
    console.error("[sendTransactionalEmail]", error);
    return { ok: false, error: "Could not send email" };
  }
}
