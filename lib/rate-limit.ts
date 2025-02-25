import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(
  request: NextRequest,
  { limit = 5, windowMs = 60 * 1000 } = {}
) {
  const identifier = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
  const now = Date.now();
  const key = `${identifier}:${request.nextUrl.pathname}`;

  // Clean up old entries
  if (store[key] && store[key].resetTime <= now) {
    delete store[key];
  }

  // Initialize or increment counter
  if (!store[key]) {
    store[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
  } else {
    store[key].count++;
  }

  // Check if over limit
  if (store[key].count > limit) {
    return NextResponse.json(
      { message: 'Too many requests, please try again later.' },
      { status: 429 }
    );
  }

  return null;
} 