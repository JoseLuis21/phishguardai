import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { z } from "zod";

import { auth } from "@/auth";
import type { CurrentUser } from "@/app/_interfaces/user";
import { USER_ROLES } from "@/app/_interfaces/user";

const SessionUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().nullish(),
  role: z.enum(USER_ROLES),
});

/** Current user or a redirect to /login. Memoized per request. */
export const getCurrentUser = cache(async (): Promise<CurrentUser> => {
  const session = await auth();
  const parsed = SessionUserSchema.safeParse(session?.user);

  if (!parsed.success) {
    redirect("/login");
  }

  return {
    id: parsed.data.id,
    email: parsed.data.email,
    name: parsed.data.name ?? null,
    role: parsed.data.role,
  };
});

/** For mutations: throws instead of redirecting so the action can answer safely. */
export async function requireAnalyst(): Promise<CurrentUser> {
  const session = await auth();
  const parsed = SessionUserSchema.safeParse(session?.user);

  if (!parsed.success) {
    throw new Error("Unauthorized");
  }

  if (parsed.data.role !== "ANALISTA") {
    throw new Error("Forbidden");
  }

  return {
    id: parsed.data.id,
    email: parsed.data.email,
    name: parsed.data.name ?? null,
    role: parsed.data.role,
  };
}
