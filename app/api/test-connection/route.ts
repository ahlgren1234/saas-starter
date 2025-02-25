import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    const conn = await connectDB();
    return NextResponse.json({ 
      message: 'Successfully connected to MongoDB!',
      status: 'success',
      isConnected: conn.connection.readyState === 1
    });
  } catch (error) {
    return NextResponse.json({ 
      message: 'Failed to connect to MongoDB',
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error' 
    }, { status: 500 });
  }
} 