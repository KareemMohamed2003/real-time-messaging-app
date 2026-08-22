import { NextRequest, NextResponse } from 'next/server';
import { AppRoutes } from './shared/lib/utils';
export async function middleware(request: NextRequest, response: NextResponse) {
  const isUserLogged = request.cookies.get('chat_accessToken');
  const pathname = request.nextUrl.pathname;
  const { HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } = AppRoutes;
  const authPaths = [LOGIN_ROUTE, REGISTER_ROUTE];
  console.log('pathname', pathname);

  if (
    (isUserLogged && pathname == '/') ||
    (isUserLogged && authPaths.includes(pathname) && pathname !== HOME_ROUTE)
  ) {
    console.log('first middleware condition satisfied');
    const response = NextResponse.redirect(new URL(HOME_ROUTE, request.url));
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  } else if (!isUserLogged && pathname.includes('/home')) {
    console.log('second middleware condition satisfied');
    const response = NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  } else if (
    !isUserLogged &&
    !authPaths.includes(pathname) &&
    pathname !== '/'
  ) {
    console.log('third  middleware condition satisfied');
    const response = NextResponse.redirect(new URL(request.url));
    return response;
  } else if (
    !isUserLogged &&
    !authPaths.includes(pathname) &&
    pathname == '/'
  ) {
    const response = NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */

    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
