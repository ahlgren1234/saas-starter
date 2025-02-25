import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';

export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.findOne();
    return NextResponse.json({ isWaitingListMode: settings?.isWaitingListMode || false });
  } catch (error) {
    console.error('Error checking waiting list mode:', error);
    return NextResponse.json({ isWaitingListMode: false });
  }
} 