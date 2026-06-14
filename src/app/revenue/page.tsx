import { TopAppBar } from "@/components/TopAppBar";
import { RevenueSummaryCards } from "@/components/revenue/RevenueSummaryCards";
import { RevenueTrendChart } from "@/components/revenue/RevenueTrendChart";
import { RevenueBreakdownCharts } from "@/components/revenue/RevenueBreakdownCharts";
import {
  getRevenueSummary,
  getDailyRevenue,
  getRevenueByPaymentMethod,
  getRevenueByCategory,
} from "@/actions/revenue";

export const dynamic = 'force-dynamic';

export default async function RevenuePage() {
  const summary = await getRevenueSummary();
  const dailyData = await getDailyRevenue();
  const paymentData = await getRevenueByPaymentMethod();
  const categoryData = await getRevenueByCategory();

  return (
    <main className="flex-1 flex flex-col h-full bg-background overflow-y-auto">
      <TopAppBar storeName="Stockholm Flagship" />
      <div className="flex-1 p-container-padding max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-display text-display-lg text-on-surface leading-none tracking-tight">
              Revenue
            </h1>
            <p className="font-body text-body-lg text-secondary mt-2">
              Comprehensive financial overview for the last 30 days.
            </p>
          </div>
        </div>

        <RevenueSummaryCards 
          totalRevenue={summary.totalRevenue}
          totalOrders={summary.totalOrders}
          averageOrderValue={summary.averageOrderValue}
        />

        <RevenueTrendChart data={dailyData} />
        
        <RevenueBreakdownCharts 
          paymentData={paymentData}
          categoryData={categoryData}
        />
      </div>
    </main>
  );
}
