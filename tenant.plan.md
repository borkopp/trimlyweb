# Simplify Multi-Tenant Middleware to Eliminate Redirect Loops

## Decisions

- Keep subdomain tenants (tenant.fadely.app)
- On unauthenticated tenant root visits, render the login page (no middleware redirects)

## What we’ll change

- Remove all redirects and DB calls from middleware. Middleware will only:
  - Detect subdomain safely (respecting x-forwarded-host)
  - Set a cookie with the subdomain
  - Never redirect
- Move authentication and tenant existence checks into page/layout server code where needed (single, explicit redirects at the page level only).
- Make tenant context resolve lazily in server code; do not depend on middleware headers.

## Files to edit

- proxy.ts (replace with minimal, non-redirecting middleware; keep export shape to match current re-export)
- lib/tenant-context.ts (derive subdomain from host; lazy fetch tenant; safe defaults; no throws that cause loops)
- utils/supabase/tenant-client.ts (keep, but remove reliance on middleware headers)
- lib/tenant-rls.ts and lib/tenant-management.ts (no functional change; rely on new context)

## Key edits

### proxy.ts — loop-proof middleware

- No rate limit/redirect logic.
- No DB calls.
- Respect `x-forwarded-host` for Cloudflare Tunnel.
- Set `tenant-subdomain` cookie when a tenant subdomain is detected.
- Preserve existing export contract (if a `middleware.ts` re-exports `proxy as middleware`, we keep `export function proxy` and add `export const middleware = proxy`).

Proposed replacement (concise):

```ts
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
```

### lib/tenant-context.ts — compute subdomain from host and avoid throws

- Read host via `headers()`; fall back to `x-forwarded-host`.
- If main domain, return `{ id: 0, subdomain: 'main', name: 'Fadely', isMainDomain: true }`.
- If subdomain present, fetch tenant once (with cache). If not found, return `{ id: 0, subdomain, name: subdomain, isMainDomain: false }` plus a `notFound` boolean instead of throwing. Pages can render a tenant-not-found UI.
- Remove dependency on `x-barbershop-id` and `x-tenant-subdomain` headers.

Essential helpers:

```ts
function normalize(host: string) {
  return (host || "").replace(/^www\./, "");
}
function getSubdomain(host: string) {
  const h = normalize(host);
  if (!h.endsWith("fadely.app")) return null;
  const [sub] = h.split(".");
  return sub === "www" ? null : sub;
}
```

### utils/supabase/tenant-client.ts — keep cookie domain logic

- Continue to call `tenantContext.getTenantContext()`; do not rely on middleware headers.
- Only call `set_tenant_context` when `!tenant.isMainDomain` and a valid `tenant.id` exists.

### Page-level guards (no middleware redirects)

- In the dashboard layout/server component, perform the single redirect: if no session -> redirect('/login').
- On tenant root (`/` under a tenant subdomain), render the login page component directly; do not redirect from middleware.
- For authenticated users hitting `/login`, optionally redirect to `/dashboard` at the page component level only (not middleware).

## Why this prevents loops

- Middleware cannot loop because it never redirects or rewrites.
- Only page components perform at most one redirect based on a simple, stable condition.
- Hostname parsing is normalized and proxy-aware, avoiding misclassification of main vs subdomain that previously caused bounce behavior.

## Optional hardening

- Exclude `/login` and `/callback` from any page-level auto-redirects to further reduce risk.
- Add an env flag `TENANT_MODE=off` to force main-domain behavior if needed for emergency rollback.

## Implementation todos

- proxy-edit: Replace `proxy.ts` with minimal loop-proof version
- context-update: Update `lib/tenant-context.ts` to compute subdomain from host; lazy fetch; avoid throws
- client-update: Ensure `utils/supabase/tenant-client.ts` no longer reads middleware headers
- page-guards: Move redirects to page/layout level only
- verify: Test main and subdomain flows (anon/authed); confirm no loops
