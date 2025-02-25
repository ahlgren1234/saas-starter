import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return NextResponse.json({ 
        message: 'Invalid email or password'
      }, { status: 401 });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json({ 
        message: 'Invalid email or password'
      }, { status: 401 });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return NextResponse.json({ 
        message: 'Please verify your email before logging in'
      }, { status: 403 });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = await generateToken(user);

    // Check if user needs to select a subscription plan
    const needsUpgrade = !user.subscriptionPlan && user.role !== 'admin';

    // Remove sensitive data before sending response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionCurrentPeriodEnd: user.subscriptionCurrentPeriodEnd,
      createdAt: user.createdAt
    };

    // Create the response
    const response = NextResponse.json({
      message: 'Login successful',
      user: userResponse,
      token,
      needsUpgrade
    });

    // Set the token cookie
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
    console.error('Login error:', error);
    return NextResponse.json({ 
      message: 'Failed to login',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 