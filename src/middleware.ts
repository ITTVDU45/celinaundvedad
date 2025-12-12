import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Geschützte Routes
  const isUserRoute = pathname.startsWith('/user')
  const isAdminRoute = pathname.startsWith('/admin')
  
  if (!isUserRoute && !isAdminRoute) {
    return NextResponse.next()
  }

  // Prüfe auth_role Cookie
  const authRole = request.cookies.get('auth_role')?.value

  // Keine Authentifizierung → Redirect zur Startseite
  if (!authRole) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.searchParams.set('error', 'auth_required')
    return NextResponse.redirect(url)
  }

  // User versucht Admin-Route zu öffnen
  if (isAdminRoute && authRole !== 'admin') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.searchParams.set('error', 'insufficient_permissions')
    return NextResponse.redirect(url)
  }

  // Admin kann auch User-Routes besuchen, User nur User-Routes
  return NextResponse.next()
}

export const config = {
  matcher: ['/user/:path*', '/admin/:path*']
}

