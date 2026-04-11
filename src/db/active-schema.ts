/**
 * Re-exports the correct table objects based on the active PostgreSQL schema.
 *
 * DB_SCHEMA=test  → PostgreSQL schema `test.*` (Vercel Preview when sharing one
 *                   Neon URL with Production, or local dev with DB_SCHEMA=test)
 * DB_SCHEMA unset → PostgreSQL schema `public.*` (Vercel Production, default)
 *
 * Server actions and any other code should import from here, not from
 * schema.ts or schema.local.ts directly.
 */
import * as publicSchema from "./schema";
import * as localSchema from "./schema.local";

const local = process.env.DB_SCHEMA === "test";

export const users            = local ? localSchema.users            : publicSchema.users;
export const profiles         = local ? localSchema.profiles         : publicSchema.profiles;
export const bookings         = local ? localSchema.bookings         : publicSchema.bookings;
export const messages         = local ? localSchema.messages         : publicSchema.messages;
export const propertySettings = local ? localSchema.propertySettings : publicSchema.propertySettings;
export const rateLimitBuckets = local ? localSchema.rateLimitBuckets : publicSchema.rateLimitBuckets;
