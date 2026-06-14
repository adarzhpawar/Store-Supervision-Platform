"use server";

import { db } from "@/db";
import { settings } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function getSettings() {
  const result = await db.select().from(settings).limit(1);
  if (result.length > 0) {
    return result[0];
  }

  // If no settings exist, create a default one
  const [defaultSettings] = await db.insert(settings).values({
    storeName: "My Store",
    taxRate: "0.00",
    invoicePrefix: "INV-",
  }).returning();

  return defaultSettings;
}

export async function updateSettings(data: {
  storeName: string;
  storeAddress: string | null;
  storePhone: string | null;
  taxRate: string;
  invoicePrefix: string;
}) {
  const currentSettings = await getSettings();

  await db
    .update(settings)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(settings.id, currentSettings.id));

  revalidatePath("/settings");
  revalidatePath("/"); // revalidate all to apply new store name/tax
}
