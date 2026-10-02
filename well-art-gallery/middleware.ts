import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) return NextResponse.next()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return NextResponse.next()

  const response = NextResponse.next({ request })
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: cookies => cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin'
    loginUrl.searchParams.set('auth', 'required')
    return NextResponse.redirect(loginUrl)
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin'
    loginUrl.searchParams.set('auth', 'forbidden')
    return NextResponse.redirect(loginUrl)
  }
  return response
}

export const config = { matcher: ['/admin/:path*'] }
