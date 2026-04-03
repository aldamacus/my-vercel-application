/** Canonical admin account (notifications + dashboard). Override via NEXT_PUBLIC_ADMIN_EMAIL. */
export const ADMIN_EMAIL =
  (typeof process.env.NEXT_PUBLIC_ADMIN_EMAIL === "string" &&
  process.env.NEXT_PUBLIC_ADMIN_EMAIL.trim() !== ""
    ? process.env.NEXT_PUBLIC_ADMIN_EMAIL.trim().toLowerCase()
    : "central.brukenthal@gmail.com");

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}
