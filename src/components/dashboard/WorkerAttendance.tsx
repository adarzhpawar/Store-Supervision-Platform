type WorkerAttendanceSummary = {
  total: number;
  present: number;
  absent: number;
  onLeave: number;
};

const attendanceData: WorkerAttendanceSummary = {
  total: 42,
  present: 38,
  absent: 3,
  onLeave: 1,
};

type ActiveWorker = {
  name: string;
  role: string;
  status: "Active" | "On Leave" | "Absent";
};

const recentWorkers: ActiveWorker[] = [
  { name: "Aisha Patel", role: "Store Manager", status: "Active" },
  { name: "Ben Jacobson", role: "Senior Cashier", status: "Active" },
  { name: "Chloe Larsen", role: "Stock Clerk", status: "On Leave" },
];

export function WorkerAttendance() {
  const presentRate = Math.round((attendanceData.present / attendanceData.total) * 100);

  return (
    <div className="premium-card flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="font-headline text-headline-md text-on-surface">Personnel Attendance</h3>
        <span className="font-mono text-label-mono text-secondary uppercase tracking-wider">
          Today
        </span>
      </div>

      {/* Progress bar and percentages */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-baseline">
          <span className="font-headline text-[36px] font-bold text-on-surface leading-none">
            {attendanceData.present}/{attendanceData.total}
          </span>
          <span className="font-mono text-label-mono text-tertiary font-bold">
            {presentRate}% Present
          </span>
        </div>
        <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className="h-full bg-tertiary rounded-full transition-all duration-500"
            style={{ width: `${presentRate}%` }}
          />
        </div>
      </div>

      {/* Attendance sub-counts */}
      <div className="grid grid-cols-2 gap-4 border-t border-b border-outline-variant/10 py-4 font-mono text-label-mono text-secondary">
        <div>
          Absent: <span className="text-primary font-bold">{attendanceData.absent}</span>
        </div>
        <div>
          On Leave: <span className="text-on-surface font-bold">{attendanceData.onLeave}</span>
        </div>
      </div>

      {/* Live Active Roster snippet */}
      <div className="flex flex-col gap-3">
        <span className="font-mono text-label-mono text-secondary uppercase tracking-wider text-[10px]">
          Featured Roster
        </span>
        <div className="flex flex-col gap-2.5">
          {recentWorkers.map((worker) => (
            <div key={worker.name} className="flex items-center justify-between text-body-md">
              <div>
                <span className="font-medium text-on-surface">{worker.name}</span>
                <span className="text-secondary text-[12px] block">{worker.role}</span>
              </div>
              <span
                className={`inline-flex items-center gap-1 font-mono text-[9px] uppercase border px-2 py-0.5 rounded-full ${
                  worker.status === "Active"
                    ? "border-tertiary/20 bg-tertiary-container/10 text-tertiary"
                    : worker.status === "On Leave"
                    ? "border-outline/20 bg-surface-container-high text-secondary"
                    : "border-primary/20 bg-error-container/10 text-primary"
                }`}
              >
                {worker.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
