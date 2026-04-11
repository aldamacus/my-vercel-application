import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

/** True if stored hash is the legacy unsalted SHA-256 hex string. */
export function isLegacySha256Hash(stored: string): boolean {
  return /^[0-9a-f]{64}$/i.test(stored);
}

async function sha256Hex(plain: string): Promise<string> {
  const data = new TextEncoder().encode(plain);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(
  plain: string,
  stored: string
): Promise<boolean> {
  if (stored.startsWith("$2")) {
    return bcrypt.compare(plain, stored);
  }
  if (isLegacySha256Hash(stored)) {
    const legacy = await sha256Hex(plain);
    return legacy === stored;
  }
  return false;
}
