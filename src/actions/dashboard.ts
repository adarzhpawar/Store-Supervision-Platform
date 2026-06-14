"use server";

import { db } from "@/db";
import { bills, inventory, workers, attendance } from "@/db/schema";
import { sql, sum, count, eq, gte, and, lte } from "drizzle-orm";

/**
 * Get KPI metrics for the dashboard:
 * - Today's revenue + yesterday comparison
 * - Weekly revenue + last week comparison
 * - Low stock item count
 * - Staff attendance counts for today
 */
export async function getDashboardMetrics() {
  const now = new Date();

  // Today: midnight to now
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  // This week: 7 days ago to now
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  // Today's revenue
  const [todayResult] = await db
    .select({ total: sum(bills.total) })
    .from(bills)
    .where(gte(bills.createdAt, todayStart));
  const todayRevenue = Number(todayResult?.total || 0);

  // Yesterday's revenue
  const [yesterdayResult] = await db
    .select({ total: sum(bills.total) })
    .from(bills)
    .where(and(gte(bills.createdAt, yesterdayStart), lte(bills.createdAt, todayStart)));
  const yesterdayRevenue = Number(yesterdayResult?.total || 0);

  // This week's revenue
  const [weekResult] = await db
    .select({ total: sum(bills.total) })
    .from(bills)
    .where(gte(bills.createdAt, weekStart));
  const weeklyRevenue = Number(weekResult?.total || 0);

  // Last week's revenue
  const [lastWeekResult] = await db
    .select({ total: sum(bills.total) })
    .from(bills)
    .where(and(gte(bills.createdAt, lastWeekStart), lte(bills.createdAt, weekStart)));
  const lastWeekRevenue = Number(lastWeekResult?.total || 0);

  // Low stock count
  const [lowStockResult] = await db
    .select({ count: count() })
    .from(inventory)
    .where(sql`${inventory.stock} <= ${inventory.minStock}`);
  const lowStockCount = Number(lowStockResult?.count || 0);

  // Today's attendance
  const todayDateStr = todayStart.toISOString().split("T")[0]; // YYYY-MM-DD

  // Total active workers
  const [totalWorkersResult] = await db
    .select({ count: count() })
    .from(workers)
    .where(eq(workers.status, "active"));
  const staffTotal = Number(totalWorkersResult?.count || 0);

  // Present today
  const [presentResult] = await db
    .select({ count: count() })
    .from(attendance)
    .where(and(eq(attendance.date, todayDateStr), eq(attendance.status, "Present")));
  const staffPresent = Number(presentResult?.count || 0);

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

/**
 * Get monthly revenue trend for the last 12 months.
 */
export async function getMonthlyRevenueTrend() {
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
    .where(gte(bills.createdAt, twelveMonthsAgo))
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

/**
 * Get the most recent bills for the dashboard table.
 */
export async function getRecentBills(limit: number = 5) {
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
    .orderBy(sql`${bills.createdAt} DESC`)
    .limit(limit);

  return results;
}

/**
 * Get inventory items where stock is at or below the minimum threshold.
 */
export async function getLowStockProducts() {
  const results = await db
    .select({
      sku: inventory.sku,
      name: inventory.name,
      category: inventory.category,
      stock: inventory.stock,
      minStock: inventory.minStock,
    })
    .from(inventory)
    .where(sql`${inventory.stock} <= ${inventory.minStock}`)
    .orderBy(inventory.stock);

  return results;
}

/**
 * Get today's attendance summary and a list of featured workers.
 */
export async function getTodayAttendanceSummary() {
  const todayDateStr = new Date().toISOString().split("T")[0];

  // Get all active workers
  const activeWorkers = await db
    .select({
      id: workers.id,
      name: workers.name,
      role: workers.role,
    })
    .from(workers)
    .where(eq(workers.status, "active"))
    .orderBy(workers.name);

  // Get today's attendance records
  const todayRecords = await db
    .select({
      workerId: attendance.workerId,
      status: attendance.status,
    })
    .from(attendance)
    .where(eq(attendance.date, todayDateStr));

  // Build a map of workerId -> status
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

  // Return first 3 featured workers (prioritize present, then on leave, then absent)
  const sortedWorkers = [...workerList].sort((a, b) => {
    const priority = { Active: 0, "On Leave": 1, Absent: 2 };
    return (priority[a.status as keyof typeof priority] ?? 2) - (priority[b.status as keyof typeof priority] ?? 2);
  });

  return {
    summary: { total, present, absent, onLeave },
    workers: sortedWorkers.slice(0, 3),
  };
}
