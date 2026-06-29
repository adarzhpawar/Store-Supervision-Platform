"use client";

import { useState, useEffect } from "react";
import { getAttendance, markAttendance } from "@/actions/workers";
import { Button } from "@/components/ui/button";

import { CheckCircle2, XCircle, Clock, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AttendanceManagerProps {
  workers: { id: string; name: string; status: string | null; role?: string | null; }[];
}

export function AttendanceManager({ workers }: AttendanceManagerProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [isFetching, setIsFetching] = useState(false);

  // Filter out inactive workers for attendance
  const activeWorkers = workers.filter(w => w.status === "active");

  useEffect(() => {
    async function loadAttendance() {
      const dateStr = format(date, 'yyyy-MM-dd');
      setIsFetching(true);
      const res = await getAttendance(dateStr);
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
    const dateStr = format(date, 'yyyy-MM-dd');
    setLoading(prev => ({ ...prev, [workerId]: true }));
    const res = await markAttendance(workerId, dateStr, status);
    if (res.success) {
      setAttendanceRecords(prev => ({ ...prev, [workerId]: status }));
    }
    setLoading(prev => ({ ...prev, [workerId]: false }));
  };

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-border bg-surface-hover flex items-center justify-between">
        <h3 className="font-display text-title-md text-on-surface">Daily Attendance</h3>
        <Popover>
          <PopoverTrigger render={
            <Button variant={"outline"} className={cn("w-auto min-w-[160px] justify-start text-left font-normal bg-background text-sm", !date && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          } />
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
            />
          </PopoverContent>
        </Popover>
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
              <div key={worker.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background hover:bg-surface-hover/50 transition-colors">
                <div className="min-w-0 flex-1 mr-3">
                  <p className="font-medium text-on-surface truncate">{worker.name}</p>
                  <p className="text-xs text-secondary truncate">{worker.role || "No role"}</p>
                </div>
                
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-full ${status === "Present" ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : "text-secondary hover:text-on-surface hover:bg-surface-hover"}`}
                    onClick={() => handleMarkAttendance(worker.id, "Present")}
                    disabled={isProcessing}
                    title="Present"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-full ${status === "Absent" ? "bg-red-500/10 text-red-600 hover:bg-red-500/20" : "text-secondary hover:text-on-surface hover:bg-surface-hover"}`}
                    onClick={() => handleMarkAttendance(worker.id, "Absent")}
                    disabled={isProcessing}
                    title="Absent"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-full ${status === "Leave" ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20" : "text-secondary hover:text-on-surface hover:bg-surface-hover"}`}
                    onClick={() => handleMarkAttendance(worker.id, "Leave")}
                    disabled={isProcessing}
                    title="Leave"
                  >
                    <Clock className="w-4 h-4" />
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
