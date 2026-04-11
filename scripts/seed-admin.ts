/**
 * One-time admin bootstrap: upserts users + profiles for the dashboard account.
 *
 * Usage (from repo root):
 *   npm run seed:admin              — `.env.local` (+ env-bootstrap)
 *   npm run seed:admin:preview      — `.env.preview.local` (set DB_SCHEMA=test if using test schema)
 *   npm run seed:admin:prod         — `.env.production.local`
 *
 * Required env:
 *   DATABASE_URL
 *   ADMIN_BOOTSTRAP_PASSWORD — plaintext password (never commit this value)
 *
 * Optional:
 *   ADMIN_BOOTSTRAP_EMAIL — defaults to central.brukenthal@gmail.com
 *   DB_SCHEMA=test        — target `test.*` tables (same DB URL as prod)
 */
import "./env-bootstrap";
import { eq } from "drizzle-orm";
import { getDb } from "../src/db";
import { users, profiles } from "../src/db/active-schema";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function main() {
  const db = getDb();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  const email =
    process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase() ??
    "central.brukenthal@gmail.com";

  if (!process.env.DATABASE_URL) {
    console.error("Missing DATABASE_URL");
    process.exit(1);
  }
  if (!password) {
    console.error("Missing ADMIN_BOOTSTRAP_PASSWORD");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  await db
    .insert(users)
    .values({
      email,
      passwordHash,
      confirmed: true,
      confirmToken: null,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        passwordHash,
        confirmed: true,
        confirmToken: null,
      },
    });

  await db
    .insert(profiles)
    .values({
      email,
      firstName: "",
      lastName: "",
      phone: "",
    })
    .onConflictDoNothing();

  const [row] = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!row) {
    console.error("Upsert failed.");
    process.exit(1);
  }

  const schemaLabel = process.env.DB_SCHEMA === "test" ? "test" : "public";
  console.log(`Admin user ready: ${row.email} (schema: ${schemaLabel})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
