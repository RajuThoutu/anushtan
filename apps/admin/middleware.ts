import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized: ({ token }) => !!token
    },
})

export const config = {
    matcher: ['/dashboard/:path*', '/students/:path*', '/users/:path*', '/reports/:path*']
}
