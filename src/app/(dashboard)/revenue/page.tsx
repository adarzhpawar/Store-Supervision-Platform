import { TopAppBar } from "@/components/TopAppBar";
import { RevenueSummaryCards } from "@/components/revenue/RevenueSummaryCards";
import { RevenueTrendChart } from "@/components/revenue/RevenueTrendChart";
import { RevenueBreakdownCharts } from "@/components/revenue/RevenueBreakdownCharts";
import { RevenueDateRangePicker } from "@/components/revenue/RevenueDateRangePicker";
import { AddPastRecordDialog } from "@/components/revenue/AddPastRecordDialog";
import { BillsList } from "@/components/revenue/BillsList";
import { requireAuth } from "@/lib/auth";
import {
  getRevenueSummary,
  getDailyRevenue,
  getRevenueByPaymentMethod,
  getRevenueByCategory,
  getBillsByDateRange,
} from "@/actions/revenue";
import { parseISO } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function RevenuePage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}) {
  // Support both Next.js 14 and 15 searchParams behavior
  const params = props.searchParams instanceof Promise ? await props.searchParams : props.searchParams;
  const fromParam = params && typeof params.from === "string" ? params.from : undefined;
  const toParam = params && typeof params.to === "string" ? params.to : undefined;

  const from = fromParam ? parseISO(fromParam) : undefined;
  const to = toParam ? parseISO(toParam) : undefined;

  const [{ store }, summary, dailyData, paymentData, categoryData, bills] = await Promise.all([
    requireAuth(),
    getRevenueSummary(from, to),
    getDailyRevenue(from, to),
    getRevenueByPaymentMethod(from, to),
    getRevenueByCategory(from, to),
    getBillsByDateRange(from, to),
  ]);

  return (
    <main className="flex-1 flex flex-col h-full bg-background overflow-y-auto">
      <TopAppBar storeName={store.name} />
      <div className="flex-1 p-container-padding max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-display-lg text-on-surface leading-none tracking-tight">
              Revenue
            </h1>
            <p className="font-body text-body-lg text-secondary mt-2">
              Comprehensive financial overview.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:items-center gap-3">
            <RevenueDateRangePicker defaultFrom={from} defaultTo={to} />
            <AddPastRecordDialog />
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

        <BillsList bills={bills} />
      </div>
    </main>
  );
}
