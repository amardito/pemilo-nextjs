import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow health check without auth
  if (pathname.startsWith('/health')) {
    return NextResponse.next();
  }

  // Allow voter routes without auth
  if (pathname.startsWith('/voter')) {
    return NextResponse.next();
  }

  // Allow admin login without auth
  if (pathname === '/admin-login') {
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/voter/:path*', '/health/:path*'],
};
