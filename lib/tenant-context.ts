import { headers } from "next/headers";
import { createCachedClient } from "@/utils/supabase/server";

export interface TenantContext {
  id: number;
  subdomain: string;
  name: string;
  isMainDomain: boolean;
  notFound?: boolean;
}

export interface TenantUser {
  id: string;
  barbershopId: number;
  role: string;
  isAdmin: boolean;
  fullName?: string;
  email?: string;
}

// Enhanced tenant context with caching
class TenantContextManager {
  private static instance: TenantContextManager;
  private cache = new Map<
    string,
    { context: TenantContext; expires: number }
  >();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): TenantContextManager {
    if (!TenantContextManager.instance) {
      TenantContextManager.instance = new TenantContextManager();
    }
    return TenantContextManager.instance;
  }

  async getTenantContext(): Promise<TenantContext> {
    const headersList = await headers();
    const forwardedHost = headersList.get("x-forwarded-host") || "";
    const host = headersList.get("host") || "";
    const hostname = (forwardedHost || host).replace(/^www\./, "");
    const isMain =
      hostname === "fadely.app" ||
      hostname === "localhost" ||
      hostname === "localhost:3000" ||
      hostname === "localhost:3001";

    if (isMain) {
      return { id: 0, subdomain: "main", name: "Fadely", isMainDomain: true };
    }

    const parts = hostname.split(".");
    const isSub = hostname.endsWith("fadely.app") && parts.length > 2;
    const sub = isSub ? parts[0] : null;

    if (!sub) {
      return { id: 0, subdomain: "main", name: "Fadely", isMainDomain: true };
    }

    const cacheKey = `tenant:sub:${sub}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() < cached.expires) {
      return cached.context;
    }

    const supabase = await createCachedClient();
    const { data: tenant } = await supabase
      .from("barbershops")
      .select("id, name, subdomain")
      .eq("subdomain", sub)
      .single();

    if (!tenant) {
      const context: TenantContext = {
        id: 0,
        subdomain: sub,
        name: sub,
        isMainDomain: false,
        notFound: true,
      };
      this.cache.set(cacheKey, {
        context,
        expires: Date.now() + this.CACHE_TTL,
      });
      return context;
    }

    const context: TenantContext = {
      id: tenant.id,
      subdomain: tenant.subdomain,
      name: tenant.name,
      isMainDomain: false,
    };
    this.cache.set(cacheKey, { context, expires: Date.now() + this.CACHE_TTL });
    return context;
  }

  async getTenantUser(): Promise<TenantUser | null> {
    const supabase = await createCachedClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, barbershop_id, role, is_admin, full_name, email")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      barbershopId: profile.barbershop_id,
      role: profile.role,
      isAdmin: profile.is_admin || false,
      fullName: profile.full_name,
      email: profile.email,
    };
  }

  clearCache() {
    this.cache.clear();
  }

  clearTenantCache(barbershopId: number) {
    this.cache.delete(`tenant:${barbershopId}`);
  }
}

export const tenantContext = TenantContextManager.getInstance();

// Hook for components to access tenant context
export async function useTenantContext(): Promise<TenantContext> {
  return await tenantContext.getTenantContext();
}

export async function useTenantUser(): Promise<TenantUser | null> {
  return await tenantContext.getTenantUser();
}

// Utility functions
export function isMainDomain(hostname: string): boolean {
  const h = (hostname || "").replace(/^www\./, "");
  return h === "fadely.app" || h === "localhost" || h === "localhost:3000" || h === "localhost:3001";
}

export function extractSubdomain(hostname: string): string | null {
  const h = (hostname || "").replace(/^www\./, "");
  if (!h.endsWith("fadely.app")) return null;
  const parts = h.split(".");
  if (parts.length <= 2) return null;
  const sub = parts[0];
  return sub === "www" ? null : sub;
}
