import { db } from "./src/db";
import { stores, inventory, workers, bills, billItems } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const allStores = await db.select().from(stores);
  if (allStores.length === 0) {
    console.log("No stores found in the database. Please sign up in the app first.");
    process.exit(1);
  }

  const store = allStores[0];
  console.log(`Found store: ${store.name} (ID: ${store.id})`);

  // Update store details
  await db.update(stores).set({
    name: "Sri Balaji Kirana & General Store",
    address: "123 Main Road, Banjara Hills, Hyderabad, Telangana",
    phone: "+91 98765 43210",
    invoicePrefix: "SBK-",
    accentColor: "emerald", // Greenish for grocery
  }).where(eq(stores.id, store.id));
  console.log("Updated store details.");

  // Clear existing data for this store to avoid clutter
  console.log("Clearing old data...");
  await db.delete(billItems); // Will cascade or just delete all items
  await db.delete(bills).where(eq(bills.storeId, store.id));
  await db.delete(workers).where(eq(workers.storeId, store.id));
  await db.delete(inventory).where(eq(inventory.storeId, store.id));

  // Seed Indian Grocery Inventory
  console.log("Seeding inventory...");
  const newInventory = [
    { sku: "GRO-001", name: "Aashirvaad Whole Wheat Atta 5kg", category: "Staples", price: "245.00", costPrice: "210.00", stock: 50, minStock: 10, importedDate: "2026-06-01", barcode: "8901234567890" },
    { sku: "GRO-002", name: "India Gate Basmati Rice 5kg", category: "Staples", price: "480.00", costPrice: "400.00", stock: 30, minStock: 5, importedDate: "2026-06-05" },
    { sku: "GRO-003", name: "Tata Salt 1kg", category: "Staples", price: "28.00", costPrice: "22.00", stock: 100, minStock: 20 },
    { sku: "GRO-004", name: "Fortune Sunflower Oil 1L", category: "Cooking Essentials", price: "145.00", costPrice: "125.00", stock: 40, minStock: 10 },
    { sku: "GRO-005", name: "MDH Garam Masala 100g", category: "Spices", price: "85.00", costPrice: "65.00", stock: 60, minStock: 15 },
    { sku: "GRO-006", name: "Brooke Bond Red Label Tea 500g", category: "Beverages", price: "260.00", costPrice: "220.00", stock: 25, minStock: 5 },
    { sku: "GRO-007", name: "Amul Taaza Milk 1L", category: "Dairy", price: "68.00", costPrice: "62.00", stock: 15, minStock: 5, expiryDate: "2026-07-05" },
    { sku: "GRO-008", name: "Maggi 2-Minute Noodles 140g", category: "Snacks", price: "28.00", costPrice: "22.00", stock: 120, minStock: 30 },
    { sku: "GRO-009", name: "Toor Dal 1kg", category: "Staples", price: "165.00", costPrice: "140.00", stock: 35, minStock: 10 },
    { sku: "GRO-010", name: "Britannia Good Day Biscuits 250g", category: "Snacks", price: "40.00", costPrice: "32.00", stock: 80, minStock: 20 },
    { sku: "GRO-011", name: "Surf Excel Easy Wash 1kg", category: "Household", price: "135.00", costPrice: "115.00", stock: 45, minStock: 10 },
    { sku: "GRO-012", name: "Dettol Antiseptic Liquid 250ml", category: "Personal Care", price: "115.00", costPrice: "95.00", stock: 20, minStock: 5 },
  ];

  const insertedInventory = [];
  for (const item of newInventory) {
    const [row] = await db.insert(inventory).values({
      storeId: store.id,
      ...item,
    }).returning();
    insertedInventory.push(row);
  }

  // Seed Workers
  console.log("Seeding workers...");
  const newWorkers = [
    { name: "Rajesh Kumar", role: "Store Manager", phone: "+919876512345", salary: "18000.00", status: "active" },
    { name: "Suresh", role: "Cashier", phone: "+919876523456", salary: "12000.00", status: "active" },
    { name: "Amit Singh", role: "Helper", phone: "+919876534567", salary: "9000.00", status: "active" },
    { name: "Pooja Sharma", role: "Cleaner", phone: "+919876545678", salary: "7500.00", status: "inactive" },
  ];
  
  for (const worker of newWorkers) {
    await db.insert(workers).values({
      storeId: store.id,
      ...worker,
    });
  }

  // Seed Some Bills (Past 7 days)
  console.log("Seeding past bills...");
  const paymentMethods = ["Cash", "UPI", "UPI", "Card", "Cash"];
  
  for (let i = 0; i < 15; i++) {
    // Random date within last 7 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    
    // Pick 2-4 random items
    const numItems = Math.floor(Math.random() * 3) + 2;
    const items = [];
    let total = 0;
    
    for (let j = 0; j < numItems; j++) {
      const product = insertedInventory[Math.floor(Math.random() * insertedInventory.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const unitPrice = parseFloat(product.price);
      const totalPrice = unitPrice * quantity;
      total += totalPrice;
      
      items.push({
        productId: product.id,
        quantity,
        unitPrice: unitPrice.toString(),
        totalPrice: totalPrice.toString()
      });
    }
    
    const invoiceNumber = `SBK-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    const [bill] = await db.insert(bills).values({
      storeId: store.id,
      invoiceNumber,
      customerName: Math.random() > 0.5 ? "Walk-in Customer" : undefined,
      subtotal: total.toString(),
      tax: "0.00",
      discount: "0.00",
      total: total.toString(),
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      createdAt: date,
    }).returning();
    
    for (const item of items) {
      await db.insert(billItems).values({
        billId: bill.id,
        ...item,
      });
    }
  }

  console.log("Seeding complete! Indian Grocery store is ready.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
