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

  // Check if it's a main domain first
  if (MAIN_DOMAINS.includes(hostname!) || normalizedHostname === 'fadely.app') {
    console.log('Main domain detected:', hostname);
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
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
      if (req.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return res;
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

    // For subdomains:
    // 1. Redirect root path to dashboard
    // 2. Only allow access to dashboard routes and auth routes
    const path = req.nextUrl.pathname;
    if (path === '/') {
      const dashboardRedirect = NextResponse.redirect(new URL('/dashboard', req.url));
      dashboardRedirect.headers.set('x-barbershop-id', barbershop.id.toString());
      return dashboardRedirect;
    }

    // Allow access only to dashboard, auth, and necessary public routes
    const allowedPaths = [
      '/dashboard',
      '/login',
      '/register',
      '/unauthorized',
      '/404',
      '/pricing',
      '/api/trpc', // If using tRPC
      '/api/webhooks', // For payment webhooks etc.
      '/favicon.ico'
    ];

    const isAllowedPath = allowedPaths.some(allowedPath => 
      path.startsWith(allowedPath)
    );

    if (!isAllowedPath) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Check authentication for dashboard routes
    if (path.startsWith('/dashboard')) {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        const loginRedirect = NextResponse.redirect(new URL('/login', req.url));
        loginRedirect.headers.set('x-barbershop-id', barbershop.id.toString());
        return loginRedirect;
      }

      // Verify user belongs to this barbershop
      const { data: profile } = await supabase
        .from('profiles')
        .select('barbershop_id')
        .eq('id', session.user.id)
        .single();

      if (!profile || profile.barbershop_id !== barbershop.id) {
        const unauthorizedRedirect = NextResponse.redirect(new URL('/unauthorized', req.url));
        unauthorizedRedirect.headers.set('x-barbershop-id', barbershop.id.toString());
        return unauthorizedRedirect;
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
        const pricingRedirect = NextResponse.redirect(new URL('/pricing', req.url));
        pricingRedirect.headers.set('x-barbershop-id', barbershop.id.toString());
        return pricingRedirect;
      }
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // Return 404 for invalid subdomains
    return NextResponse.rewrite(new URL('/404', req.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};