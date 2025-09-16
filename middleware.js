import { NextResponse } from 'next/server'

const PROTECTED = ['/admin', '/api/admin']

export function middleware(req) {
  const { pathname } = new URL(req.url)
  if (!PROTECTED.some((p) => pathname.startsWith(p))) return NextResponse.next()

  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Basic ') ? auth.slice(6) : ''
  const expected = process.env.ADMIN_BASIC_TOKEN || ''

  if (!token || token !== expected) {
    return new NextResponse('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
    })
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] }
