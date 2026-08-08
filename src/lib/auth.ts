import { auth, currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@prisma/client";
import { db } from "./db";

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      subscriptions: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  if (user.banned) throw new Error("Account suspended");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== UserRole.ADMIN) throw new Error("Forbidden");
  return user;
}

export async function syncClerkUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  const username =
    clerkUser.username ||
    clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0] ||
    `player${clerkUser.id.slice(-6)}`;

  const existing = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (existing) {
    return db.user.update({
      where: { clerkId: clerkUser.id },
      data: {
        email,
        displayName: clerkUser.fullName || existing.displayName,
        avatarUrl: clerkUser.imageUrl || existing.avatarUrl,
      },
    });
  }

  let finalUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, "");
  if (finalUsername.length < 3) finalUsername = `player${clerkUser.id.slice(-6)}`;

  let suffix = 0;
  while (
    await db.user.findUnique({
      where: { username: suffix ? `${finalUsername}${suffix}` : finalUsername },
    })
  ) {
    suffix++;
  }

  const user = await db.user.create({
    data: {
      clerkId: clerkUser.id,
      username: suffix ? `${finalUsername}${suffix}` : finalUsername,
      displayName: clerkUser.fullName || finalUsername,
      email,
      avatarUrl: clerkUser.imageUrl,
      subscriptions: {
        create: { plan: "FREE", status: "ACTIVE" },
      },
    },
  });

  return user;
}

export async function isAppSubdomain(host: string): Promise<boolean> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  try {
    const appHost = new URL(appUrl).hostname;
    return host.startsWith("app.") || host === appHost;
  } catch {
    return host.startsWith("app.");
  }
}
