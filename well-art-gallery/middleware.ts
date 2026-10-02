import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(_request: NextRequest) {
  // Admin page handles Supabase login + admin-role verification itself.
  // Do not redirect /admin to itself, otherwise it creates a redirect loop.
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
