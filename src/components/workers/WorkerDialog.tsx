"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit } from "lucide-react";
import { createWorker, updateWorker } from "@/actions/workers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WorkerDialogProps {
  worker?: { id: string; name: string; phone?: string | null; email?: string | null; role?: string | null; salary?: string | null; status: string | null; };
  onSuccess?: () => void;
  trigger?: React.ReactElement;
}

export function WorkerDialog({ worker, onSuccess, trigger }: WorkerDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,
      salary: formData.get("salary") as string,
      status: formData.get("status") as string || "active",
    };

    let result;
    if (worker?.id) {
      result = await updateWorker(worker.id, data);
    } else {
      result = await createWorker(data);
    }

    setLoading(false);

    if (result.success) {
      setOpen(false);
      if (onSuccess) onSuccess();
    } else {
      setError(result.error || "An error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger ? trigger : (
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          {worker ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {worker ? "Edit Worker" : "Add Worker"}
        </Button>
      )} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{worker ? "Edit Worker" : "Add New Worker"}</DialogTitle>
          <DialogDescription>
            {worker ? "Update the details of the worker here." : "Enter the details of the new worker here."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" defaultValue={worker?.name} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={worker?.phone || ""} pattern="^\+?[1-9]\d{1,14}$" title="Please provide a valid phone number (e.g., +1234567890)" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={worker?.email || ""} pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" title="Please provide a valid email address" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" defaultValue={worker?.role || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary (₹)</Label>
              <Input id="salary" name="salary" type="number" step="0.01" defaultValue={worker?.salary || ""} />
            </div>
          </div>
          {worker && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={worker?.status || "active"}>
                <SelectTrigger id="status" className="h-10 w-full bg-background border-input text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? "Saving..." : (worker ? "Update Worker" : "Add Worker")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
