import NextAuth from "next-auth";
import type { NextRequest } from "next/server";

import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

type AuthMiddleware = (request: NextRequest) => Promise<Response | undefined>;

/**
 * Optimistic check only: sends visitors without a session to /login, and
 * signed-in visitors away from it. Every DAL function re-checks the session
 * and the role before touching data.
 */
export function proxy(request: NextRequest) {
  return (auth as unknown as AuthMiddleware)(request);
}

export const config = {
  matcher: ["/panel/:path*", "/login", "/registro"],
};
