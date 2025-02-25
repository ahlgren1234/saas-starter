import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    // Verify authentication
    const auth = await verifyAuth();
    if (!auth?.isAuthenticated || !auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Set up SSE headers
    const headersList = headers();
    const response = new NextResponse(
      new ReadableStream({
        start(controller) {
          controller.enqueue('retry: 1000\n\n');
        },
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    );

    return response;
  } catch (error) {
    console.error('SSE setup error:', error);
    return NextResponse.json(
      { message: 'Failed to set up event stream' },
      { status: 500 }
    );
  }
} 