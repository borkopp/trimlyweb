import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Configuration
const MAIN_DOMAINS = ['fadely.app', 'www.fadely.app', 'localhost:3000', 'localhost'];
const TENANT_CACHE_TTL = 300; // 5 minutes
const STATIC_ASSET_PATHS = ['/_next', '/api', '/static', '/favicon.ico', '/images'];

// Enhanced cache with TTL and automatic cleanup
class TenantCache {
  private cache = new Map<string, { data: any; expires: number }>();
  private cleanupInterval: NodeJS.Timeout;
  
  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (now > item.expires) {
          this.cache.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }
  
  set(key: string, value: any, ttlSeconds: number = TENANT_CACHE_TTL) {
    this.cache.set(key, {
      data: value,
      expires: Date.now() + (ttlSeconds * 1000)
    });
  }
  
  get(key: string) {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }
  
  clear() {
    this.cache.clear();
  }
  
  destroy() {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

const tenantCache = new TenantCache();

// Production rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // Max 100 requests per minute per IP

// Track redirect attempts to prevent loops
const redirectAttempts = new Map<string, { count: number; resetTime: number }>();
const REDIRECT_LIMIT_WINDOW = 30000; // 30 seconds
const MAX_REDIRECTS = 3; // Max 3 redirects per 30 seconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const key = ip;
  const current = requestCounts.get(key);
  
  if (!current || now > current.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  current.count++;
  return true;
}

function checkRedirectLimit(ip: string, pathname: string): boolean {
  const now = Date.now();
  const key = `${ip}:${pathname}`;
  const current = redirectAttempts.get(key);
  
  if (!current || now > current.resetTime) {
    redirectAttempts.set(key, { count: 1, resetTime: now + REDIRECT_LIMIT_WINDOW });
    return true;
  }
  
  if (current.count >= MAX_REDIRECTS) {
    return false;
  }
  
  current.count++;
  return true;
}

// Route configuration
const ROUTES = {
  PUBLIC: ['/login', '/register', '/unauthorized', '/404', '/pricing'],
  PROTECTED: ['/dashboard'],
  MARKETING: ['/', '/solution', '/features', '/contact'],
  STATIC: STATIC_ASSET_PATHS
} as const;

// Utility functions
function isStaticAsset(pathname: string): boolean {
  return ROUTES.STATIC.some(route => pathname.startsWith(route)) ||
         /\.(png|jpg|jpeg|gif|svg|ico|webp|avif|css|js)$/i.test(pathname);
}

function isMainDomain(hostname: string): boolean {
  return MAIN_DOMAINS.includes(hostname) || hostname.replace('www.', '') === 'fadely.app';
}

function extractSubdomain(hostname: string): string | null {
  if (hostname.includes('.fadely.app') || hostname.includes('.localhost')) {
    const subdomain = hostname.split('.')[0];
    return subdomain === 'www' ? null : subdomain;
  }
  return null;
}

function isRouteType(pathname: string, type: keyof typeof ROUTES): boolean {
  return ROUTES[type].some(route => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(route);
  });
}

// Tenant resolution with caching
async function resolveTenant(subdomain: string, supabase: any) {
  const cacheKey = `tenant:${subdomain}`;
  let tenant = tenantCache.get(cacheKey);
  
  if (!tenant) {
    const { data, error } = await supabase
      .from('barbershops')
      .select('id, name, subdomain')
      .eq('subdomain', subdomain)
      .single();
    
    if (error || !data) {
      throw new Error(`Tenant not found: ${subdomain}`);
    }
    
    tenant = data;
    tenantCache.set(cacheKey, tenant);
  }
  
  return tenant;
}

// Enhanced authentication check
async function verifyUserAccess(supabase: any, barbershopId: number) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      return { authorized: false, reason: 'session_error' };
    }
    
    if (!session) {
      return { authorized: false, reason: 'no_session' };
    }
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('barbershop_id, is_admin, role')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      return { authorized: false, reason: 'profile_error' };
    }
    
    if (!profile || profile.barbershop_id !== barbershopId) {
      return { authorized: false, reason: 'wrong_tenant' };
    }
    
    return { authorized: true, profile };
  } catch (error) {
    return { authorized: false, reason: 'unexpected_error' };
  }
}

// Subscription status check
async function checkSubscriptionStatus(supabase: any, barbershopId: number) {
  // TODO: Implement proper subscription checking based on user_id
  // For now, return valid to allow access
  return { valid: true };
}

// Main proxy function
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  
  // Check rate limit
  if (!checkRateLimit(ip)) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  
  // Check redirect limit to prevent loops
  if (!checkRedirectLimit(ip, pathname)) {
    return new NextResponse('Too Many Redirects', { status: 429 });
  }
  
  // Skip static assets and API routes
  if (isStaticAsset(pathname)) {
    const res = NextResponse.next();
    
    // Add cache headers for static assets
    if (pathname.startsWith('/images') || /\.(ico|png|jpg|jpeg|gif|svg|webp|avif)$/i.test(pathname)) {
      res.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
    
    return addSecurityHeaders(res);
  }
  
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  try {
    // Handle main domain
    if (isMainDomain(hostname)) {
      if (isRouteType(pathname, 'PROTECTED') || isRouteType(pathname, 'PUBLIC')) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return res;
    }
    
    // Extract and validate subdomain
    const subdomain = extractSubdomain(hostname);
    if (!subdomain) {
      return NextResponse.rewrite(new URL('/404', req.url));
    }
    
    // Resolve tenant
    const tenant = await resolveTenant(subdomain, supabase);
    
    // Set tenant context
    res.headers.set('x-barbershop-id', tenant.id.toString());
    res.headers.set('x-tenant-subdomain', tenant.subdomain);
    res.cookies.set('barbershop-id', tenant.id.toString(), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    // Handle marketing pages
    if (isRouteType(pathname, 'MARKETING')) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      // Redirect root path to login, but allow other marketing pages
      if (pathname === '/') {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
    
    // Handle protected routes
    if (isRouteType(pathname, 'PROTECTED')) {
      const authResult = await verifyUserAccess(supabase, tenant.id);
      
      if (!authResult.authorized) {
        if (authResult.reason === 'no_session') {
          return NextResponse.redirect(new URL('/login', req.url));
        }
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
      
      // Check subscription status
      const subscriptionResult = await checkSubscriptionStatus(supabase, tenant.id);
      if (!subscriptionResult.valid) {
        return NextResponse.redirect(new URL('/pricing', req.url));
      }
    }
    
    // Handle public routes
    if (isRouteType(pathname, 'PUBLIC')) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user has access to this tenant before redirecting
        const authResult = await verifyUserAccess(supabase, tenant.id);
        if (authResult.authorized) {
          // Only redirect if not already on dashboard
          if (pathname !== '/dashboard') {
            return NextResponse.redirect(new URL('/dashboard', req.url));
          }
        } else {
          // User is authenticated but doesn't have access to this tenant
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }
      }
    }
    
    return addSecurityHeaders(res);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return addSecurityHeaders(NextResponse.rewrite(new URL('/404', req.url)));
  }
}

// Add security headers
function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
