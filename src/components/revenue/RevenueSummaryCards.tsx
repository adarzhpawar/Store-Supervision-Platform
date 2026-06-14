import { Banknote, ShoppingCart, TrendingUp } from "lucide-react";

interface RevenueSummaryProps {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export function RevenueSummaryCards({ totalRevenue, totalOrders, averageOrderValue }: RevenueSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary mb-1">Total Revenue</p>
          <p className="text-3xl font-display text-on-surface">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Banknote className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary mb-1">Total Orders</p>
          <p className="text-3xl font-display text-on-surface">{totalOrders}</p>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <ShoppingCart className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary mb-1">Avg. Order Value</p>
          <p className="text-3xl font-display text-on-surface">${averageOrderValue.toFixed(2)}</p>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
