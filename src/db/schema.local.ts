/**
 * Drizzle-kit schema for local development — tables live in the "test" schema.
 * Used ONLY by drizzle.local.config.ts (npm run db:push / db:studio).
 * Column definitions mirror exactly what drizzle-kit pulled from Neon.
 */
import { pgSchema, text, integer, timestamp, serial, boolean } from "drizzle-orm/pg-core";

export const test = pgSchema("test");

export const usersInTest = test.table("users", {
  email:        text().primaryKey().notNull(),
  passwordHash: text("password_hash").notNull(),
  confirmed:    boolean().default(false).notNull(),
  confirmToken: text("confirm_token"),
  createdAt:    timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const profilesInTest = test.table("profiles", {
  email:     text().primaryKey().notNull(),
  firstName: text("first_name").default("").notNull(),
  lastName:  text("last_name").default("").notNull(),
  phone:     text().default("").notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

export const bookingsInTest = test.table("bookings", {
  id:            text().primaryKey().notNull(),
  userEmail:     text("user_email").notNull(),
  status:        text().notNull(),
  checkIn:       text("check_in").notNull(),
  checkOut:      text("check_out").notNull(),
  nights:        integer().notNull(),
  guests:        integer().default(2).notNull(),
  total:         text().notNull(),
  apartment:     text().notNull(),
  location:      text().notNull(),
  image:         text().notNull(),
  entranceCode:  text("entrance_code").default("").notNull(),
  hostNotes:     text("host_notes").default("").notNull(),
  createdAt:     timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const propertySettingsInTest = test.table("property_settings", {
  id:            text().primaryKey().notNull(),
  wifiSsid:      text("wifi_ssid").default("").notNull(),
  wifiPassword:  text("wifi_password").default("").notNull(),
});

export const messagesInTest = test.table("messages", {
  id:        serial().primaryKey().notNull(),
  userEmail: text("user_email").notNull(),
  from:      text().notNull(),
  text:      text().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

// Aliases matching schema.ts export names — used by active-schema.ts
export {
  usersInTest as users,
  profilesInTest as profiles,
  bookingsInTest as bookings,
  messagesInTest as messages,
  propertySettingsInTest as propertySettings,
};
