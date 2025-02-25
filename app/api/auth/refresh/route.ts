import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';

export async function POST() {
  try {
    const auth = await verifyAuth();
    if (!auth?.isAuthenticated || !auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Get fresh user data from database
    const user = await User.findById(auth.user.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Generate new token with fresh user data
    const token = await generateToken(user);

    // Create the response with new token
    const response = NextResponse.json({
      message: 'Token refreshed successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionCurrentPeriodEnd: user.subscriptionCurrentPeriodEnd,
      },
      token
    });

    // Set the new token cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ 
      message: 'Failed to refresh token',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 