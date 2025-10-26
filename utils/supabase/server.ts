import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { headers } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Extract the domain (e.g., 'fadely.app' or 'localhost:3000')
  const domain = isDevelopment ? 'localhost' : host.split(':')[0].split('.').slice(-2).join('.');

  return createServerClient(
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
