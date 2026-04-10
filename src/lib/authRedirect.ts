import { getSession } from "@/components/SignIn";
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

export function getPostAuthHref(): string {
  if (typeof window === "undefined") return "/";
  const ret = sessionStorage.getItem(AUTH_RETURN_KEY);
  if (ret) {
    sessionStorage.removeItem(AUTH_RETURN_KEY);
    return ret;
  }
  const session = getSession();
  const email = session?.email ?? "";
  if (isAdminEmail(email)) return "/admin";
  if (sessionStorage.getItem("pending_reserve_dates")) return "/book-your-stay";
  return "/";
}
