import { TopAppBar } from "@/components/TopAppBar";
import { db } from "@/db";
import { inventory } from "@/db/schema";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { CreateProductDialog } from "@/components/inventory/CreateProductDialog";
import { desc, eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export default async function InventoryPage() {
  const { store } = await requireAuth();
  const products = await db.select().from(inventory).where(eq(inventory.storeId, store.id)).orderBy(desc(inventory.createdAt));

  return (
    <main className="flex-1 flex flex-col h-full bg-background overflow-y-auto">
      <TopAppBar storeName={store.name} />
      <div className="flex-1 p-container-padding">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display-lg text-on-surface leading-none tracking-tight">
              Inventory
            </h1>
            <p className="font-body text-body-lg text-secondary mt-2">
              Track products, monitor stock quantities, and low stock items.
            </p>
          </div>
          <CreateProductDialog />
        </div>
        
        <InventoryTable products={products} />
      </div>
    </main>
  );
}
