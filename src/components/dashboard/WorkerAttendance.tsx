type AttendanceSummary = {
  total: number;
  present: number;
  absent: number;
  onLeave: number;
};

type FeaturedWorker = {
  name: string;
  role: string | null;
  status: string;
};

type WorkerAttendanceProps = {
  summary: AttendanceSummary;
  workers: FeaturedWorker[];
};

export function WorkerAttendance({ summary, workers }: WorkerAttendanceProps) {
  const presentRate = summary.total > 0 ? Math.round((summary.present / summary.total) * 100) : 0;

  return (
    <div className="premium-card flex flex-col gap-6">
      <div className="flex justify-between items-start sm:items-center gap-3 flex-wrap">
        <h3 className="font-headline text-headline-md text-on-surface">Personnel Attendance</h3>
        <span className="font-mono text-[10px] sm:text-xs text-secondary uppercase tracking-wider">
          Today
        </span>
      </div>

      {/* Progress bar and percentages */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap justify-between items-baseline gap-2">
          <span className="font-headline text-[32px] sm:text-[36px] font-bold text-on-surface leading-none">
            {summary.present}/{summary.total}
          </span>
          <span className="font-mono text-[10px] sm:text-xs text-tertiary font-bold">
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
          Absent: <span className="text-primary font-bold">{summary.absent}</span>
        </div>
        <div>
          On Leave: <span className="text-on-surface font-bold">{summary.onLeave}</span>
        </div>
      </div>

      {/* Live Active Roster snippet */}
      <div className="flex flex-col gap-3">
        <span className="font-mono text-label-mono text-secondary uppercase tracking-wider text-[10px]">
          Featured Roster
        </span>
        {workers.length === 0 ? (
          <p className="font-body text-body-md text-secondary">No workers registered yet.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {workers.map((worker) => (
              <div key={worker.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-body-md border-b sm:border-b-0 border-outline-variant/10 pb-2 sm:pb-0 last:border-b-0">
                <div className="min-w-0">
                  <span className="font-medium text-on-surface block truncate">{worker.name}</span>
                  <span className="text-secondary text-[12px] block truncate">{worker.role || "—"}</span>
                </div>
                <div className="flex-shrink-0 text-left sm:text-right">
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-[9px] uppercase border px-2 py-0.5 rounded-full whitespace-nowrap ${
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
