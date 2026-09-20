import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

/** Site-wide maintenance: set LINKLOCK_MAINTENANCE=false to restore full site */
const MAINTENANCE_MODE = process.env.LINKLOCK_MAINTENANCE !== "false";

const isPublicRoute = createRouteMatcher([

  "/",

  "/sign-in(.*)",

  "/sign-up(.*)",

  "/forgot-password(.*)",

  "/features(.*)",

  "/how-it-works(.*)",

  "/pricing(.*)",

  "/creators(.*)",

  "/use-cases(.*)",

  "/alternatives(.*)",

  "/grow(.*)",

  "/about(.*)",

  "/docs(.*)",

  "/blog(.*)",

  "/terms(.*)",

  "/privacy(.*)",

  "/refund-policy(.*)",

  "/help(.*)",

  "/leaderboard(.*)",

  "/support(.*)",

  "/suspended(.*)",

  "/u/(.*)",

  "/api/webhooks(.*)",

  "/api/events(.*)",

  "/feed.xml",

]);



const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);



/** Only the homepage redirects signed-in users to the dashboard. */

const isHomepage = createRouteMatcher(["/"]);



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

  if (MAINTENANCE_MODE) {
    if (pathname.startsWith("/api/webhooks")) {
      return NextResponse.next();
    }
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { ok: false, message: "Linklock is temporarily down. Please try again later." },
        { status: 503 },
      );
    }
    if (pathname === "/ads.txt") {
      return NextResponse.next();
    }
    if (pathname !== "/") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url, 307);
    }
    return NextResponse.next();
  }

  /* Optional: LINKLOCK_SIMPLE_PUBLIC=true → home + app only */
  const simplePublic = process.env.LINKLOCK_SIMPLE_PUBLIC === "true";
  if (simplePublic) {
    const productPath =
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/unlocks") ||
      pathname.startsWith("/create") ||
      pathname.startsWith("/analytics") ||
      pathname.startsWith("/audience") ||
      pathname.startsWith("/settings") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/billing") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/sign-in") ||
      pathname.startsWith("/sign-up") ||
      pathname.startsWith("/forgot-password") ||
      pathname.startsWith("/welcome") ||
      pathname.startsWith("/u/") ||
      pathname.startsWith("/suspended") ||
      pathname.startsWith("/privacy") ||
      pathname.startsWith("/terms") ||
      pathname.startsWith("/refund-policy") ||
      pathname === "/";
    if (!productPath && !pathname.startsWith("/api/")) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url, 307);
    }
  }

  if (pathname.toLowerCase() === "/ads.txt" && pathname !== "/ads.txt") {
    return NextResponse.redirect(new URL("/ads.txt", req.url), 301);
  }

  if (pathname === "/ads.txt") {
    return NextResponse.next();
  }



  if (host.startsWith("app.") && pathname === "/") {

    return NextResponse.redirect(new URL("/dashboard", req.url));

  }



  if (pathname === "/examples" || pathname.startsWith("/examples/")) {

    return NextResponse.redirect(new URL("/", req.url));

  }



  const ref = req.nextUrl.searchParams.get("ref")?.trim().toLowerCase();

  const refValid = ref && /^[a-z0-9_]{3,30}$/.test(ref);



  const { userId } = await auth();



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



  if (refValid) {

    const res = NextResponse.next();

    res.cookies.set("ll_ref", ref!, {

      maxAge: 60 * 60 * 24 * 30,

      path: "/",

      sameSite: "lax",

    });

    return res;

  }

});



export const config = {

  matcher: [

    "/ads.txt",

    "/Ads.txt",

    "/ADS.TXT",

    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    "/(api|trpc)(.*)",

  ],

};

