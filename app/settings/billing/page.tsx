"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { CreditCard } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function BillingSettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const currentPlan = user.subscriptionPlan;
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
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { title: "Home", href: "/" },
          { title: "Settings", href: "/settings" },
          { title: "Billing" },
        ]}
      />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Billing Settings</h1>

        {/* Current Plan */}
        <div className="bg-card p-6 rounded-lg shadow-sm border mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">{currentPlan === 'pro' ? 'Pro Plan' : 'Hobby Plan'}</p>
              <p className="text-sm text-muted-foreground">{currentPlan === 'pro' ? '$29/month' : '$0/month'}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => handleSubscribe(
                currentPlan === 'pro' 
                  ? process.env.NEXT_PUBLIC_STRIPE_HOBBY_PRICE_ID 
                  : process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID, 
                currentPlan === 'pro' ? 'hobby' : 'pro'
              )}
              disabled={!!isLoading}
            >
              {isLoading ? 'Processing...' : 'Change Plan'}
            </Button>
          </div>
          {periodEnd && (
            <div className="text-sm text-muted-foreground">
              Your next billing date is {periodEnd}
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-card p-6 rounded-lg shadow-sm border mb-8">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="mr-4 p-2 bg-primary/10 rounded-full">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2024</p>
              </div>
            </div>
            <Button variant="outline">Update</Button>
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Billing History</h2>
          <div className="divide-y">
            {[
              {
                date: "Mar 1, 2024",
                amount: "$29.00",
                status: "Paid",
                invoice: "INV-2024-003",
              },
              {
                date: "Feb 1, 2024",
                amount: "$29.00",
                status: "Paid",
                invoice: "INV-2024-002",
              },
              {
                date: "Jan 1, 2024",
                amount: "$29.00",
                status: "Paid",
                invoice: "INV-2024-001",
              },
            ].map((item) => (
              <div
                key={item.invoice}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <p className="font-medium">{item.date}</p>
                  <p className="text-sm text-muted-foreground">{item.invoice}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.amount}</p>
                  <p className="text-sm text-green-600">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 