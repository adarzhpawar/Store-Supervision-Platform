"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DailyRevenue {
  date: string;
  revenue: number;
}

export function RevenueTrendChart({ data }: { data: DailyRevenue[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col h-96 items-center justify-center">
        <h2 className="text-lg font-display text-on-surface mb-2">Revenue Trend</h2>
        <p className="text-secondary text-sm">No revenue data for the selected period.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col h-96">
      <h2 className="text-lg font-display text-on-surface mb-6">Revenue Trend (Last 30 Days)</h2>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "#6b7280" }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "#6b7280" }} 
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', color: '#111827' }}
              itemStyle={{ color: '#000000', fontWeight: 'bold' }}
              formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#000000" 
              strokeWidth={3} 
              dot={false}
              activeDot={{ r: 6, fill: "#000000" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
