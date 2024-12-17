'use server'

import { createClient } from '@/utils/supabase/server';
import Stripe from 'stripe';
import { redirect } from 'next/navigation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia'
});

const PRICE_IDS = {
  basic: process.env.STRIPE_BASIC_PRICE_ID!,
  plus: process.env.STRIPE_PLUS_PRICE_ID!,
};

export async function createSubscription(priceId: 'basic' | 'plus') {
  const supabase = createClient();
  
  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if user already has a subscription
  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id, status')
    .eq('user_id', user.id)
    .single();

  let customerId = existingSubscription?.stripe_customer_id;

  // If no customer ID exists, create a customer in Stripe
  if (!customerId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    const customer = await stripe.customers.create({
      email: profile?.email,
      name: profile?.full_name,
      metadata: {
        user_id: user.id,
      },
    });
    customerId = customer.id;
  }

  // Create a subscription with trial
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: PRICE_IDS[priceId] }],
    trial_period_days: 30,
    metadata: {
      user_id: user.id,
    },
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  });

  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const payment_intent = invoice.payment_intent as Stripe.PaymentIntent;

  // Return the client secret for the payment intent
  return { 
    subscriptionId: subscription.id,
    clientSecret: payment_intent.client_secret 
  };
}

export async function getSubscriptionStatus() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return subscription;
}

export async function cancelSubscription() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('user_id', user.id)
    .single();

  if (subscription?.stripe_subscription_id) {
    await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
  }

  redirect('/dashboard');
} 