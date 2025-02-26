# Modern SaaS Starter Kit

A production-ready SaaS starter kit built with Next.js 14, TypeScript, Tailwind CSS, and MongoDB. This starter kit provides everything you need to build a modern SaaS application with authentication, billing, and user management.

## Features

- 🚀 **Next.js 14** with App Router and Server Components
- 💨 **Tailwind CSS** for modern, responsive styling
- 🔒 **Authentication System**
  - Email/Password authentication
  - Email verification
  - Password reset functionality
  - JWT-based session management
- 💳 **Stripe Integration**
  - Subscription management
  - Multiple pricing tiers
  - Usage-based billing
  - Webhook integration
- 📧 **Transactional Emails** via Resend
  - Email verification
  - Password reset
  - HTML email templates
- 👥 **User Management**
  - User profiles
  - Avatar upload
  - Role-based access control
- 🎨 **Modern UI Components**
  - Responsive navigation
  - Dashboard layout
  - Form components
  - Loading states
  - Toast notifications
- 🔐 **Security Features**
  - CSRF protection
  - Rate limiting
  - Secure password hashing
  - HTTP-only cookies
- 📱 **Responsive Design**
  - Mobile-first approach
  - Adaptive layouts
  - Touch-friendly interactions

## Prerequisites

Before you begin, ensure you have the following:

- Node.js 18+ installed
- MongoDB database (local or Atlas)
- Stripe account
- Resend account for email services

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_verified_email_address

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Optional: For waiting list mode
NEXT_PUBLIC_WAITING_LIST_MODE=false
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/saas-starter.git
   cd saas-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up MongoDB**
   - Create a MongoDB database (local or Atlas)
   - Add your MongoDB connection string to `.env.local`

4. **Configure Stripe**
   - Create a Stripe account
   - Add your Stripe API keys to `.env.local`
   - Set up webhook endpoints in Stripe dashboard
   - Create your products and price plans

5. **Set up Resend**
   - Create a Resend account
   - Add your API key to `.env.local`
   - Verify your sending domain

6. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

7. **Set up Stripe webhook forwarding (development)**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

## Deployment

1. **Deploy to your platform of choice** (Vercel recommended)
   - Connect your repository
   - Add environment variables
   - Deploy

2. **Update webhook endpoints**
   - Update Stripe webhook endpoint to your production URL
   - Update email verification URLs in templates

## Database Setup

The application uses MongoDB as its database. Here's how to set it up:

1. **Local Development**
   - Install MongoDB locally
   - Start MongoDB service
   - Use connection string: `mongodb://localhost:27017/your_database_name`

2. **Production (MongoDB Atlas)**
   - Create MongoDB Atlas account
   - Create new cluster
   - Get connection string
   - Add IP whitelist for your servers
   - Update `.env.local` with connection string

## Stripe Configuration

1. **Create Products**
   - Log into Stripe Dashboard
   - Create your subscription products
   - Set up pricing tiers
   - Note down product/price IDs

2. **Configure Webhooks**
   - Add webhook endpoint in Stripe Dashboard
   - Configure events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

3. **Update Product IDs**
   - Add your Stripe product/price IDs to the application configuration

## Email Configuration

1. **Resend Setup**
   - Create Resend account
   - Add sending domain
   - Verify domain ownership
   - Create API key

2. **Email Templates**
   - Customize email templates in `lib/email.ts`
   - Test email sending functionality
   - Update URLs in templates for production

## Page Protection & Access Control

### Protected Pages

1. **Basic Authentication Protection**
   ```typescript
   // app/protected/page.tsx
   import { auth } from '@/lib/auth'
   
   export default async function ProtectedPage() {
     // This will redirect to /login if user is not authenticated
     await auth()
     
     return <div>Protected Content</div>
   }
   ```

2. **Role-Based Protection**
   ```typescript
   // app/admin/page.tsx
   import { auth } from '@/lib/auth'
   
   export default async function AdminPage() {
     const session = await auth()
     
     if (session.user.role !== 'admin') {
       throw new Error('Unauthorized')
     }
     
     return <div>Admin Content</div>
   }
   ```

