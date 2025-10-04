import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Create a response object to attach the Supabase session
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define public and protected routes
  const isAuthRoute = pathname === '/login'

  // If user is not logged in and trying to access a protected route
  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is logged in and trying to access the login page
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession()

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}