import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as publicSchema from "./schema";
import * as localSchema from "./schema.local";

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    const sql = neon(process.env.DATABASE_URL!);
    const schema =
      process.env.DB_SCHEMA === "test" ? localSchema : publicSchema;
    _db = drizzle(sql, { schema });
  }
  return _db;
}
