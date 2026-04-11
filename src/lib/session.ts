import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/authConstants";
import { mintSessionJwt, SESSION_JWT_MAX_AGE_SEC, verifySessionJwt } from "@/lib/authJwt";

export async function createSession(email: string): Promise<void> {
  const token = await mintSessionJwt(email);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_JWT_MAX_AGE_SEC,
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getVerifiedSessionEmail(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionJwt(token);
}
