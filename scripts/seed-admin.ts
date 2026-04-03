/**
 * One-time admin bootstrap: upserts users + profiles for the dashboard account.
 *
 * Usage (from repo root):
 *   dotenv -e .env.local -- npx tsx scripts/seed-admin.ts
 *
 * Required env:
 *   DATABASE_URL
 *   ADMIN_BOOTSTRAP_PASSWORD — plaintext password (never commit this value)
 *
 * Optional:
 *   ADMIN_BOOTSTRAP_EMAIL — defaults to central.brukenthal@gmail.com
 */
import { config } from "dotenv";

config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function main() {
  const url = process.env.DATABASE_URL;
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  const email =
    process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase() ??
    "central.brukenthal@gmail.com";

  if (!url) {
    console.error("Missing DATABASE_URL");
    process.exit(1);
  }
  if (!password) {
    console.error("Missing ADMIN_BOOTSTRAP_PASSWORD");
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql, { schema });
  const passwordHash = await hashPassword(password);

  await db
    .insert(schema.users)
    .values({
      email,
      passwordHash,
      confirmed: true,
      confirmToken: null,
    })
    .onConflictDoUpdate({
      target: schema.users.email,
      set: {
        passwordHash,
        confirmed: true,
        confirmToken: null,
      },
    });

  await db
    .insert(schema.profiles)
    .values({
      email,
      firstName: "",
      lastName: "",
      phone: "",
    })
    .onConflictDoNothing();

  const [row] = await db
    .select({ email: schema.users.email })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (!row) {
    console.error("Upsert failed.");
    process.exit(1);
  }

  console.log(`Admin user ready: ${row.email}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
