import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/generate', '/content', '/history', '/settings'];

// Define auth routes that should redirect if user is authenticated
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Since tokens are stored in localStorage (client-side only),
  // the middleware cannot access them. We'll let the client-side
  // ProtectedRoute components handle authentication checks.
  
  // For now, just let all routes pass through
  // The ProtectedRoute component will handle redirects on the client side
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};