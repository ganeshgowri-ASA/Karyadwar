import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Domain ID", type: "text" },
        password: { label: "Password", type: "password" },
        loginMethod: { label: "Login Method", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        let user = null;

        if (credentials.loginMethod === "DOMAIN") {
          user = await prisma.user.findUnique({
            where: { domain_id: credentials.identifier },
            include: { site: true },
          });
        } else {
          user = await prisma.user.findUnique({
            where: { email: credentials.identifier },
            include: { site: true },
          });
        }

        if (!user || !user.password_hash) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.nick_name || user.email,
          role: user.role,
          empNo: user.emp_no,
          domainId: user.domain_id,
          defaultSite: user.default_site,
          siteName: user.site?.name || null,
          siteCode: user.site?.code || null,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.empNo = (user as any).empNo;
        token.domainId = (user as any).domainId;
        token.defaultSite = (user as any).defaultSite;
        token.siteName = (user as any).siteName;
        token.siteCode = (user as any).siteCode;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).empNo = token.empNo;
        (session.user as any).domainId = token.domainId;
        (session.user as any).defaultSite = token.defaultSite;
        (session.user as any).siteName = token.siteName;
        (session.user as any).siteCode = token.siteCode;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
