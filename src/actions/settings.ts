"use server";

import { db } from "@/db";
import { stores } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function updateSettings(data: {
  storeName: string;
  storeAddress: string | null;
  storePhone: string | null;
  taxRate: string;
  invoicePrefix: string;
  accentColor: string;
}) {
  const { store } = await requireAuth();

  if (data.storePhone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    if (!phoneRegex.test(data.storePhone)) {
      return { error: 'Please provide a valid phone number (e.g., +1234567890)' }
    }
  }

  await db
    .update(stores)
    .set({
      name: data.storeName,
      address: data.storeAddress,
      phone: data.storePhone,
      taxRate: data.taxRate,
      invoicePrefix: data.invoicePrefix,
      accentColor: data.accentColor,
      updatedAt: new Date(),
    })
    .where(eq(stores.id, store.id));

  revalidatePath('/', 'layout');
  return { success: true };
}
