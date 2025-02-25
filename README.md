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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you need help with the setup or have any questions, please open an issue in the repository.
