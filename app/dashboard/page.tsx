"use client";

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  const getSubscriptionStatus = () => {
    if (user?.role === 'admin') {
      return {
        text: 'Admin User (Pro Features)',
        color: 'text-purple-600'
      };
    }
    
    if (user?.subscriptionStatus === 'active') {
      if (user.subscriptionPlan === 'hobby') {
        return {
          text: 'Hobby Plan (Free)',
          color: 'text-blue-600'
        };
      }
      return {
        text: `${user.subscriptionPlan} Plan`,
        color: 'text-green-600'
      };
    }

    return {
      text: 'No Active Subscription',
      color: 'text-yellow-600'
    };
  };

  const subscriptionInfo = getSubscriptionStatus();

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name}!
              </p>
            </div>
            <Button variant="outline" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-6 bg-card rounded-lg border">
              <h3 className="font-semibold mb-2">Profile</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your account settings and preferences
              </p>
              <Link href="/profile">
                <Button variant="secondary">View Profile</Button>
              </Link>
            </div>

            <div className="p-6 bg-card rounded-lg border">
              <h3 className="font-semibold mb-2">Email Verification</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {user?.isEmailVerified
                  ? "Your email is verified"
                  : "Please verify your email address"}
              </p>
              {!user?.isEmailVerified && (
                <Button variant="secondary">Resend Verification</Button>
              )}
            </div>

            <div className="p-6 bg-card rounded-lg border">
              <h3 className="font-semibold mb-2">Subscription</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {user?.role === 'admin' || user?.subscriptionStatus === 'active'
                  ? `You are on the ${subscriptionInfo.text}`
                  : 'Upgrade to access premium features'}
              </p>
              <Link href="/settings/billing">
                <Button variant="secondary">
                  {user?.role === 'admin' ? 'View Features' : 'Manage Subscription'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Account Overview */}
          <div className="grid gap-6">
            <div className="rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Name
                  </dt>
                  <dd className="text-sm">{user?.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Email
                  </dt>
                  <dd className="text-sm">{user?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Role
                  </dt>
                  <dd className="text-sm capitalize">{user?.role}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Email Status
                  </dt>
                  <dd className="text-sm">
                    {user?.isEmailVerified ? (
                      <span className="text-green-600">Verified</span>
                    ) : (
                      <span className="text-yellow-600">Pending verification</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Subscription
                  </dt>
                  <dd className="text-sm">
                    <span className={subscriptionInfo.color}>
                      {subscriptionInfo.text}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            {user?.role === 'admin' && (
              <div className="rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
                <div className="space-x-4">
                  <Link href="/admin/users">
                    <Button>Manage Users</Button>
                  </Link>
                  <Link href="/admin/settings">
                    <Button variant="outline">System Settings</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 