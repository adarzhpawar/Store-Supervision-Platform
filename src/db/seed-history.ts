import "dotenv/config";
import { db } from "./index";
import { inventory, bills, billItems } from "./schema";
import { like } from "drizzle-orm";

async function main() {
  console.log("Seeding database with more inventory and past sales data...");

  // 1. Add more inventory items
  const newProducts = [
    { sku: "GRO-100", name: "Organic Rice 5kg", category: "Grocery", price: "450.00", costPrice: "380.00", stock: 50, minStock: 10, barcode: "8901234567890" },
    { sku: "GRO-101", name: "Whole Wheat Flour 10kg", category: "Grocery", price: "350.00", costPrice: "290.00", stock: 40, minStock: 15, barcode: "8901234567891" },
    { sku: "BEV-200", name: "Green Tea Pack", category: "Beverages", price: "150.00", costPrice: "110.00", stock: 100, minStock: 20, barcode: "8901234567892" },
    { sku: "BEV-201", name: "Orange Juice 1L", category: "Beverages", price: "120.00", costPrice: "85.00", stock: 60, minStock: 10, barcode: "8901234567893" },
    { sku: "SNA-300", name: "Potato Chips Family Pack", category: "Snacks", price: "80.00", costPrice: "55.00", stock: 150, minStock: 30, barcode: "8901234567894" },
    { sku: "SNA-301", name: "Mixed Nuts 250g", category: "Snacks", price: "250.00", costPrice: "190.00", stock: 45, minStock: 15, barcode: "8901234567895" },
    { sku: "DAI-400", name: "Cheddar Cheese 200g", category: "Dairy", price: "180.00", costPrice: "140.00", stock: 25, minStock: 5, barcode: "8901234567896" },
    { sku: "DAI-401", name: "Almond Milk 1L", category: "Dairy", price: "300.00", costPrice: "240.00", stock: 30, minStock: 10, barcode: "8901234567897" },
    { sku: "HOU-500", name: "Laundry Detergent 2L", category: "Household", price: "400.00", costPrice: "320.00", stock: 35, minStock: 10, barcode: "8901234567898" },
    { sku: "HOU-501", name: "Dishwashing Liquid 500ml", category: "Household", price: "99.00", costPrice: "70.00", stock: 80, minStock: 20, barcode: "8901234567899" },
    { sku: "PER-600", name: "Herbal Shampoo 400ml", category: "Personal Care", price: "220.00", costPrice: "160.00", stock: 40, minStock: 10, barcode: "8901234567900" },
    { sku: "PER-601", name: "Body Lotion 300ml", category: "Personal Care", price: "180.00", costPrice: "130.00", stock: 50, minStock: 15, barcode: "8901234567901" },
    { sku: "STA-700", name: "A4 Paper Ream (500 sheets)", category: "Stationery", price: "250.00", costPrice: "200.00", stock: 60, minStock: 15, barcode: "8901234567902" },
    { sku: "STA-701", name: "Ballpoint Pens (Pack of 10)", category: "Stationery", price: "100.00", costPrice: "60.00", stock: 120, minStock: 25, barcode: "8901234567903" },
    { sku: "ELE-800", name: "AA Batteries (Pack of 4)", category: "Electronics", price: "150.00", costPrice: "110.00", stock: 80, minStock: 20, barcode: "8901234567904" },
    { sku: "ELE-801", name: "LED Bulb 9W", category: "Electronics", price: "120.00", costPrice: "85.00", stock: 55, minStock: 15, barcode: "8901234567905" }
  ];

  let insertedProducts = [];
  for (const prod of newProducts) {
    try {
      const result = await db.insert(inventory).values(prod).returning();
      insertedProducts.push(result[0]);
    } catch (e: any) {
      // If it already exists, ignore
      if (e.code === '23505') {
        console.log(`Product ${prod.sku} already exists, skipping.`);
      } else {
        console.error(`Error inserting ${prod.sku}:`, e.message);
      }
    }
  }
  
  // Get all inventory so we have a pool to choose from for bills
  const allInventory = await db.select().from(inventory);
  if (allInventory.length === 0) {
    console.error("No inventory items found to create sales.");
    return;
  }

  // 2. Generate sales for the past 6 months
  console.log("Cleaning up previously generated historical bills...");
  await db.delete(bills).where(like(bills.invoiceNumber, 'INV-HIST-%'));

  const pastMonths = 6;
  let billsToInsert = [];
  let currentInvoiceNumber = Date.now() - 1000000; // Offset to avoid clashing with new real ones as much

  // Helper to generate a random date in a given month offset
  const getRandomDate = (monthsAgo: number) => {
    const now = new Date();
    const d = new Date();
    d.setMonth(d.getMonth() - monthsAgo);
    
    const maxDay = monthsAgo === 0 ? now.getDate() : 28;
    d.setDate(Math.floor(Math.random() * maxDay) + 1); // Random day 1-maxDay
    
    d.setHours(Math.floor(Math.random() * 10) + 9); // Random hour 9 AM - 6 PM
    d.setMinutes(Math.floor(Math.random() * 60));
    
    if (d > now) {
      return now;
    }
    return d;
  };

  const paymentMethods = ["Card", "Cash", "UPI"];
  const customerNames = ["Rahul", "Priya", "Amit", "Sneha", "Karan", "Neha", "Vikram", "Pooja", "Ravi", "Anjali", "Suresh", "Ramesh", "Deepa"];

  let totalBillsCreated = 0;

  for (let monthAgo = pastMonths; monthAgo >= 0; monthAgo--) {
    // Generate 30-50 bills per month to make the chart look decent
    const numBills = Math.floor(Math.random() * 21) + 30;
    
    for (let i = 0; i < numBills; i++) {
      const billDate = getRandomDate(monthAgo);
      const invoiceNum = `INV-HIST-${currentInvoiceNumber++}`;
      const customer = Math.random() > 0.3 ? customerNames[Math.floor(Math.random() * customerNames.length)] : null;
      
      // Determine items
      const numItems = Math.floor(Math.random() * 5) + 1; // 1 to 5 items
      let subtotal = 0;
      
      // Select random items
      const selectedProducts = [];
      const usedIds = new Set();
      
      for (let j = 0; j < numItems; j++) {
        let prod;
        do {
          prod = allInventory[Math.floor(Math.random() * allInventory.length)];
        } while (usedIds.has(prod.id) && allInventory.length > numItems);
        usedIds.add(prod.id);
        
        const qty = Math.floor(Math.random() * 3) + 1; // 1 to 3
        const price = parseFloat(prod.price as any);
        const itemTotal = qty * price;
        subtotal += itemTotal;
        
        selectedProducts.push({
          productId: prod.id,
          quantity: qty,
          unitPrice: price.toFixed(2),
          totalPrice: itemTotal.toFixed(2)
        });
      }
      
      const discount = Math.random() > 0.8 ? subtotal * 0.05 : 0; // 5% discount randomly
      const tax = (subtotal - discount) * 0.05; // 5% tax
      const total = subtotal - discount + tax;
      
      const billValues = {
        invoiceNumber: invoiceNum,
        customerName: customer,
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        createdAt: billDate
      };
      
      // Insert bill
      const insertedBill = await db.insert(bills).values(billValues).returning();
      
      // Insert bill items
      for (const item of selectedProducts) {
        await db.insert(billItems).values({
          billId: insertedBill[0].id,
          ...item
        });
      }
      totalBillsCreated++;
    }
  }

  console.log(`Successfully added new inventory items and generated ${totalBillsCreated} historical bills.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
