/**
 * @fileoverview Billing & Subscription management page.
 * Shows current plan, available plans, payment history.
 * Integrates with Stripe Checkout and Customer Portal.
 */
import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe/stripeClient';
import {
  usePlans,
  useMySubscription,
  useCreateCheckout,
  useCreatePortal,
  useCancelSubscription,
  useMyPayments,
  useVerifyCheckout,
} from '@/services/billing/billingService';
import {
  CreditCard, CheckCircle, Star, ArrowRight,
  Shield, Zap, Crown, AlertTriangle, ChevronLeft,
  ChevronRight, ExternalLink, X,
} from 'lucide-react';

const PLAN_ICONS = {
  free: Shield,
  starter: Zap,
  professional: Star,
  enterprise: Crown,
};

const PLAN_COLORS = {
  free: 'from-gray-500/10 to-gray-600/5 border-gray-200 dark:border-gray-700',
  starter: 'from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800',
  professional: 'from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800',
  enterprise: 'from-amber-500/10 to-amber-600/5 border-amber-200 dark:border-amber-800',
};

const PLAN_BADGE_COLORS = {
  free: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  starter: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  professional: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  enterprise: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

// ─── Plan Card ───────────────────────────────────────────────────
function PlanCard({ plan, billingInterval, currentPlan, onSelect, isLoading }) {
  const Icon = PLAN_ICONS[plan.id] || Shield;
  const isCurrent = currentPlan === plan.id;
  const isFree = plan.id === 'free';
  const price = billingInterval === 'year' ? plan.yearlyPrice : plan.monthlyPrice;
  const period = billingInterval === 'year' ? '/year' : '/month';

  return (
    <div
      className={`relative rounded-2xl border p-6 bg-gradient-to-br flex flex-col h-full ${PLAN_COLORS[plan.id] || PLAN_COLORS.free} transition-all duration-300 ${
        isCurrent ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {isCurrent && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
          Current Plan
        </span>
      )}

      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5" />
        <h3 className="font-semibold">{plan.name}</h3>
      </div>

      <div className="mb-4">
        <span className="text-3xl font-bold">
          {isFree ? 'Free' : `$${(price / 100).toFixed(2)}`}
        </span>
        {!isFree && <span className="text-sm text-muted-foreground">{period}</span>}
      </div>

      <ul className="space-y-2 mb-6 flex-1">
        {plan.features?.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      {!isFree && !isCurrent && (
        <button
          onClick={() => onSelect(plan.id)}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition disabled:opacity-50"
        >
          {isLoading ? (
            <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
          ) : (
            <>
              Get Started <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      )}

      {isCurrent && !isFree && (
        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${PLAN_BADGE_COLORS[plan.id]}`}>
          Active
        </span>
      )}
    </div>
  );
}

// ─── Payment History ─────────────────────────────────────────────
function PaymentHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyPayments({ page, limit: 10 });
  const payments = data?.data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <CreditCard className="h-5 w-5" /> Payment History
      </h3>

      {payments.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">No payment history yet.</p>
      ) : (
        <>
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="border-t hover:bg-muted/30">
                    <td className="p-3">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 font-medium">
                      ${(p.amount / 100).toFixed(2)} {p.currency?.toUpperCase()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          p.status === 'succeeded'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : p.status === 'failed'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{p.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 hover:bg-muted transition"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <span className="text-sm text-muted-foreground">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={payments.length < 10}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 hover:bg-muted transition"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Billing Page ───────────────────────────────────────────
export default function BillingPage() {
  const [billingInterval, setBillingInterval] = useState('month');
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { data: plansData } = usePlans();
  const { data: subData, mutate: refreshSub } = useMySubscription();
  const { trigger: createCheckout } = useCreateCheckout();
  const { trigger: createPortal } = useCreatePortal();
  const { trigger: cancelSub } = useCancelSubscription();

  const plans = plansData?.data || [];
  const subscription = subData?.data || { plan: 'free', status: 'active' };
  const currentPlan = subscription.plan || 'free';
  const isFreePlan = currentPlan === 'free';
  const { trigger: verifyCheckout } = useVerifyCheckout();

  // Auto-verify subscription after successful Stripe Checkout redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const sessionId = params.get('session_id');

    if (success === 'true' && sessionId) {
      verifyCheckout({ sessionId })
        .then(() => {
          refreshSub();
          // Clean up URL params
          window.history.replaceState({}, '', '/dashboard/billing');
        })
        .catch((err) => console.error('Verify checkout error:', err));
    }
  }, []);

  const handleSelectPlan = async (planId) => {
    setLoadingPlan(planId);
    try {
      const result = await createCheckout({
        plan: planId,
        billingInterval,
        successUrl: `${window.location.origin}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/dashboard/billing?canceled=true`,
      });
      if (result?.data?.url) {
        window.location.href = result.data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      const result = await createPortal({
        returnUrl: `${window.location.origin}/dashboard/billing`,
      });
      if (result?.data?.url) {
        window.location.href = result.data.url;
      }
    } catch (err) {
      console.error('Portal error:', err);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSub();
      setShowCancelModal(false);
      refreshSub();
    } catch (err) {
      console.error('Cancel error:', err);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="p-6 space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Billing & Subscription
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your subscription plan and payment methods.
          </p>
        </div>

        {/* Current Plan Summary */}
        <div className="border rounded-xl p-5 bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <p className="text-lg font-semibold capitalize flex items-center gap-2">
              {(() => {
                const Icon = PLAN_ICONS[currentPlan] || Shield;
                return <Icon className="h-5 w-5" />;
              })()}
              {currentPlan}
              {subscription?.cancelAtPeriodEnd && (
                <span className="text-xs text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-0.5 rounded-full">
                  Canceling at period end
                </span>
              )}
            </p>
            {subscription?.currentPeriodEnd && (
              <p className="text-xs text-muted-foreground mt-1">
                Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
          {!isFreePlan && (
            <div className="flex gap-2">
              <button
                onClick={handleManageBilling}
                className="flex items-center gap-1.5 px-4 py-2 text-sm border rounded-lg hover:bg-muted transition"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Manage Billing
              </button>
              {!subscription?.cancelAtPeriodEnd && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm text-red-600 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  Cancel Plan
                </button>
              )}
            </div>
          )}
        </div>

        {/* Billing Interval Toggle */}
        <div className="flex items-center justify-center gap-3">
          <span className={`text-sm ${billingInterval === 'month' ? 'font-semibold' : 'text-muted-foreground'}`}>Monthly</span>
          <button
            onClick={() => setBillingInterval(billingInterval === 'month' ? 'year' : 'month')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${billingInterval === 'year' ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingInterval === 'year' ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className={`text-sm ${billingInterval === 'year' ? 'font-semibold' : 'text-muted-foreground'}`}>
            Yearly <span className="text-emerald-600 text-xs font-medium">(Save ~17%)</span>
          </span>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingInterval={billingInterval}
              currentPlan={currentPlan}
              onSelect={handleSelectPlan}
              isLoading={loadingPlan === plan.id}
            />
          ))}
        </div>

        {/* Payment History */}
        <PaymentHistory />

        {/* Cancel Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Cancel Subscription
                </h3>
                <button onClick={() => setShowCancelModal(false)} className="p-1 hover:bg-muted rounded">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Your subscription will remain active until the end of the current billing period.
                After that, you'll be downgraded to the Free plan.
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowCancelModal(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-muted transition">
                  Keep Plan
                </button>
                <button
                  onClick={handleCancelSubscription}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Elements>
  );
}
