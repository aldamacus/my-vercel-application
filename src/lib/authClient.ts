/** Dispatched after sign-in, sign-out, or session-altering auth flows. */
export const AUTH_CHANGE_EVENT = "auth-change";

export type AuthSession = { email: string };
/** @deprecated Use AuthSession — kept for gradual migration of imports. */
export type Session = AuthSession;

export async function fetchAuthSession(): Promise<AuthSession | null> {
  const res = await fetch("/api/auth/session", {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { email?: string };
  if (!data?.email || typeof data.email !== "string") return null;
  return { email: data.email };
}
