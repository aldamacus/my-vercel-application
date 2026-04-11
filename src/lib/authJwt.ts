import { SignJWT, jwtVerify } from "jose";

const SESSION_DAYS = 30;

function getSecretKey(): Uint8Array {
  const raw = process.env.AUTH_SECRET?.trim();
  if (raw && raw.length >= 32) {
    return new TextEncoder().encode(raw);
  }
  if (process.env.NODE_ENV === "development") {
    return new TextEncoder().encode(
      "dev-only-insecure-auth-secret-min-32-chars!!"
    );
  }
  throw new Error(
    "AUTH_SECRET is missing or shorter than 32 characters. Set it in the environment."
  );
}

export async function mintSessionJwt(email: string): Promise<string> {
  const normalized = email.trim().toLowerCase();
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(normalized)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecretKey());
}

export async function verifySessionJwt(
  token: string
): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const sub = payload.sub;
    if (typeof sub !== "string" || !sub.trim()) return null;
    return sub.trim().toLowerCase();
  } catch {
    return null;
  }
}

export const SESSION_JWT_MAX_AGE_SEC = SESSION_DAYS * 24 * 60 * 60;
