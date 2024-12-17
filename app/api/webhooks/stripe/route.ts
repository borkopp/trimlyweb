import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia'
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err}` }, { status: 400 });
  }

  const supabase = createClient();

  switch (event.type) {
    case 'customer.subscription.created':
      const subscription = event.data.object as Stripe.Subscription;
      await supabase
        .from('subscriptions')
        .insert({
          user_id: subscription.metadata.user_id,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer as string,
          status: subscription.status,
          price_id: subscription.items.data[0].price.id,
          trial_end: new Date(subscription.trial_end! * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        });
      break;

    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object as Stripe.Subscription;
      await supabase
        .from('subscriptions')
        .update({
          status: updatedSubscription.status,
          current_period_end: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', updatedSubscription.id);
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', deletedSubscription.id);
      break;
  }

  return NextResponse.json({ received: true });
} 