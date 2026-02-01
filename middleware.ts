import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized: ({ token }) => !!token
    },
})

export const config = {
    matcher: ['/auth/dashboard/:path*', '/auth/students/:path*', '/auth/users/:path*', '/auth/reports/:path*']
}
