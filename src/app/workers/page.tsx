import { TopAppBar } from "@/components/TopAppBar";
import { getWorkers } from "@/actions/workers";
import { WorkersClient } from "@/components/workers/WorkersClient";

export default async function WorkersPage() {
  const result = await getWorkers();
  const workers = result.success ? result.workers : [];

  return (
    <main className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <TopAppBar storeName="Stockholm Flagship" />
      <div className="flex-1 p-container-padding flex flex-col min-h-0">
        <div className="mb-6 flex-shrink-0">
          <h1 className="font-display text-display-lg text-on-surface leading-none tracking-tight">
            Workers
          </h1>
          <p className="font-body text-body-lg text-secondary mt-2">
            Manage your store personnel, attendance, and performance.
          </p>
        </div>
        
        <div className="flex-1 min-h-0">
          <WorkersClient workers={workers || []} />
        </div>
      </div>
    </main>
  );
}
