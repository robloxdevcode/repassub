import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, email_addresses, username, first_name, last_name, image_url } = evt.data;
    const email = email_addresses?.[0]?.email_address;
    const displayName = [first_name, last_name].filter(Boolean).join(" ") || username;
    let finalUsername = (username || email?.split("@")[0] || `player${id.slice(-6)}`)
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");

    if (finalUsername.length < 3) finalUsername = `player${id.slice(-6)}`;

    const existing = await db.user.findUnique({ where: { clerkId: id } });

    if (existing) {
      const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const role = adminEmail && email?.trim().toLowerCase() === adminEmail ? "ADMIN" : "USER";

      await db.user.update({
        where: { clerkId: id },
        data: { email, displayName, avatarUrl: image_url, role },
      });
    } else {
      let suffix = 0;
      let checkUsername = finalUsername;
      while (await db.user.findUnique({ where: { username: checkUsername } })) {
        suffix++;
        checkUsername = `${finalUsername}${suffix}`;
      }

      const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const role = adminEmail && email?.trim().toLowerCase() === adminEmail ? "ADMIN" : "USER";

      await db.user.create({
        data: {
          clerkId: id,
          username: checkUsername,
          displayName: displayName || checkUsername,
          email,
          avatarUrl: image_url,
          role,
          subscriptions: { create: { plan: "FREE", status: "ACTIVE" } },
        },
      });
    }
  }

  if (evt.type === "user.deleted") {
    const { id } = evt.data;
    await db.user.deleteMany({ where: { clerkId: id! } });
  }

  return new Response("OK", { status: 200 });
}
