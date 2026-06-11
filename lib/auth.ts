import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "./prisma"
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("akun tidak ditemukan")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        // ❌ tidak ada / masih pending
        if (!user || user.status !== "ACTIVE") {
          throw new Error("akun tidak ditemukan")
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) {
          throw new Error("email atau password salah")
        }

        return {
          id: String(user.id),
          email: user.email,
          username: user.username,
          image: user.image
        }
      }
    })
  ],

  session: {
    strategy: "jwt"
  },

  pages: {
    signIn: "/login"
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = (user as any).username
        token.picture = user.image
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.image = token.picture as string
      }
      return session
    }
  }
}
