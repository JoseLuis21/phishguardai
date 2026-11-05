import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { verifyCredentials } from "@/app/_internal/users.dal";
import { loginSchema } from "@/app/login/_schemas/login.schema";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Correo" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);

        if (!parsed.success) {
          return null;
        }

        const user = await verifyCredentials(
          parsed.data.email,
          parsed.data.password,
        );

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
