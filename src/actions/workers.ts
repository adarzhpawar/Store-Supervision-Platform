"use server";

import { db } from "@/db";
import { workers, attendance } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

// --- Workers ---

export async function getWorkers() {
  try {
    const { store } = await requireAuth();
    const allWorkers = await db.select().from(workers).where(eq(workers.storeId, store.id)).orderBy(workers.name);
    return { success: true, workers: allWorkers };
  } catch (error) {
    console.error("Failed to fetch workers:", error);
    return { success: false, error: "Failed to fetch workers" };
  }
}

export async function createWorker(data: {
  name: string;
  phone?: string | null;
  email?: string | null;
  role?: string | null;
  salary?: string | null;
  status?: string | null;
}) {
  try {
    const { store } = await requireAuth();

    if (data.email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(data.email)) return { success: false, error: "Please provide a valid email address" };
    }
    if (data.phone) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(data.phone)) return { success: false, error: "Please provide a valid phone number (e.g., +1234567890)" };
    }

    await db.insert(workers).values({
      storeId: store.id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      role: data.role,
      salary: data.salary,
      status: data.status || "active",
    });
    revalidatePath("/workers");
    return { success: true };
  } catch (error) {
    console.error("Failed to create worker:", error);
    return { success: false, error: "Failed to create worker" };
  }
}

export async function updateWorker(id: string, data: {
  name?: string;
  phone?: string | null;
  email?: string | null;
  role?: string | null;
  salary?: string | null;
  status?: string | null;
}) {
  try {
    const { store } = await requireAuth();

    if (data.email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(data.email)) return { success: false, error: "Please provide a valid email address" };
    }
    if (data.phone) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(data.phone)) return { success: false, error: "Please provide a valid phone number (e.g., +1234567890)" };
    }

    await db.update(workers).set(data).where(and(eq(workers.id, id), eq(workers.storeId, store.id)));
    revalidatePath("/workers");
    return { success: true };
  } catch (error) {
    console.error("Failed to update worker:", error);
    return { success: false, error: "Failed to update worker" };
  }
}

export async function deleteWorker(id: string) {
  try {
    const { store } = await requireAuth();
    await db.update(workers).set({ status: "inactive" }).where(and(eq(workers.id, id), eq(workers.storeId, store.id)));
    revalidatePath("/workers");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete worker:", error);
    return { success: false, error: "Failed to delete worker" };
  }
}

// --- Attendance ---

export async function getAttendance(dateStr: string) {
  try {
    const { store } = await requireAuth();
    
    // First, get all workers for this store
    const storeWorkers = await db.select({ id: workers.id }).from(workers).where(eq(workers.storeId, store.id));
    const workerIds = storeWorkers.map(w => w.id);
    
    if (workerIds.length === 0) {
      return { success: true, attendance: [] };
    }

    const records = await db.select().from(attendance).where(and(eq(attendance.date, dateStr), inArray(attendance.workerId, workerIds)));
    return { success: true, attendance: records };
  } catch (error) {
    console.error("Failed to fetch attendance:", error);
    return { success: false, error: "Failed to fetch attendance" };
  }
}

export async function markAttendance(workerId: string, dateStr: string, status: string) {
  try {
    const { store } = await requireAuth();
    
    // Verify worker belongs to store
    const worker = await db.query.workers.findFirst({
      where: and(eq(workers.id, workerId), eq(workers.storeId, store.id))
    });
    
    if (!worker) throw new Error("Worker not found or unauthorized");

    const existing = await db
      .select()
      .from(attendance)
      .where(and(eq(attendance.workerId, workerId), eq(attendance.date, dateStr)));

    if (existing.length > 0) {
      await db
        .update(attendance)
        .set({ status })
        .where(eq(attendance.id, existing[0].id));
    } else {
      await db.insert(attendance).values({
        workerId,
        date: dateStr,
        status,
      });
    }

    revalidatePath("/workers");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark attendance:", error);
    return { success: false, error: "Failed to mark attendance" };
  }
}
