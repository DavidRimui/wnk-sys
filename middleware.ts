import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the path is for the admin dashboard
  const isAdminPath =
    path.startsWith("/admin/dashboard") || path.startsWith("/admin/analytics") || path.startsWith("/admin/settings")

  // Check if the user is authenticated
  const token = request.cookies.get("auth_token")?.value
  const isAuthenticated = token ? verifyToken(token) : null
  const isAdmin = isAuthenticated?.role === "admin"

  // If the user is not authenticated and is trying to access the admin dashboard,
  // redirect them to the admin login page
  if (isAdminPath && (!isAuthenticated || !isAdmin)) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  // Add security headers
  const response = NextResponse.next()

  // Security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://apisalticon.onekitty.co.ke;",
  )

  return response
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
}
