import { pgTable, text, timestamp, boolean, serial, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  email:        text("email").primaryKey(),
  passwordHash: text("password_hash").notNull(),
  confirmed:    boolean("confirmed").notNull().default(false),
  confirmToken: text("confirm_token"),
  createdAt:    timestamp("created_at").defaultNow(),
});

export const profiles = pgTable("profiles", {
  email:      text("email").primaryKey(),
  firstName:  text("first_name").notNull().default(""),
  lastName:   text("last_name").notNull().default(""),
  phone:      text("phone").notNull().default(""),
  updatedAt:  timestamp("updated_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id:        text("id").primaryKey(),
  userEmail: text("user_email").notNull(),
  status:    text("status").notNull(),
  checkIn:   text("check_in").notNull(),
  checkOut:  text("check_out").notNull(),
  nights:    integer("nights").notNull(),
  guests:    integer("guests").notNull().default(2),
  total:     text("total").notNull(),
  apartment: text("apartment").notNull(),
  location:  text("location").notNull(),
  image:     text("image").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id:        serial("id").primaryKey(),
  userEmail: text("user_email").notNull(),
  from:      text("from").notNull(),
  text:      text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
