import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const protectedRoutes = ['/admin', '/admin/products', '/admin/site-content']
  const publicRoutes = ['/admin/login']

  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(route + '/')
  )
  const isPublicRoute = publicRoutes.includes(path)

  // Redirect to login if accessing protected admin route without session
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Redirect to dashboard if logged in and accessing login page
  if (isPublicRoute && user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}
