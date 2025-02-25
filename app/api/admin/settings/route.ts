import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';

export async function GET() {
  try {
    const auth = await verifyAuth();
    if (!auth?.isAuthenticated || !auth?.user || auth.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({ isWaitingListMode: false });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ 
      message: 'Failed to fetch settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth?.isAuthenticated || !auth?.user || auth.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(body);
    } else {
      settings.isWaitingListMode = body.isWaitingListMode;
      await settings.save();
    }

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings 
    });
  } catch (error) {
    return NextResponse.json({ 
      message: 'Failed to update settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 