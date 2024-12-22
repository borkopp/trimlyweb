import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MAIN_DOMAINS = ['fadely.app', 'www.fadely.app', 'localhost:3000', 'localhost'];
const CACHE_REVALIDATE_SECONDS = 60; // 1 minute

// Cache for barbershop data
const barbershopCache = new Map<string, {
  data: any;
  timestamp: number;
}>();

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get the hostname from the request
  const hostname = req.headers.get('host');
  console.log('Hostname:', hostname);

  // Skip middleware for api routes and static files
  if (req.nextUrl.pathname.startsWith('/_next') || 
      req.nextUrl.pathname.startsWith('/api') ||
      req.nextUrl.pathname.startsWith('/static') ||
      req.nextUrl.pathname.startsWith('/favicon.ico')) {
    return res;
  }

  // Normalize hostname (remove www if present)
  const normalizedHostname = hostname?.replace('www.', '') || '';

  // Check if it's a main domain
  const isMainDomain = MAIN_DOMAINS.includes(hostname!) || normalizedHostname === 'fadely.app';
  
  // Handle main domain access
  if (isMainDomain) {
    console.log('Main domain detected:', hostname);
    // Block access to tenant-specific routes on main domain
    if (req.nextUrl.pathname.startsWith('/dashboard') || 
        req.nextUrl.pathname.startsWith('/login') ||
        req.nextUrl.pathname.startsWith('/register')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return res;
  }

  // Handle subdomains
  let subdomain: string | null = null;
  
  // Check if it's a subdomain
  if (hostname?.includes('.fadely.app') || hostname?.includes('.localhost')) {
    subdomain = hostname.split('.')[0];
    // If the subdomain is www, treat it as main domain
    if (subdomain === 'www') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // If no subdomain is found and it's not a main domain, return 404
  if (!subdomain) {
    console.log('No subdomain found and not a main domain:', hostname);
    return NextResponse.rewrite(new URL('/404', req.url));
  }

  try {
    // Check cache first
    const cached = barbershopCache.get(subdomain);
    const now = Date.now();
    let barbershop;

    if (cached && (now - cached.timestamp) < CACHE_REVALIDATE_SECONDS * 1000) {
      barbershop = cached.data;
    } else {
      // Get barbershop data
      const { data, error } = await supabase
        .from('barbershops')
        .select('*')
        .eq('subdomain', subdomain)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Barbershop not found');

      barbershop = data;
      
      // Update cache
      barbershopCache.set(subdomain, {
        data: barbershop,
        timestamp: now
      });
    }

    // Create a new response with barbershop context
    const response = NextResponse.next();
    response.headers.set('x-barbershop-id', barbershop.id.toString());
    
    // Add cache control headers for static assets
    if (req.nextUrl.pathname.startsWith('/images') || 
        req.nextUrl.pathname.endsWith('.ico') ||
        req.nextUrl.pathname.endsWith('.png')) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }

    const path = req.nextUrl.pathname;
    const { data: { session } } = await supabase.auth.getSession();

    // Define public and protected routes
    const publicRoutes = ['/login', '/register', '/unauthorized', '/404'];
    const protectedRoutes = ['/dashboard'];
    const isPublicRoute = publicRoutes.some(route => path.startsWith(route));
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

    // Handle root path and marketing pages
    if (path === '/' || path === '/solution' || path === '/features' || path.startsWith('/#')) {
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Handle protected routes
    if (isProtectedRoute) {
      if (!session) {
        return NextResponse.redirect(new URL('/login', req.url));
      }

      // Verify user belongs to this barbershop
      const { data: profile } = await supabase
        .from('profiles')
        .select('barbershop_id')
        .eq('id', session.user.id)
        .single();

      if (!profile || profile.barbershop_id !== barbershop.id) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      // Check subscription status
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status, trial_end')
        .eq('barbershop_id', barbershop.id)
        .single();

      const isTrialExpired = subscription?.trial_end && 
        new Date(subscription.trial_end) < new Date();
      const isSubscriptionInactive = !subscription || 
        (subscription.status !== 'active' && subscription.status !== 'trialing');

      if (isTrialExpired && isSubscriptionInactive) {
        return NextResponse.redirect(new URL('/pricing', req.url));
      }
    }

    // Handle public routes
    if (isPublicRoute) {
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return response;
    }

    // Handle all other routes
    if (!isPublicRoute && !isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.rewrite(new URL('/404', req.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};