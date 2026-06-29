"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createManualPastRecord } from "@/actions/revenue";

export function AddPastRecordDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      date,
      totalAmount: parseFloat(formData.get("totalAmount") as string) || 0,
      paymentMethod,
      customerName: formData.get("customerName") as string,
      notes: formData.get("notes") as string,
    };

    if (data.totalAmount <= 0) {
      setError("Total amount must be greater than 0");
      setLoading(false);
      return;
    }

    const result = await createManualPastRecord(data);
    setLoading(false);

    if (result.success) {
      setOpen(false);
    } else {
      setError(result.error || "An error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10">
          <Plus className="mr-2 h-4 w-4" />
          Add Past Record
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Past Revenue Record</DialogTitle>
          <DialogDescription>
            Manually add a lump-sum revenue entry for a past date.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2 flex flex-col">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger render={
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal bg-background", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              } />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount (₹)</Label>
              <Input id="totalAmount" name="totalAmount" type="number" step="0.01" min="0.01" required className="h-9" />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v || '')}>
                <SelectTrigger className="w-full bg-background border-input text-sm h-9">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name (Optional)</Label>
            <Input id="customerName" name="customerName" className="h-9" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input id="notes" name="notes" placeholder="e.g. Bulk order from last week" className="h-9" />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? "Saving..." : "Add Record"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
