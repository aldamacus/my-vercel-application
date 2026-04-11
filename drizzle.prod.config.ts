import { config } from "dotenv";
import type { Config } from "drizzle-kit";

/**
 * Push `src/db/schema.ts` to PostgreSQL schema **`public`** (Vercel Production).
 *
 * Create `.env.production.local` (gitignored) with:
 *   `PRODUCTION_DATABASE_URL` — recommended, or
 *   `DATABASE_URL` — can be the same Neon URL as Preview if Preview uses `test.*`.
 *
 * Run: `npm run db:push:prod`
 */
config({ path: ".env.production.local" });

const url =
  process.env.PRODUCTION_DATABASE_URL?.trim() ||
  process.env.DATABASE_URL?.trim();

if (!url) {
  throw new Error(
    "drizzle.prod.config: create `.env.production.local` with PRODUCTION_DATABASE_URL or DATABASE_URL (Neon main branch → public schema)."
  );
}

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  schemaFilter: ["public"],
} satisfies Config;
