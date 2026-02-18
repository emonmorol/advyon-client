import { buildUrl, useApiSWR, useApiMutation } from '../_shared/apiClient';

// ─── Subscription Endpoints ──────────────────────────────────────

/** Get all available plans (public) */
export const usePlans = () => useApiSWR('/subscriptions/plans');

/** Get current user's subscription */
export const useMySubscription = () => useApiSWR('/subscriptions/me');

/** Create a Stripe Checkout session */
export const useCreateCheckout = () =>
  useApiMutation('/subscriptions/checkout', 'post');

/** Create a Stripe Customer Portal session */
export const useCreatePortal = () =>
  useApiMutation('/subscriptions/portal', 'post');

/** Cancel subscription at period end */
export const useCancelSubscription = () =>
  useApiMutation('/subscriptions/cancel', 'post');

/** Verify a completed checkout session and sync subscription */
export const useVerifyCheckout = () =>
  useApiMutation('/subscriptions/verify-checkout', 'post');

// ─── Payment History ─────────────────────────────────────────────

/** Get current user's payment history */
export const useMyPayments = (params) =>
  useApiSWR(buildUrl('/payments/me', params));
