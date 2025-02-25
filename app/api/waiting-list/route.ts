import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import WaitingList from '@/models/WaitingList';
import Settings from '@/models/Settings';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    // Check if waiting list mode is enabled
    const settings = await Settings.findOne();
    if (!settings?.isWaitingListMode) {
      return NextResponse.json({ 
        message: 'Waiting list is not active'
      }, { status: 400 });
    }

    const body = await request.json();
    const entry = await WaitingList.create(body);
    
    return NextResponse.json({ 
      message: 'Added to waiting list successfully',
      entry
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json({ 
        message: 'This email is already on the waiting list'
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      message: 'Failed to join waiting list',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Only require authentication for GET requests (admin viewing the list)
export async function GET(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth?.isAuthenticated || !auth?.user || auth.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const entries = await WaitingList.find({})
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ entries });
  } catch (error) {
    return NextResponse.json({ 
      message: 'Failed to fetch waiting list',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 