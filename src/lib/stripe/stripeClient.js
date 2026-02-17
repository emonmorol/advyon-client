/**
 * @fileoverview Stripe client-side loader.
 * Lazily loads the Stripe.js SDK using the publishable key from environment.
 * Usage: import { stripePromise } from '@/lib/stripe/stripeClient';
 */
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLISHABLE_KEY) {
  console.warn(
    '[Stripe] VITE_STRIPE_PUBLISHABLE_KEY is not set. Billing features will be unavailable.'
  );
}

/** Lazily-loaded Stripe instance. Resolves to null if key is missing. */
export const stripePromise = STRIPE_PUBLISHABLE_KEY
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);
