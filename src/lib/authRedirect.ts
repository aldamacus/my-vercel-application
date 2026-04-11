import { isAdminEmail } from "@/lib/admin";

const AUTH_RETURN_KEY = "auth_return";
export const AUTH_CONFIRM_ERROR_KEY = "auth_confirm_error";

export function setAuthReturnPath(path: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTH_RETURN_KEY, path);
}

export function consumeAuthConfirmError(): string | null {
  if (typeof window === "undefined") return null;
  const msg = sessionStorage.getItem(AUTH_CONFIRM_ERROR_KEY);
  if (msg) sessionStorage.removeItem(AUTH_CONFIRM_ERROR_KEY);
  return msg;
}

/** Same-origin path only. Rejects protocol-relative and external URLs. */
export function safeNextPath(raw: string | null): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export function getPostAuthHref(options?: { email?: string }): string {
  if (typeof window === "undefined") return "/";
  const ret = sessionStorage.getItem(AUTH_RETURN_KEY);
  if (ret) {
    sessionStorage.removeItem(AUTH_RETURN_KEY);
    const safe = safeNextPath(ret);
    if (safe) return safe;
  }
  const email = options?.email ?? "";
  if (email && isAdminEmail(email)) return "/admin";
  if (sessionStorage.getItem("pending_reserve_dates")) return "/book-your-stay";
  return "/";
}
