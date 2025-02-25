import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

// Add paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/verify-email',
  '/reset-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify-email',
  '/api/stripe/webhook',
];

export async function middleware(request: NextRequest) {
  console.log('Middleware executing for path:', request.nextUrl.pathname);
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith('/api/auth/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/static/')
  );

  if (isPublicPath) {
    console.log('Public path, allowing access');
    return NextResponse.next();
  }

  // Get token from Authorization header or cookie
  const authHeader = request.headers.get('authorization');
  const cookieToken = request.cookies.get('token');
  
  console.log('Auth header present:', !!authHeader);
  console.log('Cookie token present:', !!cookieToken);
  
  const token = authHeader?.replace('Bearer ', '') || cookieToken?.value;

  // For API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!token) {
      console.log('No token found for API route');
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      console.log('Invalid token for API route');
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    console.log('Valid token for API route, user:', decoded);
    
    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.id as string);
    requestHeaders.set('x-user-role', decoded.role as string);

    return NextResponse.next({
      headers: requestHeaders,
    });
  }

  // For page routes
  console.log('Checking token for page route');
  const decoded = token ? await verifyToken(token) : null;
  console.log('Token verification result:', !!decoded);
  
  if (!decoded) {
    console.log('No valid token, redirecting to login');
    const url = new URL('/login', request.url);
    url.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  console.log('Valid token found, allowing access');
  return NextResponse.next();
} 