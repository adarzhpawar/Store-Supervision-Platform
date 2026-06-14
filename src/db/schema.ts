import { pgTable, uuid, varchar, decimal, integer, timestamp, date, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const workers = pgTable("workers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  role: varchar("role", { length: 50 }),
  salary: decimal("salary", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 50 }).default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inventory = pgTable("inventory", {
  id: uuid("id").primaryKey().defaultRandom(),
  sku: varchar("sku", { length: 100 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
  stock: integer("stock").notNull().default(0),
  minStock: integer("min_stock").notNull().default(0),
  barcode: varchar("barcode", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bills = pgTable("bills", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceNumber: varchar("invoice_number", { length: 100 }).unique().notNull(),
  customerName: varchar("customer_name", { length: 255 }),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0.00"),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0.00"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(), // Card, Cash, UPI
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const billItems = pgTable("bill_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  billId: uuid("bill_id").references(() => bills.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => inventory.id, { onDelete: "restrict" }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});

export const attendance = pgTable("attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  workerId: uuid("worker_id").references(() => workers.id, { onDelete: "cascade" }).notNull(),
  date: date("date").notNull(),
  status: varchar("status", { length: 50 }).notNull(), // Present, Absent, Leave
});

export const settings = pgTable("settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  storeName: varchar("store_name", { length: 255 }).notNull().default("My Store"),
  storeAddress: text("store_address"),
  storePhone: varchar("store_phone", { length: 50 }),
  taxRate: decimal("tax_rate", { precision: 10, scale: 2 }).notNull().default("0.00"),
  invoicePrefix: varchar("invoice_prefix", { length: 20 }).notNull().default("INV-"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relationships
export const billsRelations = relations(bills, ({ many }) => ({
  items: many(billItems),
}));

export const billItemsRelations = relations(billItems, ({ one }) => ({
  bill: one(bills, {
    fields: [billItems.billId],
    references: [bills.id],
  }),
  product: one(inventory, {
    fields: [billItems.productId],
    references: [inventory.id],
  }),
}));

export const workersRelations = relations(workers, ({ many }) => ({
  attendanceRecords: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  worker: one(workers, {
    fields: [attendance.workerId],
    references: [workers.id],
  }),
}));
