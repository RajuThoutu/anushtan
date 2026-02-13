import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { findUserByEmail } from "./users"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = findUserByEmail(credentials.email)

                if (!user || !user.is_active) {
                    return null
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password_hash
                )

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string
                session.user.id = token.id as string
            }
            return session
        }
    },
    pages: {
        signIn: '/auth',
    },
    session: {
        strategy: "jwt",
        maxAge: 2 * 60 * 60, // 2 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
}
