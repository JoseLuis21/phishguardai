import type { NextAuthConfig } from "next-auth";

import type { UserRole } from "@/app/_interfaces/user";

/**
 * Edge-safe part of the auth configuration: no database access, so the proxy
 * can use it for the optimistic redirect. Real authorization happens in the DAL.
 */
export const authConfig = {
  // Deployed behind Vercel or a reverse proxy that sets the Host header.
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 10,
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = Boolean(auth?.user);
      const { pathname } = request.nextUrl;
      const isLoginPage =
        pathname.startsWith("/login") || pathname.startsWith("/registro");

      if (isLoginPage) {
        return isLoggedIn
          ? Response.redirect(new URL("/panel", request.nextUrl))
          : true;
      }

      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = (user as { role?: UserRole }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.uid ?? "");
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
