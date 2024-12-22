import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const domain = isDevelopment ? 'localhost' : window.location.hostname.split('.').slice(-2).join('.');

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`));
          return cookie ? cookie.split('=')[1] : undefined;
        },
        set(name: string, value: string, options: { domain?: string; path?: string; sameSite?: string; secure?: boolean }) {
          let cookieString = `${name}=${value}`;
          if (options.domain) cookieString += `; domain=${options.domain}`;
          if (options.path) cookieString += `; path=${options.path}`;
          if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;
          if (options.secure) cookieString += '; secure';
          document.cookie = cookieString;
        },
        remove(name: string, options: { domain?: string; path?: string }) {
          let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          if (options.domain) cookieString += `; domain=${options.domain}`;
          if (options.path) cookieString += `; path=${options.path}`;
          document.cookie = cookieString;
        },
      },
    }
  );
}
