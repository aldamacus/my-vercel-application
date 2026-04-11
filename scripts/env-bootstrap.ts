/**
 * Load `.env.local` before any `active-schema` import when running scripts with `tsx`.
 * `dotenv -e .env.preview.local` / `-e .env.production.local` runs first and is not
 * overwritten (dotenv does not replace existing env vars by default).
 */
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
