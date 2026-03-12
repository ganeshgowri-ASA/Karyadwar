import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        empNo: { label: 'Employee No / Domain ID / Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.empNo || !credentials?.password) return null

        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { empNo: credentials.empNo },
                { domainId: credentials.empNo },
                { email: credentials.empNo },
              ],
            },
            include: { defaultSite: true },
          })

          if (!user || !user.password) return null

          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (!isValid) return null

          return {
            id: user.id,
            name: user.nickName || user.domainId,
            email: user.email,
            empNo: user.empNo,
            domainId: user.domainId,
            role: user.role,
            defaultSiteId: user.defaultSiteId || '',
            defaultSiteName: user.defaultSite?.name || '',
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.empNo = (user as any).empNo
        token.domainId = (user as any).domainId
        token.role = (user as any).role
        token.defaultSiteId = (user as any).defaultSiteId
        token.defaultSiteName = (user as any).defaultSiteName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.empNo = token.empNo as string
        session.user.domainId = token.domainId as string
        session.user.role = token.role as string
        session.user.defaultSiteId = token.defaultSiteId as string
        session.user.defaultSiteName = token.defaultSiteName as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'karyadwar-secret-change-in-production',
}
