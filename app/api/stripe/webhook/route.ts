import { stripe } from '@/lib/stripe';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('No stripe-signature header found');
      return new Response('No signature', { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return new Response('Webhook secret not configured', { status: 500 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Process the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { userId, plan, subscriptionId } = session.metadata || {};

        if (userId && plan && subscriptionId) {
          const user = await User.findById(userId);
          if (user) {
            if (user.role === 'admin') {
              console.log('Skipping subscription update for admin user:', user._id);
              break;
            }

            await User.findByIdAndUpdate(userId, {
              subscriptionId,
              subscriptionStatus: 'active',
              subscriptionPlan: plan,
              subscriptionCurrentPeriodEnd: new Date(session.expires_at * 1000),
            });
          } else {
            console.error('User not found:', userId);
          }
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const subMetadata = subscription.metadata || {};
        const subUserId = subMetadata.userId;

        if (subUserId) {
          const user = await User.findById(subUserId);
          if (user) {
            if (user.role === 'admin') {
              console.log('Skipping subscription update for admin user:', user._id);
              break;
            }

            await User.findByIdAndUpdate(subUserId, {
              subscriptionStatus: subscription.status,
              subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            });
          } else {
            console.error('User not found:', subUserId);
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const invMetadata = invoice.metadata || {};
        const invUserId = invMetadata.userId;

        if (invUserId) {
          const user = await User.findById(invUserId);
          if (user) {
            if (user.role === 'admin') {
              console.log('Skipping subscription update for admin user:', user._id);
              break;
            }

            await User.findByIdAndUpdate(invUserId, {
              subscriptionStatus: 'active',
              subscriptionCurrentPeriodEnd: new Date(invoice.period_end * 1000),
            });
          } else {
            console.error('User not found:', invUserId);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const failedMetadata = invoice.metadata || {};
        const failedUserId = failedMetadata.userId;

        if (failedUserId) {
          const user = await User.findById(failedUserId);
          if (user) {
            if (user.role === 'admin') {
              console.log('Skipping subscription update for admin user:', user._id);
              break;
            }

            await User.findByIdAndUpdate(failedUserId, {
              subscriptionStatus: 'past_due',
            });
          } else {
            console.error('User not found:', failedUserId);
          }
        }
        break;
      }
    }

    return new Response('Success', { status: 200 });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return new Response('Webhook error', { status: 400 });
  }
} 