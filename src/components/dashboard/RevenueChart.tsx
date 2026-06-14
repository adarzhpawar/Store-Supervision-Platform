"use client";

import { MoreHorizontal } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

type ChartDataPoint = {
  month: string;
  revenue: number;
};

type RevenueChartProps = {
  data: ChartDataPoint[];
};

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="premium-card flex flex-col gap-6 h-[400px]">
      <div className="flex justify-between items-center">
        <span className="font-mono text-label-mono uppercase tracking-widest text-secondary">
          Monthly Revenue Trend
        </span>
        <MoreHorizontal size={20} className="text-secondary hover:text-on-surface cursor-pointer" />
      </div>

      <div className="flex-1 w-full h-full min-h-[220px]">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="font-mono text-label-mono text-secondary uppercase tracking-wider">
              No revenue data yet
            </span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="coralGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff4d4d" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ff4d4d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#5f5e5e", fontSize: 11, fontFamily: "JetBrains Mono" }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-surface border border-outline/20 p-3 rounded-lg shadow-sm font-mono text-[12px]">
                        <p className="text-secondary uppercase">{payload[0].payload.month}</p>
                        <p className="font-bold text-on-surface mt-1">
                          ₹{(payload[0].value as number)?.toLocaleString("en-IN")}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#ff4d4d"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#coralGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
