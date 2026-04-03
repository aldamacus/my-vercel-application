"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { bookings, propertySettings } from "@/db/active-schema";
import { isAdminEmail } from "@/lib/admin";

const DEFAULT_ID = "default";

export async function getPropertyWifiForGuestAction(
  userEmail: string
): Promise<{ wifiSsid: string; wifiPassword: string } | null> {
  const db = getDb();
  const trimmed = userEmail.trim().toLowerCase();
  const [hasBooking] = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(eq(bookings.userEmail, trimmed))
    .limit(1);
  if (!hasBooking) return null;

  const [row] = await db
    .select()
    .from(propertySettings)
    .where(eq(propertySettings.id, DEFAULT_ID))
    .limit(1);
  if (!row) return { wifiSsid: "", wifiPassword: "" };
  return { wifiSsid: row.wifiSsid, wifiPassword: row.wifiPassword };
}

export async function getPropertyWifiAdminAction(
  actorEmail: string
): Promise<{ ok: boolean; wifiSsid?: string; wifiPassword?: string }> {
  if (!isAdminEmail(actorEmail)) return { ok: false };
  const db = getDb();
  let [row] = await db
    .select()
    .from(propertySettings)
    .where(eq(propertySettings.id, DEFAULT_ID))
    .limit(1);
  if (!row) {
    await db.insert(propertySettings).values({
      id: DEFAULT_ID,
      wifiSsid: "",
      wifiPassword: "",
    });
    [row] = await db
      .select()
      .from(propertySettings)
      .where(eq(propertySettings.id, DEFAULT_ID))
      .limit(1);
  }
  return {
    ok: true,
    wifiSsid: row!.wifiSsid,
    wifiPassword: row!.wifiPassword,
  };
}

export async function setPropertyWifiAction(
  actorEmail: string,
  data: { wifiSsid: string; wifiPassword: string }
): Promise<{ ok: boolean }> {
  if (!isAdminEmail(actorEmail)) return { ok: false };
  const db = getDb();
  await db
    .insert(propertySettings)
    .values({
      id: DEFAULT_ID,
      wifiSsid: data.wifiSsid,
      wifiPassword: data.wifiPassword,
    })
    .onConflictDoUpdate({
      target: propertySettings.id,
      set: {
        wifiSsid: data.wifiSsid,
        wifiPassword: data.wifiPassword,
      },
    });
  return { ok: true };
}
