"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

interface PaymentMethodRevenue {
  paymentMethod: string;
  revenue: number;
}

interface CategoryRevenue {
  category: string;
  revenue: number;
}

const COLORS = ['#000000', '#4b5563', '#9ca3af', '#d1d5db', '#e5e7eb'];

export function RevenueBreakdownCharts({ 
  paymentData, 
  categoryData 
}: { 
  paymentData: PaymentMethodRevenue[];
  categoryData: CategoryRevenue[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col h-96">
        <h2 className="text-lg font-display text-on-surface mb-6">Revenue by Payment Method</h2>
        <div className="flex-1 min-h-0">
          {paymentData && paymentData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="revenue"
                  nameKey="paymentMethod"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-secondary text-sm">No payment data available</div>
          )}
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col h-96">
        <h2 className="text-lg font-display text-on-surface mb-6">Revenue by Category</h2>
        <div className="flex-1 min-h-0">
          {categoryData && categoryData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" opacity={0.5} />
                <XAxis type="number" tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} width={100} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  cursor={{fill: 'transparent'}}
                />
                <Bar dataKey="revenue" fill="#000000" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-secondary text-sm">No category data available</div>
          )}
        </div>
      </div>
    </div>
  );
}
