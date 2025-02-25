"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Hobby',
    description: 'Perfect for side projects and hobbyists',
    price: '$0',
    features: [
      'Up to 3 projects',
      'Basic analytics',
      'Community support',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_HOBBY_PRICE_ID,
    planId: 'hobby',
  },
  {
    name: 'Pro',
    description: 'For professionals and growing teams',
    price: '$10',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      'Custom domains',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    planId: 'pro',
  },
];

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const currentPlan = user.subscriptionPlan;
  const isActive = user.subscriptionStatus === 'active';
  const periodEnd = user.subscriptionCurrentPeriodEnd
    ? new Date(user.subscriptionCurrentPeriodEnd).toLocaleDateString()
    : null;

  async function handleSubscribe(priceId: string | undefined, plan: string) {
    if (!priceId) return;

    try {
      setIsLoading(plan);
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          plan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setIsLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Billing & Plans</h1>
            <p className="text-muted-foreground">
              Manage your subscription and billing details
            </p>
          </div>

          {/* Current Subscription Status */}
          {currentPlan && (
            <div className="rounded-lg border p-6 space-y-4">
              <h2 className="text-xl font-semibold">Current Subscription</h2>
              <div className="grid gap-2">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-muted-foreground">Plan</div>
                  <div className="capitalize">{currentPlan}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-muted-foreground">Status</div>
                  <div className="capitalize">{user.subscriptionStatus}</div>
                </div>
                {periodEnd && (
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-muted-foreground">Current Period End</div>
                    <div>{periodEnd}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success/Error Messages */}
          {searchParams.get('success') && (
            <div className="rounded-lg bg-green-50 p-4 text-green-700">
              Your subscription has been updated successfully.
            </div>
          )}
          {searchParams.get('canceled') && (
            <div className="rounded-lg bg-yellow-50 p-4 text-yellow-700">
              Subscription update was canceled.
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.planId}
                className={`rounded-lg border p-6 space-y-4 ${
                  currentPlan === plan.planId
                    ? 'border-primary ring-2 ring-primary ring-offset-2'
                    : ''
                }`}
              >
                <div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>
                <div className="text-3xl font-bold">
                  {plan.price}
                  <span className="text-base font-normal text-muted-foreground">
                    /month
                  </span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="h-4 w-4 text-primary mr-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  disabled={
                    isLoading === plan.planId ||
                    (isActive && currentPlan === plan.planId)
                  }
                  onClick={() => handleSubscribe(plan.priceId, plan.planId)}
                >
                  {isLoading === plan.planId
                    ? 'Processing...'
                    : currentPlan === plan.planId
                    ? 'Current Plan'
                    : 'Subscribe'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 