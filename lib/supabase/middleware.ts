import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Detect if this is an admin request based on subdomain or domain
  // This supports admin.yourdomain.com or urja-admin.vercel.app
  const isAdminDomain = hostname.startsWith('admin.') || hostname.includes('-admin.')

  let supabaseResponse = NextResponse.next({
    request,
  })

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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = url.pathname // Use rewritten path for auth checks
  const protectedRoutes = ['/admin', '/admin/products', '/admin/settings']
  const publicRoutes = ['/admin/login']

  const isProtectedRoute = protectedRoutes.some(
    (route) => path.startsWith(route) && !publicRoutes.includes(path)
  )
  const isPublicRoute = publicRoutes.includes(path)

  if (isProtectedRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = isAdminDomain ? '/login' : '/admin/login'
    return NextResponse.redirect(loginUrl)
  }

  if (isPublicRoute && user) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = isAdminDomain ? '/' : '/admin'
    return NextResponse.redirect(dashboardUrl)
  }

  return supabaseResponse
}
