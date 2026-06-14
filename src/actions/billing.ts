"use server";

import { db } from "@/db";
import { bills, billItems, inventory } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const billItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
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

export type CreateBillState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  invoiceNumber?: string;
  billId?: string;
  billData?: any; // To pass back to client for PDF generation
};

export async function createBill(
  prevState: CreateBillState | null,
  formData: FormData
): Promise<CreateBillState> {
  try {
    const rawItems = formData.get("items") as string;
    const items = JSON.parse(rawItems || "[]");

    const validatedData = createBillSchema.safeParse({
      customerName: formData.get("customerName") as string,
      subtotal: parseFloat(formData.get("subtotal") as string),
      tax: parseFloat(formData.get("tax") as string),
      discount: parseFloat(formData.get("discount") as string),
      total: parseFloat(formData.get("total") as string),
      paymentMethod: formData.get("paymentMethod") as string,
      notes: formData.get("notes") as string,
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
    const invoiceNumber = `INV-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    let newBillId = "";

    await db.transaction(async (tx) => {
      // 1. Insert bill
      const [insertedBill] = await tx.insert(bills).values({
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
          .where(eq(inventory.id, item.productId));
      }
    });

    revalidatePath("/inventory");
    revalidatePath("/billing");
    
    // For PDF generation we want to return the structured data so the client has everything
    const billDataForPdf = {
      invoiceNumber,
      date: new Date().toISOString(),
      customerName: data.customerName || "Walk-in Customer",
      items: data.items, // Note: The client will map this with product names
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
