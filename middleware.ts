import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MAIN_DOMAINS = ['fadely.app', 'localhost:3000', 'localhost'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get the hostname from the request
  const hostname = req.headers.get('host');
  console.log('Hostname:', hostname); // Debug log

  // Skip middleware for api routes and static files
  if (req.nextUrl.pathname.startsWith('/_next') || 
      req.nextUrl.pathname.startsWith('/api') ||
      req.nextUrl.pathname.startsWith('/static')) {
    return res;
  }

  // Handle subdomains
  let subdomain: string | null = null;
  
  // Check if it's a subdomain
  if (hostname?.includes('.fadely.app') || hostname?.includes('.localhost')) {
    subdomain = hostname.split('.')[0];
  }
  console.log('Detected subdomain:', subdomain); // Debug log

  // For the main domains, allow access to marketing pages only
  if (!subdomain || MAIN_DOMAINS.includes(hostname!)) {
    console.log('Main domain detected:', hostname); // Debug log
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return res;
  }

  // Get barbershop data
  const { data: barbershop, error } = await supabase
    .from('barbershops')
    .select('*')
    .eq('subdomain', subdomain)
    .single();

  console.log('Barbershop query result:', { barbershop, error }); // Debug log

  if (!barbershop) {
    console.log('No barbershop found for subdomain:', subdomain); // Debug log
    return NextResponse.rewrite(new URL('/404', req.url));
  }

  // Create a new response with barbershop context
  const response = NextResponse.next();
  response.headers.set('x-barbershop-id', barbershop.id.toString());

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
    '/pricing'
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
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};