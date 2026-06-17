import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DEMO_COOKIE = 'eleva_demo_access'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 días

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Solo aplica a /demo/* (no a /demo ni a /api/demo-access)
  if (!pathname.startsWith('/demo/')) return NextResponse.next()

  // QA bypass: ?qa=TOKEN en la URL
  const qaToken = searchParams.get('qa')
  const envToken = process.env.DEMO_QA_TOKEN
  if (envToken && qaToken === envToken) {
    const response = NextResponse.next()
    response.cookies.set(DEMO_COOKIE, 'qa_bypass', {
      maxAge: COOKIE_MAX_AGE,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    return response
  }

  // Cookie de acceso presente → pasa
  if (request.cookies.has(DEMO_COOKIE)) return NextResponse.next()

  // Sin acceso → redirige al lobby
  const url = request.nextUrl.clone()
  url.pathname = '/demo'
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/demo/:path+'],
}
