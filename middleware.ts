import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAIN_DOMAINS = [
  "fadely.app",
  "www.fadely.app",
  "localhost:3000",
  "localhost",
];
const CACHE_REVALIDATE_SECONDS = 60; // 1 minute
const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Cache for barbershop data with TTL
const barbershopCache = new Map<
  string,
  {
    data: any;
    timestamp: number;
    ttl: number;
  }
>();

// Route matching sets for O(1) lookup
const publicRoutes = new Set(["/login", "/register", "/unauthorized", "/404"]);
const protectedRoutes = new Set(["/dashboard"]);

// Cache cleanup function
const cleanupCache = () => {
  const now = Date.now();
  for (const [key, value] of barbershopCache.entries()) {
    if (now - value.timestamp > value.ttl) {
      barbershopCache.delete(key);
    }
  }
};

// Run cleanup periodically
let lastCleanup = Date.now();

export async function middleware(req: NextRequest) {
  // Early return for static assets to avoid unnecessary processing
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/api") ||
    req.nextUrl.pathname.startsWith("/static") ||
    req.nextUrl.pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get the hostname from the request
  const hostname = req.headers.get("host");

  // Conditional logging for development only
  if (process.env.NODE_ENV === "development") {
    console.log("Hostname:", hostname);
  }

  // Normalize hostname (remove www if present)
  const normalizedHostname = hostname?.replace("www.", "") || "";

  // Check if it's a main domain
  const isMainDomain =
    MAIN_DOMAINS.includes(hostname!) || normalizedHostname === "fadely.app";

  // Handle main domain access
  if (isMainDomain) {
    if (process.env.NODE_ENV === "development") {
      console.log("Main domain detected:", hostname);
    }
    // Block access to tenant-specific routes on main domain
    if (
      req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register")
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return res;
  }

  // Handle subdomains
  let subdomain: string | null = null;

  // Check if it's a subdomain
  if (hostname?.includes(".fadely.app") || hostname?.includes(".localhost")) {
    subdomain = hostname.split(".")[0];
    // If the subdomain is www, treat it as main domain
    if (subdomain === "www") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // If no subdomain is found and it's not a main domain, return 404
  if (!subdomain) {
    if (process.env.NODE_ENV === "development") {
      console.log("No subdomain found and not a main domain:", hostname);
    }
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  try {
    // Periodic cache cleanup
    const now = Date.now();
    if (now - lastCleanup > CACHE_CLEANUP_INTERVAL) {
      cleanupCache();
      lastCleanup = now;
    }

    // Check cache first
    const cached = barbershopCache.get(subdomain);
    let barbershop;

    if (cached && now - cached.timestamp < cached.ttl) {
      barbershop = cached.data;
    } else {
      // Get barbershop data with subscription info in one query
      const { data, error } = await supabase
        .from("barbershops")
        .select(
          `
          *,
          subscriptions!inner(status, trial_end)
        `
        )
        .eq("subdomain", subdomain)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Barbershop not found");

      barbershop = data;

      // Update cache with TTL
      barbershopCache.set(subdomain, {
        data: barbershop,
        timestamp: now,
        ttl: CACHE_REVALIDATE_SECONDS * 1000,
      });
    }

    // Create a new response with barbershop context
    const response = NextResponse.next();
    response.headers.set("x-barbershop-id", barbershop.id.toString());

    // Add cache control headers for static assets
    if (
      req.nextUrl.pathname.startsWith("/images") ||
      req.nextUrl.pathname.endsWith(".ico") ||
      req.nextUrl.pathname.endsWith(".png")
    ) {
      response.headers.set(
        "Cache-Control",
        "public, max-age=31536000, immutable"
      );
    }

    const path = req.nextUrl.pathname;
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Use Set for O(1) route matching
    const isPublicRoute = publicRoutes.has(path);
    const isProtectedRoute = protectedRoutes.has(path);

    // Handle root path and marketing pages
    if (
      path === "/" ||
      path === "/solution" ||
      path === "/features" ||
      path.startsWith("/#")
    ) {
      if (session) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Handle protected routes
    if (isProtectedRoute) {
      if (!session) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // Verify user belongs to this barbershop
      const { data: profile } = await supabase
        .from("profiles")
        .select("barbershop_id")
        .eq("id", session.user.id)
        .single();

      if (!profile || profile.barbershop_id !== barbershop.id) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      // Check subscription status using cached data
      const subscription = barbershop.subscriptions;
      const isTrialExpired =
        subscription?.trial_end &&
        new Date(subscription.trial_end) < new Date();
      const isSubscriptionInactive =
        !subscription ||
        (subscription.status !== "active" &&
          subscription.status !== "trialing");

      if (isTrialExpired && isSubscriptionInactive) {
        return NextResponse.redirect(new URL("/pricing", req.url));
      }
    }

    // Handle public routes
    if (isPublicRoute) {
      if (session) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return response;
    }

    // Handle all other routes
    if (!isPublicRoute && !isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.rewrite(new URL("/404", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
