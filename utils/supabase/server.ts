import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { tenantContext } from "@/lib/tenant-context";

export async function createClient() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Extract the domain (e.g., 'fadely.app' or 'localhost:3000')
  const domain = isDevelopment ? 'localhost' : host.split(':')[0].split('.').slice(-2).join('.');

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
              // Set domain to the root domain to allow sharing between subdomains if needed
              domain: isDevelopment ? undefined : `.${domain}`,
              // Make sure the cookie is only sent over HTTPS in production
              secure: !isDevelopment,
              // Prevent JavaScript access to help mitigate XSS attacks
              httpOnly: true,
              // Strict same-site policy
              sameSite: 'lax',
              // Set path to root to allow access from all pages
              path: '/',
            });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value: "",
              ...options,
              domain: isDevelopment ? undefined : `.${domain}`,
              secure: !isDevelopment,
              httpOnly: true,
              sameSite: 'lax',
              path: '/',
              maxAge: 0,
            });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  try {
    const tenant = await tenantContext.getTenantContext();
    console.log("tenantContext", JSON.stringify(tenant));
    if (!tenant.isMainDomain && tenant.id > 0) {
      const { error } = await client.rpc('set_tenant_context', { tenant_id: tenant.id });
      if (error) {
        console.warn("rpc set_tenant_context failed", JSON.stringify(error));
      } else {
        console.log("rpc set_tenant_context ok", tenant.id);
      }
    }
    if (tenant.isMainDomain || tenant.id <= 0) {
      const { data: { user } } = await client.auth.getUser();
      console.log("auth user", user ? user.id : null);
      if (user) {
        const { data: profile } = await client
          .from('profiles')
          .select('barbershop_id')
          .eq('id', user.id)
          .single();
        console.log("profile barbershop_id", profile ? profile.barbershop_id : null);
        if (profile && profile.barbershop_id && profile.barbershop_id > 0) {
          const { error } = await client.rpc('set_tenant_context', { tenant_id: profile.barbershop_id });
          if (error) {
            console.warn("rpc set_tenant_context(profile) failed", JSON.stringify(error));
          } else {
            console.log("rpc set_tenant_context(profile) ok", profile.barbershop_id);
          }
        } else {
          const { error } = await client.rpc('set_tenant_context', { tenant_id: 0 });
          if (error) {
            console.warn("rpc set_tenant_context(0) failed", JSON.stringify(error));
          } else {
            console.log("rpc set_tenant_context(0) ok");
          }
        }
      } else {
        const { error } = await client.rpc('set_tenant_context', { tenant_id: 0 });
        if (error) {
          console.warn("rpc set_tenant_context(0,no-user) failed", JSON.stringify(error));
        } else {
          console.log("rpc set_tenant_context(0,no-user) ok");
        }
      }
    }
  } catch (_e) {}

  return client;
}

export async function createCachedClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get() {
          return undefined;
        },
        set() {
          // No-op for cached client
        },
        remove() {
          // No-op for cached client
        },
      },
    }
  );
}
