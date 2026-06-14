type LowStockProduct = {
  sku: string;
  name: string;
  category: string | null;
  stock: number;
  minStock: number;
};

type InventoryAlertsProps = {
  alerts: LowStockProduct[];
};

export function InventoryAlerts({ alerts }: InventoryAlertsProps) {
  return (
    <div className="premium-card flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="font-headline text-headline-md text-on-surface">Low Stock Alerts</h3>
        {alerts.length > 0 ? (
          <span className="font-mono text-label-mono text-primary flex items-center gap-1.5 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Attention Needed
          </span>
        ) : (
          <span className="font-mono text-label-mono text-tertiary flex items-center gap-1.5 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
            All Clear
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
          <span className="font-headline text-[36px] leading-none">✓</span>
          <p className="font-body text-body-md text-secondary max-w-[280px]">
            All stock levels are healthy. No items below minimum threshold.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {alerts.map((item) => (
            <div
              key={item.sku}
              className="flex items-center justify-between py-3 border-b border-outline-variant/10 last:border-b-0"
            >
              <div>
                <h4 className="font-body text-body-md text-on-surface font-medium">
                  {item.name}
                </h4>
                <p className="font-mono text-label-mono text-secondary mt-1">
                  {item.sku} &bull; {item.category || "Uncategorized"}
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
      )}
    </div>
  );
}
