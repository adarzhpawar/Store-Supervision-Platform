"use client";

import { WorkerDialog } from "./WorkerDialog";
import { DeleteWorkerDialog } from "./DeleteWorkerDialog";
import { AttendanceManager } from "./AttendanceManager";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface WorkersClientProps {
  workers: any[];
}

export function WorkersClient({ workers }: WorkersClientProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("active");

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(search.toLowerCase()) || 
                          (worker.role || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" ? true : worker.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
      {/* Left Panel: Workers Directory */}
      <div className="flex-1 flex flex-col min-h-0 bg-surface rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-title-lg text-on-surface">Workers Directory</h2>
            <WorkerDialog />
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <Input 
                placeholder="Search by name or role..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="all">All Statuses</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-secondary uppercase bg-surface-hover sticky top-0">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium hidden sm:table-cell">Role</th>
                <th className="px-6 py-3 font-medium hidden md:table-cell">Contact</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-secondary">
                    No workers found.
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((worker) => (
                  <tr key={worker.id} className="border-b border-border hover:bg-surface-hover/50">
                    <td className="px-6 py-4 font-medium text-on-surface">
                      {worker.name}
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-secondary">
                      {worker.role || "—"}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-secondary">
                      <div>{worker.phone || "—"}</div>
                      <div className="text-xs">{worker.email || ""}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        worker.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {worker.status.charAt(0).toUpperCase() + worker.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <WorkerDialog 
                        worker={worker} 
                        trigger={
                          <Button variant="ghost" size="icon" className="text-secondary hover:text-on-surface hover:bg-surface-hover">
                            <Edit className="w-4 h-4" />
                          </Button>
                        } 
                      />
                      <DeleteWorkerDialog workerId={worker.id} workerName={worker.name} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Panel: Attendance Tracker */}
      <div className="lg:w-96 flex flex-col min-h-0">
        <AttendanceManager workers={workers} />
      </div>
    </div>
  );
}
