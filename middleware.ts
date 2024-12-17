import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check subscription status for protected routes
  if (session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, trial_end')
      .eq('user_id', session.user.id)
      .single();

    const isTrialExpired = subscription?.trial_end && new Date(subscription.trial_end) < new Date();
    const isSubscriptionInactive = !subscription || 
      (subscription.status !== 'active' && subscription.status !== 'trialing');

    if (isTrialExpired && isSubscriptionInactive) {
      return NextResponse.redirect(new URL('/pricing', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};