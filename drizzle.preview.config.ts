import { config } from "dotenv";
import type { Config } from "drizzle-kit";

/**
 * Push `src/db/schema.local.ts` to PostgreSQL schema **`test`** (same DB URL as prod).
 *
 * Use when Production and Preview share one `DATABASE_URL`: set `DB_SCHEMA=test`
 * on Vercel Preview so the app reads `test.*` tables; Production leaves
 * `DB_SCHEMA` unset → `public.*`.
 *
 * `.env.preview.local` (gitignored), same URL as other envs is fine:
 *   DATABASE_URL=postgresql://...
 *   DB_SCHEMA=test
 *
 * Run: `npm run db:push:preview`
 */
config({ path: ".env.preview.local" });

const url =
  process.env.DATABASE_URL?.trim();

if (!url) {
  throw new Error(
    "drizzle.preview.config: add `.env.preview.local` with  DATABASE_URL."
  );
}

export default {
  schema: "./src/db/schema.local.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  schemaFilter: ["test"],
} satisfies Config;
