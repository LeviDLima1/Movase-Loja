import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authConfig, isRouteProtectionEnabled, isProtectedRoute } from './config/auth';

export function middleware(request: NextRequest) {
  // Verificar se a proteção de rotas está habilitada
  if (!isRouteProtectionEnabled()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  
  // Verificar se a rota atual precisa de proteção
  if (isProtectedRoute(pathname)) {
    // Verificar se há token de autenticação
    const token = request.cookies.get(authConfig.tokenConfig.cookieName)?.value || 
                  request.headers.get('authorization')?.replace(authConfig.tokenConfig.headerPrefix, '');
    
    // Se não há token, redirecionar para login
    if (!token) {
      const loginUrl = new URL(authConfig.redirects.login, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Em produção, você validaria o token aqui
  }
  
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
