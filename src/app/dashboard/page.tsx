import { TopAppBar } from "@/components/TopAppBar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { InventoryAlerts } from "@/components/dashboard/InventoryAlerts";
import { RecentBills } from "@/components/dashboard/RecentBills";
import { WorkerAttendance } from "@/components/dashboard/WorkerAttendance";

export default function DashboardPage() {
  return (
    <main className="flex-1 flex flex-col h-full bg-background overflow-y-auto">
      <TopAppBar storeName="Stockholm Flagship" />
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
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mt-2">
          <MetricCard
            title="Today's Revenue"
            value="$1,280.50"
            subtext="▲ 5%"
            subtextColor="success"
            icon="payments"
          />
          <MetricCard
            title="Weekly Revenue"
            value="$8,450.00"
            subtext="▼ 2%"
            subtextColor="error"
            icon="monitoring"
          />
          <MetricCard
            title="Low Stock Items"
            value="3 Items"
            subtext="Alert"
            subtextColor="error"
            icon="inventory_2"
            highlighted={true}
          />
          <MetricCard
            title="Staff Present"
            value="38 / 42"
            subtext="90% present"
            subtextColor="success"
            icon="group"
          />
        </section>

        {/* Charts and Attendance Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div>
            <WorkerAttendance />
          </div>
        </section>

        {/* Transactions & Stock Alerts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter pb-8">
          <div className="lg:col-span-2">
            <RecentBills />
          </div>
          <div>
            <InventoryAlerts />
          </div>
        </section>
      </div>
    </main>
  );
}
