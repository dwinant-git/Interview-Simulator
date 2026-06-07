import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/practice') || pathname.startsWith('/results')) {
    const hasProfile = request.cookies.get('has_profile')?.value;
    if (!hasProfile) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/practice/:path*', '/results/:path*'],
};
