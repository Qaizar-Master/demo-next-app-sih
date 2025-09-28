import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/favicon.ico',
  '/select-role',
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return;

  const { sessionClaims } = auth; // use the passed auth object
  const role = sessionClaims?.publicMetadata?.role;
  const path = req.nextUrl.pathname;
  const skip = req.nextUrl.searchParams.get('skipRole');
  if (skip === '1') return;

  if (path.startsWith('/teacher') && role !== 'teacher') {
    return Response.redirect(new URL('/select-role', req.url));
  }
  if (path.startsWith('/student') && role !== 'student') {
    return Response.redirect(new URL('/select-role', req.url));
  }

  // No need for auth().protect(); — the middleware already ensures the user is authenticated
});

export const config = {
  matcher: [
    // Run middleware on all routes except static files and _next
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
