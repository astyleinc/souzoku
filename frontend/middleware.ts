import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/properties',
  '/blog',
  '/help',
  '/about',
  '/terms',
  '/privacy',
  '/contact',
  '/welcome',
]

const isPublicPath = (pathname: string) => {
  if (PUBLIC_PATHS.includes(pathname)) return true
  if (pathname.startsWith('/properties/')) return true
  if (pathname.startsWith('/blog/')) return true
  if (pathname.startsWith('/help/')) return true
  if (pathname.startsWith('/api/')) return true
  if (pathname.startsWith('/_next/')) return true
  if (pathname.includes('.')) return true
  return false
}

const ROLE_PREFIX: Record<string, string> = {
  seller: '/seller',
  buyer: '/buyer',
  professional: '/professional',
  broker: '/broker',
  admin: '/admin',
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get('better-auth.session_token')
    ?? request.cookies.get('__Secure-better-auth.session_token')

  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ロールベースのルート保護
  const roleCookie = request.cookies.get('user-role')?.value
  if (roleCookie) {
    for (const [role, prefix] of Object.entries(ROLE_PREFIX)) {
      if (pathname.startsWith(prefix) && roleCookie !== role) {
        // 自分のロールのダッシュボードへリダイレクト
        const home = ROLE_PREFIX[roleCookie] ?? '/'
        return NextResponse.redirect(new URL(home, request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
