import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "/features(.*)",
  "/how-it-works(.*)",
  "/pricing(.*)",
  "/examples(.*)",
  "/creators(.*)",
  "/use-cases(.*)",
  "/docs(.*)",
  "/blog(.*)",
  "/terms(.*)",
  "/privacy(.*)",
  "/refund-policy(.*)",
  "/support(.*)",
  "/u/(.*)",
  "/api/webhooks(.*)",
  "/api/events(.*)",
]);

const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

const isAppRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/unlocks(.*)",
  "/create(.*)",
  "/analytics(.*)",
  "/audience(.*)",
  "/settings(.*)",
  "/profile(.*)",
  "/billing(.*)",
  "/welcome/pro(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const host = req.headers.get("host") || "";
  const pathname = req.nextUrl.pathname;

  if (host.startsWith("app.") && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const { userId } = await auth();

  if (pathname === "/" && userId) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isAuthRoute(req) && userId) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isAdminRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  if (isAppRoute(req) && !isPublicRoute(req)) {
    await auth.protect();
  }

  if (!isPublicRoute(req) && !isAppRoute(req) && !isAdminRoute(req)) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/unlocks") ||
      pathname.startsWith("/create") ||
      pathname.startsWith("/analytics") ||
      pathname.startsWith("/audience") ||
      pathname.startsWith("/settings") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/billing") ||
      pathname.startsWith("/welcome/pro")
    ) {
      await auth.protect();
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
