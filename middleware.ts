import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that DON'T require authentication
const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/auth/callback'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes, static files, and API routes
    if (
        publicRoutes.some(route => pathname === route) ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Check for Supabase auth cookies
    // @supabase/ssr stores the auth token in cookies with the pattern:
    // sb-<project-ref>-auth-token (chunked as .0, .1, etc.)
    const cookies = request.cookies;
    const hasAuthCookie = cookies.getAll().some(cookie =>
        cookie.name.includes('auth-token')
    );

    if (!hasAuthCookie) {
        // No auth cookie → redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all routes except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