### Subscription-Based Access

1. **Check Subscription Status**
   ```typescript
   // app/premium/page.tsx
   import { auth } from '@/lib/auth'
   
   export default async function PremiumPage() {
     const session = await auth()
     
     if (session.user.subscriptionStatus !== 'active') {
       // Redirect to upgrade page
       redirect('/settings/billing')
     }
     
     return <div>Premium Content</div>
   }
   ```

2. **Plan-Specific Features**
   ```typescript
   // components/feature-gate.tsx
   export function FeatureGate({ 
     children, 
     requiredPlan 
   }: { 
     children: React.ReactNode
     requiredPlan: 'free' | 'pro' | 'enterprise'
   }) {
     const { user } = useUser()
     
     if (!user || !hasAccess(user.subscriptionPlan, requiredPlan)) {
       return <UpgradePrompt plan={requiredPlan} />
     }
     
     return <>{children}</>
   }
   ```

### Middleware Protection

1. **Create Protected Routes**
   ```typescript
   // middleware.ts
   import { NextResponse } from 'next/server'
   import { auth } from '@/lib/auth'
   
   export const config = {
     matcher: [
       '/dashboard/:path*',
       '/settings/:path*',
       '/api/protected/:path*'
     ]
   }
   
   export async function middleware(request: NextRequest) {
     const session = await auth()
     
     if (!session) {
       return NextResponse.redirect(new URL('/login', request.url))
     }
     
     // Check subscription for specific paths
     if (
       request.nextUrl.pathname.startsWith('/api/protected/premium') &&
       session.user.subscriptionStatus !== 'active'
     ) {
       return NextResponse.json(
         { error: 'Premium subscription required' },
         { status: 403 }
       )
     }
     
     return NextResponse.next()
   }
   ```

### Usage Examples

1. **Protecting API Routes**
   ```typescript
   // app/api/protected/route.ts
   import { auth } from '@/lib/auth'
   
   export async function GET() {
     const session = await auth()
     
     if (!session) {
       return new Response('Unauthorized', { status: 401 })
     }
     
     return new Response('Protected Data')
   }
   ```

2. **Component-Level Protection**
   ```typescript
   // components/premium-feature.tsx
   export function PremiumFeature() {
     return (
       <FeatureGate requiredPlan="pro">
         <div>Premium Feature Content</div>
       </FeatureGate>
     )
   }
   ```

3. **Layout-Level Protection**
   ```typescript
   // app/(protected)/layout.tsx
   import { auth } from '@/lib/auth'
   
   export default async function ProtectedLayout({
     children
   }: {
     children: React.ReactNode
   }) {
     await auth()
     
     return <div>{children}</div>
   }
   ```

### Best Practices

1. **Multiple Protection Layers**
   - Use middleware for broad route protection
   - Implement page-level checks for specific requirements
   - Add component-level gates for granular feature control

2. **Subscription States**
   - Handle all subscription states:
     - `active`: Full access to paid features
     - `past_due`: Show payment warning but maintain access
     - `canceled`: Restrict access to paid features
     - `incomplete`: Prompt to complete payment
     - `incomplete_expired`: Treat as canceled

3. **Grace Periods**
   - Implement grace periods for payment issues
   - Show warnings before access restriction
   - Cache subscription status to prevent excessive database queries

4. **UI Feedback**
   - Show clear upgrade prompts for restricted features
   - Provide feedback when access is denied
   - Include direct links to upgrade/billing pages

5. **Security Considerations**
   - Always verify access on both client and server
   - Use server-side checks for sensitive operations
   - Implement rate limiting for API routes
   - Keep subscription checks consistent across the application

This protection system ensures your application's features are properly gated based on authentication and subscription status, while providing a good user experience with clear feedback and upgrade paths.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you need help with the setup or have any questions, please open an issue in the repository.
