import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  const { error } = await supabase.auth.getUser()

  // If the refresh token is invalid or not found, clear the cookies
  // to prevent infinite refresh loops on subsequent requests.
  if (error && (error.status === 400 || error.status === 401 || error.code === 'refresh_token_not_found')) {
    const allCookies = request.cookies.getAll()
    
    // Clear cookies from the request so downstream Server Components don't see them
    allCookies.forEach((cookie) => {
      if (cookie.name.startsWith('sb-')) {
        request.cookies.delete(cookie.name)
      }
    })
    
    // Create a new response with the cleared request cookies
    supabaseResponse = NextResponse.next({
      request,
    })
    
    // Clear cookies from the response so the browser deletes them
    allCookies.forEach((cookie) => {
      if (cookie.name.startsWith('sb-')) {
        supabaseResponse.cookies.delete(cookie.name)
      }
    })
  }

  return supabaseResponse
}

