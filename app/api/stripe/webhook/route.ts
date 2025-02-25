import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
import type { Stripe } from 'stripe';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    
    // Get all headers to inspect what's being sent
    const signature = request.headers.get('stripe-signature');
    const allHeaders = Object.fromEntries(request.headers);
    
    console.log('Webhook request details:', {
      method: request.method,
      url: request.url,
      headers: allHeaders,
      signatureHeader: signature,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      bodyPreview: body.slice(0, 100) + '...',
      bodyLength: body.length,
    });

    if (!signature) {
      console.error('No stripe-signature header found');
      return NextResponse.json(
        { message: 'No stripe-signature header found' },
        { status: 401 }
      );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { message: 'Webhook secret is not configured' },
        { status: 500 }
      );
    }

    let event: Stripe.Event;
    try {
      console.log('Attempting to verify webhook signature with secret:', process.env.STRIPE_WEBHOOK_SECRET);
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log('Webhook signature verified successfully for event:', event.type);
    } catch (err) {
      const error = err as Error;
      console.error('Error verifying webhook signature:', {
        error: error.message,
        name: error.name,
        stack: error.stack,
        signature,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        bodyLength: body.length
      });
      return NextResponse.json(
        { message: 'Invalid signature', error: error.message },
        { status: 401 }
      );
    }

    console.log('Webhook event type:', event.type);

    await connectDB();

    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('Processing checkout.session.completed');
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        const subscriptionId = session.subscription as string;

        console.log('Checkout session data:', { userId, plan, subscriptionId });

        if (userId && plan && subscriptionId) {
          const user = await User.findById(userId);
          if (user) {
            console.log('Found user:', user._id);
            
            // Skip subscription update for admin users
            if (user.role === 'admin') {
              console.log('Skipping subscription update for admin user:', user._id);
              return NextResponse.json({ received: true });
            }
            
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            console.log('Retrieved subscription:', {
              status: subscription.status,
              currentPeriodEnd: subscription.current_period_end
            });

            user.subscriptionId = subscriptionId;
            user.subscriptionPlan = plan;
            user.subscriptionStatus = subscription.status;
            user.subscriptionCurrentPeriodEnd = new Date(subscription.current_period_end * 1000);
            await user.save();
            console.log('Updated user subscription:', {
              id: user._id,
              status: user.subscriptionStatus,
              plan: user.subscriptionPlan
            });

            // Return response with subscription change header
            return NextResponse.json({ received: true }, {
              headers: {
                'X-Subscription-Changed': 'true',
                'Access-Control-Expose-Headers': 'X-Subscription-Changed'
              }
            });
          } else {
            console.log('User not found:', userId);
          }
        } else {
          console.log('Missing required metadata:', { userId, plan, subscriptionId });
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        console.log('Processing subscription update/delete');
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        console.log('Subscription data:', { 
          userId,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end 
        });

        if (userId) {
          const user = await User.findById(userId);
          if (user) {
            console.log('Found user:', user._id);
            
            // Skip subscription update for admin users
            if (user.role === 'admin') {
              console.log('Skipping subscription update for admin user:', user._id);
              return NextResponse.json({ received: true });
            }
            
            user.subscriptionStatus = subscription.status;
            user.subscriptionCurrentPeriodEnd = new Date(subscription.current_period_end * 1000);
            await user.save();
            console.log('Updated user subscription:', {
              id: user._id,
              status: user.subscriptionStatus
            });

            // Return response with subscription change header
            return NextResponse.json({ received: true }, {
              headers: {
                'X-Subscription-Changed': 'true',
                'Access-Control-Expose-Headers': 'X-Subscription-Changed'
              }
            });
          } else {
            console.log('User not found:', userId);
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        console.log('Processing invoice.payment_succeeded');
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          const userId = subscription.metadata?.userId;

          console.log('Invoice payment succeeded:', { 
            userId,
            subscriptionId: invoice.subscription 
          });

          if (userId) {
            const user = await User.findById(userId);
            if (user) {
              console.log('Found user:', user._id);
              
              // Skip subscription update for admin users
              if (user.role === 'admin') {
                console.log('Skipping subscription update for admin user:', user._id);
                return NextResponse.json({ received: true });
              }
              
              user.subscriptionStatus = 'active';
              user.subscriptionCurrentPeriodEnd = new Date(subscription.current_period_end * 1000);
              await user.save();
              console.log('Updated user subscription:', {
                id: user._id,
                status: user.subscriptionStatus
              });
            } else {
              console.log('User not found:', userId);
            }
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        console.log('Processing invoice.payment_failed');
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          const userId = subscription.metadata?.userId;

          console.log('Invoice payment failed:', { 
            userId,
            subscriptionId: invoice.subscription 
          });

          if (userId) {
            const user = await User.findById(userId);
            if (user) {
              console.log('Found user:', user._id);
              
              // Skip subscription update for admin users
              if (user.role === 'admin') {
                console.log('Skipping subscription update for admin user:', user._id);
                return NextResponse.json({ received: true });
              }
              
              user.subscriptionStatus = 'past_due';
              await user.save();
              console.log('Updated user subscription:', {
                id: user._id,
                status: user.subscriptionStatus
              });
            } else {
              console.log('User not found:', userId);
            }
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { message: 'Webhook handler failed' },
      { status: 400 }
    );
  }
} 