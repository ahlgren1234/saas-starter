import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const user = await User.create(body);
    return NextResponse.json({ 
      message: 'User created successfully',
      user 
    });
  } catch (error) {
    return NextResponse.json({ 
      message: 'Failed to create user',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const auth = await verifyAuth();
    if (!auth.isAuthenticated || !auth.user || auth.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const users = await User.find({}).select({
      name: 1,
      email: 1,
      role: 1,
      isEmailVerified: 1,
      lastLogin: 1,
      createdAt: 1,
      subscriptionStatus: 1,
      subscriptionPlan: 1,
      subscriptionCurrentPeriodEnd: 1
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ 
      message: 'Failed to fetch users',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 