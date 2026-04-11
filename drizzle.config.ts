import { config } from "dotenv";
import type { Config } from "drizzle-kit";

// Remote `public` / `test` pushes (shared or separate Neon URLs): see
// `drizzle.prod.config.ts` and `drizzle.preview.config.ts` + `npm run db:push:prod|preview`.

// Explicitly load .env.local so DB_SCHEMA is available both in this file
// and in schema.ts when drizzle-kit evaluates it.
config({ path: ".env.local" });

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schemaFilter: [process.env.DB_SCHEMA ?? "public"],
} satisfies Config;
