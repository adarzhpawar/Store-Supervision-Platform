"use server";

import { db } from "@/db";
import { workers, attendance } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- Workers ---

export async function getWorkers() {
  try {
    const allWorkers = await db.select().from(workers).orderBy(workers.name);
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
    await db.insert(workers).values({
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
    await db.update(workers).set(data).where(eq(workers.id, id));
    revalidatePath("/workers");
    return { success: true };
  } catch (error) {
    console.error("Failed to update worker:", error);
    return { success: false, error: "Failed to update worker" };
  }
}

// Implement soft delete to preserve historical records
export async function deleteWorker(id: string) {
  try {
    await db.update(workers).set({ status: "inactive" }).where(eq(workers.id, id));
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
    const records = await db.select().from(attendance).where(eq(attendance.date, dateStr));
    return { success: true, attendance: records };
  } catch (error) {
    console.error("Failed to fetch attendance:", error);
    return { success: false, error: "Failed to fetch attendance" };
  }
}

export async function markAttendance(workerId: string, dateStr: string, status: string) {
  try {
    // Check if record exists
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
