"use server";

import { db } from "@/db";
import { bills, billItems, inventory } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

const billItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().nonnegative().optional(),
  name: z.string().optional(),
});

const createBillSchema = z.object({
  customerName: z.string().optional(),
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  total: z.number().nonnegative(),
  paymentMethod: z.string().min(1, "Payment method is required"),
  notes: z.string().optional(),
  items: z.array(billItemSchema).min(1, "At least one item is required"),
});

export type BillData = {
  invoiceNumber: string;
  date: string;
  storeName: string;
  accentColor: string;
  customerName: string;
  items: { productId: string; quantity: number; unitPrice: number; totalPrice: number; name: string }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
};

export type CreateBillState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  invoiceNumber?: string;
  billId?: string;
  billData?: BillData; // To pass back to client for PDF generation
};

export async function createBill(
  prevState: CreateBillState | null,
  formData: FormData
): Promise<CreateBillState> {
  try {
    const { store } = await requireAuth();
    const rawItems = formData.get("items") as string;
    const items = JSON.parse(rawItems || "[]");

    const validatedData = createBillSchema.safeParse({
      customerName: formData.get("customerName")?.toString() || undefined,
      subtotal: parseFloat(formData.get("subtotal") as string) || 0,
      tax: parseFloat(formData.get("tax") as string) || 0,
      discount: parseFloat(formData.get("discount") as string) || 0,
      total: parseFloat(formData.get("total") as string) || 0,
      paymentMethod: formData.get("paymentMethod")?.toString() || "",
      notes: formData.get("notes")?.toString() || undefined,
      items: items,
    });

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid form data.",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const data = validatedData.data;

    // Generate unique invoice number
    const date = new Date();
    // Use store prefix if possible, here we'll just prepend the default or custom
    const invoicePrefix = store.invoicePrefix || "INV-";
    const invoiceNumber = `${invoicePrefix}${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    let newBillId = "";

    await db.transaction(async (tx) => {
      // 1. Insert bill
      const [insertedBill] = await tx.insert(bills).values({
        storeId: store.id,
        invoiceNumber,
        customerName: data.customerName,
        subtotal: data.subtotal.toString(),
        tax: data.tax.toString(),
        discount: data.discount.toString(),
        total: data.total.toString(),
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      }).returning({ id: bills.id });

      newBillId = insertedBill.id;

      // 2. Insert bill items and deduct inventory
      for (const item of data.items) {
        await tx.insert(billItems).values({
          billId: insertedBill.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          totalPrice: (item.quantity * item.unitPrice).toString(),
        });

        // Deduct inventory
        await tx.update(inventory)
          .set({
            stock: sql`${inventory.stock} - ${item.quantity}`,
          })
          .where(and(eq(inventory.id, item.productId), eq(inventory.storeId, store.id)));
      }
    });

    revalidatePath("/inventory");
    revalidatePath("/billing");
    revalidatePath("/dashboard");
    
    // For PDF generation we want to return the structured data so the client has everything
    const billDataForPdf = {
      invoiceNumber,
      date: new Date().toISOString(),
      storeName: store.name,
      accentColor: store.accentColor || 'red',
      customerName: data.customerName || "Walk-in Customer",
      items: data.items.map(item => ({
        ...item,
        totalPrice: item.totalPrice ?? (item.quantity * item.unitPrice),
        name: item.name || "Unknown Product"
      })),
      subtotal: data.subtotal,
      tax: data.tax,
      discount: data.discount,
      total: data.total,
      paymentMethod: data.paymentMethod
    };

    return {
      success: true,
      message: "Bill created successfully.",
      invoiceNumber,
      billId: newBillId,
      billData: billDataForPdf
    };
  } catch (error) {
    console.error("Failed to create bill:", error);
    return {
      success: false,
      message: "An unexpected error occurred while creating the bill.",
    };
  }
}
