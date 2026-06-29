import { createClient } from "@supabase/supabase-js";
import { db } from "./src/db";
import { stores, inventory, workers } from "./src/db/schema";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
  const email = "demo@store.com";
  const password = "Password123!";
  
  console.log("Creating new user...");
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    if (error.message.includes("already registered")) {
      console.log("User already exists. Logging in instead...");
      const loginRes = await supabase.auth.signInWithPassword({ email, password });
      if (loginRes.error) {
        console.error("Login failed:", loginRes.error);
        process.exit(1);
      }
      // Continue to seed if we just logged in.
      // But wait, if they already exist, we should check if they already have a store.
    } else {
      console.error("Signup error:", error);
      process.exit(1);
    }
  }
  
  // Need to get user either from signUp or signIn
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user) {
    console.error("No user returned");
    process.exit(1);
  }
  
  // Check if store exists
  const existingStores = await db.select().from(stores).where(eq(stores.ownerId, user.id));
  let store;
  
  if (existingStores.length > 0) {
    console.log("Store already exists for this user. Updating...");
    store = existingStores[0];
  } else {
    console.log("Creating store...");
    const [newStore] = await db.insert(stores).values({
      ownerId: user.id,
      name: "ElectroTech Hub",
      address: "404 Silicon Valley, Bangalore",
      phone: "+91 99999 88888",
      invoicePrefix: "TECH-",
      accentColor: "blue",
    }).returning();
    store = newStore;
  }
  
  console.log("Seeding inventory and workers for ElectroTech Hub...");
  
  // Add some inventory
  try {
    await db.insert(inventory).values([
      { storeId: store.id, sku: "ELEC-001", name: "Wireless Earbuds", category: "Audio", price: "2999.00", costPrice: "1500.00", stock: 45, minStock: 10 },
      { storeId: store.id, sku: "ELEC-002", name: "Mechanical Keyboard", category: "Accessories", price: "4500.00", costPrice: "2800.00", stock: 20, minStock: 5 },
      { storeId: store.id, sku: "ELEC-003", name: "27-inch 4K Monitor", category: "Displays", price: "24000.00", costPrice: "18000.00", stock: 8, minStock: 2 },
    ]);
  } catch {
    console.log("Inventory items might already exist.");
  }
  
  try {
    await db.insert(workers).values([
      { storeId: store.id, name: "Anita Bose", role: "Sales Rep", phone: "+919999911111", salary: "25000", status: "active" },
    ]);
  } catch {
    console.log("Workers might already exist.");
  }
  
  console.log("-----------------------------------------");
  console.log("Successfully seeded ElectroTech Hub.");
  console.log(`Login Email:    ${email}`);
  console.log(`Login Password: ${password}`);
  console.log("-----------------------------------------");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
