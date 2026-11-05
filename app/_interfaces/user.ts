export const USER_ROLES = ["ANALISTA", "EMPLEADO"] as const;

export type UserRole = (typeof USER_ROLES)[number];

/** The narrow user the UI is allowed to know about. */
export interface CurrentUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
}
