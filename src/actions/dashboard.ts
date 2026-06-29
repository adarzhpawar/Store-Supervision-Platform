"use server";

import { db } from "@/db";
import { bills, inventory, workers, attendance } from "@/db/schema";
import { sql, sum, count, eq, gte, and, lte, inArray } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function getDashboardMetrics() {
  const { store } = await requireAuth();
  const now = new Date();

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const [todayResult] = await db
    .select({ total: sum(bills.total) })
    .from(bills)
    .where(and(gte(bills.createdAt, todayStart), eq(bills.storeId, store.id)));
  const todayRevenue = Number(todayResult?.total || 0);

  const [yesterdayResult] = await db
    .select({ total: sum(bills.total) })
    .from(bills)
    .where(and(gte(bills.createdAt, yesterdayStart), lte(bills.createdAt, todayStart), eq(bills.storeId, store.id)));
  const yesterdayRevenue = Number(yesterdayResult?.total || 0);

  const [weekResult] = await db
    .select({ total: sum(bills.total) })
    .from(bills)
    .where(and(gte(bills.createdAt, weekStart), eq(bills.storeId, store.id)));
  const weeklyRevenue = Number(weekResult?.total || 0);

  const [lastWeekResult] = await db
    .select({ total: sum(bills.total) })
    .from(bills)
    .where(and(gte(bills.createdAt, lastWeekStart), lte(bills.createdAt, weekStart), eq(bills.storeId, store.id)));
  const lastWeekRevenue = Number(lastWeekResult?.total || 0);

  const [lowStockResult] = await db
    .select({ count: count() })
    .from(inventory)
    .where(and(sql`${inventory.stock} <= ${inventory.minStock}`, eq(inventory.storeId, store.id)));
  const lowStockCount = Number(lowStockResult?.count || 0);

  const todayDateStr = todayStart.toISOString().split("T")[0];

  const [totalWorkersResult] = await db
    .select({ count: count() })
    .from(workers)
    .where(and(eq(workers.status, "active"), eq(workers.storeId, store.id)));
  const staffTotal = Number(totalWorkersResult?.count || 0);

  // Present today
  const storeWorkers = await db.select({ id: workers.id }).from(workers).where(eq(workers.storeId, store.id));
  const workerIds = storeWorkers.map(w => w.id);
  
  let staffPresent = 0;
  if (workerIds.length > 0) {
    const [presentResult] = await db
      .select({ count: count() })
      .from(attendance)
      .where(and(eq(attendance.date, todayDateStr), eq(attendance.status, "Present"), inArray(attendance.workerId, workerIds)));
    staffPresent = Number(presentResult?.count || 0);
  }

  return {
    todayRevenue,
    yesterdayRevenue,
    weeklyRevenue,
    lastWeekRevenue,
    lowStockCount,
    staffPresent,
    staffTotal,
  };
}

export async function getMonthlyRevenueTrend() {
  const { store } = await requireAuth();
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const results = await db
    .select({
      month: sql<string>`TO_CHAR(${bills.createdAt}, 'Mon')`,
      monthIndex: sql<number>`EXTRACT(MONTH FROM ${bills.createdAt})`,
      year: sql<number>`EXTRACT(YEAR FROM ${bills.createdAt})`,
      revenue: sum(bills.total),
    })
    .from(bills)
    .where(and(gte(bills.createdAt, twelveMonthsAgo), eq(bills.storeId, store.id)))
    .groupBy(
      sql`TO_CHAR(${bills.createdAt}, 'Mon')`,
      sql`EXTRACT(MONTH FROM ${bills.createdAt})`,
      sql`EXTRACT(YEAR FROM ${bills.createdAt})`
    )
    .orderBy(
      sql`EXTRACT(YEAR FROM ${bills.createdAt})`,
      sql`EXTRACT(MONTH FROM ${bills.createdAt})`
    );

  return results.map((r) => ({
    month: r.month.trim(),
    revenue: Number(r.revenue || 0),
  }));
}

export async function getRecentBills(limit: number = 5) {
  const { store } = await requireAuth();
  const results = await db
    .select({
      id: bills.id,
      invoiceNumber: bills.invoiceNumber,
      customerName: bills.customerName,
      total: bills.total,
      paymentMethod: bills.paymentMethod,
      createdAt: bills.createdAt,
    })
    .from(bills)
    .where(eq(bills.storeId, store.id))
    .orderBy(sql`${bills.createdAt} DESC`)
    .limit(limit);

  return results;
}

export async function getLowStockProducts() {
  const { store } = await requireAuth();
  const results = await db
    .select({
      sku: inventory.sku,
      name: inventory.name,
      category: inventory.category,
      stock: inventory.stock,
      minStock: inventory.minStock,
    })
    .from(inventory)
    .where(and(sql`${inventory.stock} <= ${inventory.minStock}`, eq(inventory.storeId, store.id)))
    .orderBy(inventory.stock);

  return results;
}

export async function getTodayAttendanceSummary() {
  const { store } = await requireAuth();
  const todayDateStr = new Date().toISOString().split("T")[0];

  const activeWorkers = await db
    .select({
      id: workers.id,
      name: workers.name,
      role: workers.role,
    })
    .from(workers)
    .where(and(eq(workers.status, "active"), eq(workers.storeId, store.id)))
    .orderBy(workers.name);

  const workerIds = activeWorkers.map(w => w.id);
  
  let todayRecords: { workerId: string; status: string }[] = [];
  if (workerIds.length > 0) {
    todayRecords = await db
      .select({
        workerId: attendance.workerId,
        status: attendance.status,
      })
      .from(attendance)
      .where(and(eq(attendance.date, todayDateStr), inArray(attendance.workerId, workerIds)));
  }

  const statusMap = new Map<string, string>();
  for (const record of todayRecords) {
    statusMap.set(record.workerId, record.status);
  }

  const total = activeWorkers.length;
  let present = 0;
  let absent = 0;
  let onLeave = 0;

  const workerList = activeWorkers.map((w) => {
    const status = statusMap.get(w.id) || "Absent";
    if (status === "Present") present++;
    else if (status === "Leave") onLeave++;
    else absent++;

    return {
      name: w.name,
      role: w.role,
      status: status === "Present" ? "Active" : status === "Leave" ? "On Leave" : "Absent",
    };
  });

  const sortedWorkers = [...workerList].sort((a, b) => {
    const priority = { Active: 0, "On Leave": 1, Absent: 2 };
    return (priority[a.status as keyof typeof priority] ?? 2) - (priority[b.status as keyof typeof priority] ?? 2);
  });

  return {
    summary: { total, present, absent, onLeave },
    workers: sortedWorkers.slice(0, 3),
  };
}
