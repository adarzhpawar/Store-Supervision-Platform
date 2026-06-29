"use server";

import { z } from "zod";
import { db } from "@/db";
import { inventory } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

const FormSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  category: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be greater than or equal to 0"),
  costPrice: z.coerce.number().min(0, "Cost price must be greater than or equal to 0").optional(),
  stock: z.coerce.number().int().min(0, "Stock must be an integer greater than or equal to 0").default(0),
  minStock: z.coerce.number().int().min(0, "Min stock must be an integer greater than or equal to 0").default(0),
  barcode: z.string().optional(),
  importedDate: z.string().optional(),
  expiryDate: z.string().optional(),
});

export type State = {
  errors?: {
    sku?: string[];
    name?: string[];
    category?: string[];
    price?: string[];
    costPrice?: string[];
    stock?: string[];
    minStock?: string[];
    barcode?: string[];
    importedDate?: string[];
    expiryDate?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function createProduct(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = FormSchema.safeParse({
    sku: formData.get("sku"),
    name: formData.get("name"),
    category: formData.get("category"),
    price: formData.get("price"),
    costPrice: formData.get("costPrice"),
    stock: formData.get("stock"),
    minStock: formData.get("minStock"),
    barcode: formData.get("barcode"),
    importedDate: formData.get("importedDate"),
    expiryDate: formData.get("expiryDate"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Product.",
      success: false,
    };
  }

  const { sku, name, category, price, costPrice, stock, minStock, barcode, importedDate, expiryDate } = validatedFields.data;

  try {
    const { store } = await requireAuth();
    await db.insert(inventory).values({
      storeId: store.id,
      sku,
      name,
      category: category || null,
      price: price.toString(),
      costPrice: costPrice?.toString() || null,
      stock,
      minStock,
      barcode: barcode || null,
      importedDate: importedDate || null,
      expiryDate: expiryDate || null,
    });
  } catch (error: unknown) {
    // If it's a unique constraint violation on SKU
    if (typeof error === "object" && error !== null && (error as { code?: string }).code === '23505') {
       return {
        message: "A product with this SKU already exists.",
        success: false,
      };
    }
    return {
      message: "Database Error: Failed to Create Product.",
      success: false,
    };
  }

  revalidatePath("/inventory");
  return { message: "Product Created Successfully", success: true };
}

export async function updateProduct(id: string, prevState: State, formData: FormData): Promise<State> {
  const validatedFields = FormSchema.safeParse({
    sku: formData.get("sku"),
    name: formData.get("name"),
    category: formData.get("category"),
    price: formData.get("price"),
    costPrice: formData.get("costPrice"),
    stock: formData.get("stock"),
    minStock: formData.get("minStock"),
    barcode: formData.get("barcode"),
    importedDate: formData.get("importedDate"),
    expiryDate: formData.get("expiryDate"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Product.",
      success: false,
    };
  }

  const { sku, name, category, price, costPrice, stock, minStock, barcode, importedDate, expiryDate } = validatedFields.data;

  try {
    const { store } = await requireAuth();
    await db
      .update(inventory)
      .set({
        sku,
        name,
        category: category || null,
        price: price.toString(),
        costPrice: costPrice?.toString() || null,
        stock,
        minStock,
        barcode: barcode || null,
        importedDate: importedDate || null,
        expiryDate: expiryDate || null,
        updatedAt: new Date(),
      })
      .where(and(eq(inventory.id, id), eq(inventory.storeId, store.id)));
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && (error as { code?: string }).code === '23505') {
       return {
        message: "A product with this SKU already exists.",
        success: false,
      };
    }
    return {
      message: "Database Error: Failed to Update Product.",
      success: false,
    };
  }

  revalidatePath("/inventory");
  return { message: "Product Updated Successfully", success: true };
}

export async function deleteProduct(id: string) {
  try {
    const { store } = await requireAuth();
    await db.delete(inventory).where(and(eq(inventory.id, id), eq(inventory.storeId, store.id)));
    revalidatePath("/inventory");
    return { message: "Deleted Product", success: true };
  } catch {
    return { message: "Database Error: Failed to Delete Product.", success: false };
  }
}
