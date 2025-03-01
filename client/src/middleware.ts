import { NextRequest, NextResponse } from 'next/server';
export async function middleware(request: NextRequest, response: NextResponse) {
  const isUserLogged = request.cookies.get('chat_accessToken');
  const pathname = request.nextUrl.pathname;
  const authPaths = ['/login', '/register'];
  console.log('pathname', pathname);

  if (
    (isUserLogged && pathname == '/') ||
    (isUserLogged && authPaths.includes(pathname) && pathname !== '/home/chats')
  ) {
    console.log('first middleware condition satisfied');
    const response = NextResponse.redirect(new URL('/home/chats', request.url));
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  } else if (!isUserLogged && pathname.includes('/home')) {
    console.log('second middleware condition satisfied');
    const response = NextResponse.redirect(new URL('/login', request.url));
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
    const response = NextResponse.redirect(new URL('/login', request.url));
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
