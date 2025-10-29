import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAIN = ["fadely.app", "www.fadely.app"];
const STATIC_PREFIXES = ["/_next", "/api", "/favicon.ico", "/images"];

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (STATIC_PREFIXES.some((p) => pathname.startsWith(p)))
    return NextResponse.next();

  const host =
    req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const normalized = host.replace(/^www\./, "");
  if (MAIN.includes(normalized)) return NextResponse.next();

  const isSub =
    normalized.endsWith("fadely.app") && normalized.split(".").length > 2;
  const res = NextResponse.next();
  if (isSub) {
    const sub = normalized.split(".")[0];
    res.cookies.set("tenant-subdomain", sub, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }
  return res;
}

export const middleware = proxy;

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|robots.txt|sitemap.xml).*)"],
};
