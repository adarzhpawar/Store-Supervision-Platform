type LowStockProduct = {
  sku: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
};

const mockAlerts: LowStockProduct[] = [
  {
    sku: "SKU-99302",
    name: "Oak Dining Chair",
    category: "Home Goods",
    stock: 2,
    minStock: 10,
  },
  {
    sku: "SKU-84920",
    name: "Nordic Ceramic Vase",
    category: "Accessories",
    stock: 1,
    minStock: 5,
  },
  {
    sku: "SKU-10294",
    name: "Structured Leather Tote",
    category: "Accessories",
    stock: 3,
    minStock: 8,
  },
];

export function InventoryAlerts() {
  return (
    <div className="premium-card flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="font-headline text-headline-md text-on-surface">Low Stock Alerts</h3>
        <span className="font-mono text-label-mono text-primary flex items-center gap-1.5 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Attention Needed
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {mockAlerts.map((item) => (
          <div
            key={item.sku}
            className="flex items-center justify-between py-3 border-b border-outline-variant/10 last:border-b-0"
          >
            <div>
              <h4 className="font-body text-body-md text-on-surface font-medium">
                {item.name}
              </h4>
              <p className="font-mono text-label-mono text-secondary mt-1">
                {item.sku} &bull; {item.category}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase border border-primary/20 px-3 py-1 rounded-full bg-error-container text-on-error-container font-semibold">
                {item.stock} left (Min: {item.minStock})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
