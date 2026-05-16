import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Detect if this is an admin request based on subdomain or domain
  const isAdminDomain = hostname.startsWith('admin.') || hostname.includes('-admin.')

  // SECURITY: Prevent accessing /admin routes from the customer domain
  // This "hides" the admin panel from anyone on the main site.
  if (!isAdminDomain && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  // Add security headers for admin domain
  if (isAdminDomain) {
    supabaseResponse.headers.set('X-Frame-Options', 'DENY')
    supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
    supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  }

  // Rewrite logic for separate admin URL
  if (isAdminDomain && !url.pathname.startsWith('/admin')) {
    url.pathname = `/admin${url.pathname === '/' ? '' : url.pathname}`
    supabaseResponse = NextResponse.rewrite(url)
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          // For rewrites, we need to ensure the response reflects the new cookies
          if (isAdminDomain && !request.nextUrl.pathname.startsWith('/admin')) {
            const rewriteUrl = request.nextUrl.clone()
            rewriteUrl.pathname = `/admin${rewriteUrl.pathname === '/' ? '' : rewriteUrl.pathname}`
            supabaseResponse = NextResponse.rewrite(rewriteUrl)
          } else {
            supabaseResponse = NextResponse.next({
              request,
            })
          }
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

  const path = url.pathname // Use rewritten path for auth checks
  const protectedRoutes = ['/admin', '/admin/products', '/admin/site-content']
  const publicRoutes = ['/admin/login']

  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(route + '/')
  )
  const isPublicRoute = publicRoutes.includes(path)

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !user) {
    const loginUrl = new URL(isAdminDomain ? '/login' : '/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if logged in and accessing login page
  if (isPublicRoute && user) {
    const dashboardUrl = new URL(isAdminDomain ? '/' : '/admin', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return supabaseResponse
}
