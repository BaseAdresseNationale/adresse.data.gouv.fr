import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const routerState = request.headers.get('next-router-state-tree')
  if (!routerState) return NextResponse.next()

  try {
    JSON.parse(decodeURIComponent(routerState))
  }
  catch {
    const ts = new Date().toISOString()
    console.warn(`[${ts} - WARN] Invalid router state header`, {
      path: request.nextUrl.pathname,
      headerLen: routerState.length,
      preview: routerState.slice(0, 200),
    })
  }

  return NextResponse.next()
}

export const config = { matcher: '/:path*' }
