"use server";

import { db } from "@/db";
import { bills, billItems, inventory } from "@/db/schema";
import { sql, sum, count, eq, gte, lte, and, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getRevenueSummary(from?: Date, to?: Date) {
  const { store } = await requireAuth();
  const startDate = from || new Date(new Date().setDate(new Date().getDate() - 30));
  const endDate = to || new Date();
  endDate.setHours(23, 59, 59, 999);

  const [result] = await db
    .select({
      totalRevenue: sum(bills.total),
      totalOrders: count(bills.id),
    })
    .from(bills)
    .where(and(gte(bills.createdAt, startDate), lte(bills.createdAt, endDate), eq(bills.storeId, store.id)));

  const totalRevenue = Number(result?.totalRevenue || 0);
  const totalOrders = Number(result?.totalOrders || 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return { totalRevenue, totalOrders, averageOrderValue };
}

export async function getDailyRevenue(from?: Date, to?: Date) {
  const { store } = await requireAuth();
  const startDate = from || new Date(new Date().setDate(new Date().getDate() - 30));
  const endDate = to || new Date();
  endDate.setHours(23, 59, 59, 999);

  const results = await db
    .select({
      date: sql<string>`DATE(${bills.createdAt})`,
      revenue: sum(bills.total),
    })
    .from(bills)
    .where(and(gte(bills.createdAt, startDate), lte(bills.createdAt, endDate), eq(bills.storeId, store.id)))
    .groupBy(sql`DATE(${bills.createdAt})`)
    .orderBy(sql`DATE(${bills.createdAt})`);

  return results.map((r) => ({
    date: new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: Number(r.revenue || 0),
  }));
}

export async function getRevenueByPaymentMethod(from?: Date, to?: Date) {
  const { store } = await requireAuth();
  const startDate = from || new Date(new Date().setDate(new Date().getDate() - 30));
  const endDate = to || new Date();
  endDate.setHours(23, 59, 59, 999);

  const results = await db
    .select({
      paymentMethod: bills.paymentMethod,
      revenue: sum(bills.total),
    })
    .from(bills)
    .where(and(gte(bills.createdAt, startDate), lte(bills.createdAt, endDate), eq(bills.storeId, store.id)))
    .groupBy(bills.paymentMethod);

  return results.map((r) => ({
    paymentMethod: r.paymentMethod,
    revenue: Number(r.revenue || 0),
  }));
}

export async function getRevenueByCategory(from?: Date, to?: Date) {
  const { store } = await requireAuth();
  const startDate = from || new Date(new Date().setDate(new Date().getDate() - 30));
  const endDate = to || new Date();
  endDate.setHours(23, 59, 59, 999);

  const results = await db
    .select({
      category: inventory.category,
      revenue: sum(billItems.totalPrice),
    })
    .from(billItems)
    .innerJoin(bills, eq(billItems.billId, bills.id))
    .innerJoin(inventory, eq(billItems.productId, inventory.id))
    .where(and(gte(bills.createdAt, startDate), lte(bills.createdAt, endDate), eq(bills.storeId, store.id)))
    .groupBy(inventory.category);

  return results.map((r) => ({
    category: r.category || "Uncategorized",
    revenue: Number(r.revenue || 0),
  }));
}

export async function getBillsByDateRange(from?: Date, to?: Date) {
  const { store } = await requireAuth();
  const startDate = from || new Date(new Date().setDate(new Date().getDate() - 30));
  const endDate = to || new Date();
  endDate.setHours(23, 59, 59, 999);

  const results = await db
    .select()
    .from(bills)
    .where(and(gte(bills.createdAt, startDate), lte(bills.createdAt, endDate), eq(bills.storeId, store.id)))
    .orderBy(desc(bills.createdAt));

  return results;
}

export async function createManualPastRecord(data: {
  date: Date;
  totalAmount: number;
  paymentMethod: string;
  customerName?: string;
  notes?: string;
}) {
  try {
    const { store } = await requireAuth();
    
    const invoicePrefix = store.invoicePrefix || "INV-";
    const d = data.date;
    const invoiceNumber = `${invoicePrefix}PAST-${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    await db.insert(bills).values({
      storeId: store.id,
      invoiceNumber,
      customerName: data.customerName,
      subtotal: data.totalAmount.toString(),
      tax: "0",
      discount: "0",
      total: data.totalAmount.toString(),
      paymentMethod: data.paymentMethod,
      notes: data.notes || "Manual past record entry",
      createdAt: data.date,
    });

    revalidatePath("/revenue");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to create manual past record:", error);
    return { success: false, error: "Failed to create manual past record" };
  }
}
