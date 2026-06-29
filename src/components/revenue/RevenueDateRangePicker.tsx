"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export function RevenueDateRangePicker({
  defaultFrom,
  defaultTo,
}: {
  defaultFrom?: Date;
  defaultTo?: Date;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [date, setDate] = useState<DateRange | undefined>({
    from: defaultFrom,
    to: defaultTo,
  });

  const handleSelect = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (newDate?.from && newDate?.to) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("from", format(newDate.from, "yyyy-MM-dd"));
      params.set("to", format(newDate.to, "yyyy-MM-dd"));
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger id="date" render={
          <Button variant={"outline"} className={cn("w-[300px] justify-start text-left font-normal bg-surface h-10", !date && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        } />
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
