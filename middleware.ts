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
  '/waiting',
  '/api/waiting-list-mode',
  '/api/waiting-list'
];

export async function middleware(request: NextRequest) {
  console.log('Middleware executing for path:', request.nextUrl.pathname);
  
  // Check if the path is a static file or public API
  const isStaticOrPublicApi = 
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/static/') ||
    request.nextUrl.pathname.startsWith('/api/auth/');

  if (isStaticOrPublicApi) {
    return NextResponse.next();
  }

  // Check waiting list mode using API route
  const response = await fetch(`${request.nextUrl.origin}/api/waiting-list-mode`);
  const { isWaitingListMode } = await response.json();
  
  // If waiting list mode is on and not accessing login page, redirect to waiting page
  if (isWaitingListMode && 
      request.nextUrl.pathname !== '/login' && 
      request.nextUrl.pathname !== '/waiting' &&
      !request.nextUrl.pathname.startsWith('/api/') &&
      !request.nextUrl.pathname.startsWith('/admin/')) {
    return NextResponse.redirect(new URL('/waiting', request.url));
  }

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname === path);
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get token from Authorization header or cookie
  const authHeader = request.headers.get('authorization');
  const cookieToken = request.cookies.get('token');
  const token = authHeader?.replace('Bearer ', '') || cookieToken?.value;

  // For API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.id as string);
    requestHeaders.set('x-user-role', decoded.role as string);

    return NextResponse.next({
      headers: requestHeaders,
    });
  }

  // For page routes
  const decoded = token ? await verifyToken(token) : null;
  if (!decoded) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
} 