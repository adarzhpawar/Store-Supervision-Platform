"use server";

import { db } from "@/db";
import { bills, billItems, inventory } from "@/db/schema";
import { sql, sum, count, eq, gte } from "drizzle-orm";

export async function getRevenueSummary() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [result] = await db
    .select({
      totalRevenue: sum(bills.total),
      totalOrders: count(bills.id),
    })
    .from(bills)
    .where(gte(bills.createdAt, thirtyDaysAgo));

  const totalRevenue = Number(result?.totalRevenue || 0);
  const totalOrders = Number(result?.totalOrders || 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
  };
}

export async function getDailyRevenue() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const results = await db
    .select({
      date: sql<string>`DATE(${bills.createdAt})`,
      revenue: sum(bills.total),
    })
    .from(bills)
    .where(gte(bills.createdAt, thirtyDaysAgo))
    .groupBy(sql`DATE(${bills.createdAt})`)
    .orderBy(sql`DATE(${bills.createdAt})`);

  return results.map((r) => ({
    date: new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: Number(r.revenue || 0),
  }));
}

export async function getRevenueByPaymentMethod() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const results = await db
    .select({
      paymentMethod: bills.paymentMethod,
      revenue: sum(bills.total),
    })
    .from(bills)
    .where(gte(bills.createdAt, thirtyDaysAgo))
    .groupBy(bills.paymentMethod);

  return results.map((r) => ({
    paymentMethod: r.paymentMethod,
    revenue: Number(r.revenue || 0),
  }));
}

export async function getRevenueByCategory() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const results = await db
    .select({
      category: inventory.category,
      revenue: sum(billItems.totalPrice),
    })
    .from(billItems)
    .innerJoin(bills, eq(billItems.billId, bills.id))
    .innerJoin(inventory, eq(billItems.productId, inventory.id))
    .where(gte(bills.createdAt, thirtyDaysAgo))
    .groupBy(inventory.category);

  return results.map((r) => ({
    category: r.category || "Uncategorized",
    revenue: Number(r.revenue || 0),
  }));
}
