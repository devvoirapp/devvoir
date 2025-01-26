import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const isSignInPage = req.nextUrl.pathname === "/auth/signin";
    
    // If user is authenticated and tries to access signin page, redirect to report-generator
    if (isSignInPage && req.nextauth.token) {
      return NextResponse.redirect(new URL("/report-generator", req.url))
    }
    
    // If user is authenticated and on home page, redirect to report-generator
    if (req.nextUrl.pathname === "/" && req.nextauth.token) {
      return NextResponse.redirect(new URL("/report-generator", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Allow access to signin page and home page without token
        if (req.nextUrl.pathname === "/auth/signin" || req.nextUrl.pathname === "/") {
          return true;
        }
        // Require token for protected routes
        return !!token;
      },
    },
  }
)

// Specify which routes to protect
export const config = {
  matcher: [
    "/report-generator",
    "/",
    "/auth/signin"
  ],
}
