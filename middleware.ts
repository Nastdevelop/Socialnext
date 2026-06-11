import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login"
  }
})

export const config = {
  matcher: [
    "/",
    "/profile/:path*",
    "/friend/:path*",
    "/chat/:path*",
    "/createpost",
    "/updateProfile",
    "/setelan",
    "/blocked",
    "/user/:path*",
  ]
}