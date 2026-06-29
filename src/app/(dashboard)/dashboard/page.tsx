import { TopAppBar } from "@/components/TopAppBar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { InventoryAlerts } from "@/components/dashboard/InventoryAlerts";
import { RecentBills } from "@/components/dashboard/RecentBills";
import { WorkerAttendance } from "@/components/dashboard/WorkerAttendance";
import { requireAuth } from "@/lib/auth";
import {
  getDashboardMetrics,
  getMonthlyRevenueTrend,
  getRecentBills,
  getLowStockProducts,
  getTodayAttendanceSummary,
} from "@/actions/dashboard";

function formatCurrency(value: number): string {
  return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function computeChange(current: number, previous: number): { text: string; color: "success" | "error" | "neutral" } {
  if (previous === 0 && current === 0) return { text: "—", color: "neutral" };
  if (previous === 0) return { text: "▲ New", color: "success" };
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct > 0) return { text: `▲ ${pct}%`, color: "success" };
  if (pct < 0) return { text: `▼ ${Math.abs(pct)}%`, color: "error" };
  return { text: "— 0%", color: "neutral" };
}

export default async function DashboardPage() {
  const [{ store }, metrics, revenueData, recentBills, lowStockAlerts, attendanceData] =
    await Promise.all([
      requireAuth(),
      getDashboardMetrics(),
      getMonthlyRevenueTrend(),
      getRecentBills(5),
      getLowStockProducts(),
      getTodayAttendanceSummary(),
    ]);

  const todayChange = computeChange(metrics.todayRevenue, metrics.yesterdayRevenue);
  const weekChange = computeChange(metrics.weeklyRevenue, metrics.lastWeekRevenue);
  const staffPresentPct =
    metrics.staffTotal > 0
      ? `${Math.round((metrics.staffPresent / metrics.staffTotal) * 100)}% present`
      : "No staff";

  return (
    <main className="flex-1 flex flex-col h-full bg-background overflow-y-auto">
      <TopAppBar storeName={store.name} />
      <div className="flex-1 p-container-padding flex flex-col gap-gutter">
        {/* Page Header */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="font-display text-display-lg text-on-surface leading-none tracking-tight">
              Dashboard
            </h1>
            <p className="font-body text-body-lg text-secondary mt-2">
              Operational overview and real-time performance metrics.
            </p>
          </div>
        </section>

        {/* KPI Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-gutter mt-2">
          <MetricCard
            title="Today's Revenue"
            value={formatCurrency(metrics.todayRevenue)}
            subtext={todayChange.text}
            subtextColor={todayChange.color}
            icon="payments"
          />
          <MetricCard
            title="Weekly Revenue"
            value={formatCurrency(metrics.weeklyRevenue)}
            subtext={weekChange.text}
            subtextColor={weekChange.color}
            icon="monitoring"
          />
          <MetricCard
            title="Low Stock Items"
            value={`${metrics.lowStockCount} Item${metrics.lowStockCount !== 1 ? "s" : ""}`}
            subtext={metrics.lowStockCount > 0 ? "Alert" : "All Clear"}
            subtextColor={metrics.lowStockCount > 0 ? "error" : "success"}
            icon="inventory_2"
            highlighted={metrics.lowStockCount > 0}
          />
          <MetricCard
            title="Staff Present"
            value={`${metrics.staffPresent} / ${metrics.staffTotal}`}
            subtext={staffPresentPct}
            subtextColor={metrics.staffPresent > 0 ? "success" : "neutral"}
            icon="group"
          />
        </section>

        {/* Charts and Attendance Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <div className="lg:col-span-2">
            <RevenueChart data={revenueData} />
          </div>
          <div>
            <WorkerAttendance
              summary={attendanceData.summary}
              workers={attendanceData.workers}
            />
          </div>
        </section>

        {/* Transactions & Stock Alerts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter pb-8">
          <div className="lg:col-span-2">
            <RecentBills bills={recentBills} />
          </div>
          <div>
            <InventoryAlerts alerts={lowStockAlerts} />
          </div>
        </section>
      </div>
    </main>
  );
}
