"use client";

import { useState, useEffect } from "react";
import { getAttendance, markAttendance } from "@/actions/workers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface AttendanceManagerProps {
  workers: { id: string; name: string; status: string | null; role?: string | null; }[];
}

export function AttendanceManager({ workers }: AttendanceManagerProps) {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [isFetching, setIsFetching] = useState(false);

  // Filter out inactive workers for attendance
  const activeWorkers = workers.filter(w => w.status === "active");

  useEffect(() => {
    async function loadAttendance() {
      setIsFetching(true);
      const res = await getAttendance(date);
      if (res.success && res.attendance) {
        const records: Record<string, string> = {};
        res.attendance.forEach(record => {
          records[record.workerId] = record.status;
        });
        setAttendanceRecords(records);
      }
      setIsFetching(false);
    }
    loadAttendance();
  }, [date]);

  const handleMarkAttendance = async (workerId: string, status: string) => {
    setLoading(prev => ({ ...prev, [workerId]: true }));
    const res = await markAttendance(workerId, date, status);
    if (res.success) {
      setAttendanceRecords(prev => ({ ...prev, [workerId]: status }));
    }
    setLoading(prev => ({ ...prev, [workerId]: false }));
  };

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-border bg-surface-hover flex items-center justify-between">
        <h3 className="font-display text-title-md text-on-surface">Daily Attendance</h3>
        <Input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)}
          className="w-auto"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isFetching ? (
          <div className="text-center py-8 text-secondary animate-pulse">Loading attendance...</div>
        ) : activeWorkers.length === 0 ? (
          <div className="text-center py-8 text-secondary">No active workers found.</div>
        ) : (
          activeWorkers.map((worker) => {
            const status = attendanceRecords[worker.id];
            const isProcessing = loading[worker.id];

            return (
              <div key={worker.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-border bg-background">
                <div className="mb-2 sm:mb-0">
                  <p className="font-medium text-on-surface">{worker.name}</p>
                  <p className="text-sm text-secondary">{worker.role || "No role"}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 sm:flex-none ${status === "Present" ? "bg-green-500/10 text-green-600 border-green-500/50 hover:bg-green-500/20" : ""}`}
                    onClick={() => handleMarkAttendance(worker.id, "Present")}
                    disabled={isProcessing}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Present
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 sm:flex-none ${status === "Absent" ? "bg-red-500/10 text-red-600 border-red-500/50 hover:bg-red-500/20" : ""}`}
                    onClick={() => handleMarkAttendance(worker.id, "Absent")}
                    disabled={isProcessing}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Absent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 sm:flex-none ${status === "Leave" ? "bg-amber-500/10 text-amber-600 border-amber-500/50 hover:bg-amber-500/20" : ""}`}
                    onClick={() => handleMarkAttendance(worker.id, "Leave")}
                    disabled={isProcessing}
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Leave
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
