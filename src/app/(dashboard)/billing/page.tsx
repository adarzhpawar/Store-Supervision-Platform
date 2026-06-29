import { TopAppBar } from "@/components/TopAppBar";
import { POSInterface } from "@/components/billing/POSInterface";
import { db } from "@/db";
import { inventory } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export default async function BillingPage() {
  const { store } = await requireAuth();
  const productsData = await db.select().from(inventory).where(eq(inventory.storeId, store.id)).orderBy(asc(inventory.name));
  
  const products = productsData.map(p => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    price: p.price,
    stock: p.stock
  }));

  return (
    <main className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <TopAppBar storeName={store.name} />
      <div className="flex-1 p-container-padding flex flex-col h-full overflow-hidden">
        <div className="mb-4 shrink-0">
          <h1 className="font-display text-display-lg text-on-surface leading-none tracking-tight">
            Point of Sale
          </h1>
          <p className="font-body text-body-lg text-secondary mt-2">
            Create custom transactions, select products, and download PDF invoices.
          </p>
        </div>
        
        <div className="flex-1 min-h-0">
          <POSInterface products={products} />
        </div>
      </div>
    </main>
  );
}
