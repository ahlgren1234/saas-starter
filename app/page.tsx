import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Modern SaaS Starter Kit
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Launch your SaaS project in minutes with our fully-featured, secure, and scalable starter template
              </p>
            </div>
            <div className="space-x-4">
              <a
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                href="/register"
              >
                Get Started
              </a>
              <a
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                href="https://github.com/yourusername/saas-starter"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Authentication */}
            <div className="flex flex-col items-center space-y-4 p-6 bg-background rounded-lg shadow-lg">
              <div className="p-3 bg-primary/10 rounded-full">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Authentication</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Complete auth system with email verification, password reset, and JWT tokens
              </p>
            </div>

            {/* User Management */}
            <div className="flex flex-col items-center space-y-4 p-6 bg-background rounded-lg shadow-lg">
              <div className="p-3 bg-primary/10 rounded-full">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">User Management</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Admin dashboard with user management, roles, and permissions
              </p>
            </div>

            {/* Subscriptions */}
            <div className="flex flex-col items-center space-y-4 p-6 bg-background rounded-lg shadow-lg">
              <div className="p-3 bg-primary/10 rounded-full">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Stripe Integration</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Built-in subscription management with Stripe payments
              </p>
            </div>

            {/* Modern UI */}
            <div className="flex flex-col items-center space-y-4 p-6 bg-background rounded-lg shadow-lg">
              <div className="p-3 bg-primary/10 rounded-full">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Modern UI</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Beautiful, responsive UI with Tailwind CSS and shadcn/ui components
              </p>
            </div>

            {/* API Routes */}
            <div className="flex flex-col items-center space-y-4 p-6 bg-background rounded-lg shadow-lg">
              <div className="p-3 bg-primary/10 rounded-full">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">API Routes</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Ready-to-use API routes with MongoDB integration
              </p>
            </div>

            {/* Security */}
            <div className="flex flex-col items-center space-y-4 p-6 bg-background rounded-lg shadow-lg">
              <div className="p-3 bg-primary/10 rounded-full">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Security</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Built with security best practices and rate limiting
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Join us today and start building your next great idea with our powerful SaaS starter kit
              </p>
            </div>
            <div className="space-x-4">
              <a
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                href="/register"
              >
                Sign Up Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
