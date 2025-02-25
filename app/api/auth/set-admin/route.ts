import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { setupAdminSubscription } from '@/lib/admin';

export async function POST(request: Request) {
  try {
    console.log('Starting admin role update process');
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    console.log('Looking up user with email:', email);
    const user = await User.findOne({ email });

    if (!user) {
      console.log('No user found with email:', email);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Updating role to admin for user:', user._id);
    user.role = 'admin';
    
    // Set up admin subscription
    await setupAdminSubscription(user);
    
    console.log('User updated to admin successfully:', user._id);
    return NextResponse.json({ 
      message: 'User role updated to admin successfully',
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionCurrentPeriodEnd: user.subscriptionCurrentPeriodEnd
      }
    });
  } catch (error) {
    console.error('Error during admin role update:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
} 