"use client";

import { Menu, Home } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/Sidebar";
import { useState, useEffect } from "react";
import Link from "next/link";

export type TopAppBarProps = {
  storeName?: string;
};

export function TopAppBar({ storeName = "Main Store" }: TopAppBarProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime
    ? currentTime.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  return (
    <header className="bg-surface/80 backdrop-blur-md flex justify-between items-center h-20 px-margin-md md:px-margin-lg border-b border-outline/10 sticky top-0 z-10">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <button className="text-on-surface hover:text-on-surface-variant flex items-center justify-center p-1" />
              }
            >
              <Menu size={24} />
            </SheetTrigger>
            <SheetContent side="left" className="bg-surface border-r border-outline/10 p-0 w-72 flex flex-col pt-margin-md px-margin-sm gap-base overflow-y-auto">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
        <span className="text-on-surface border-b border-primary font-mono text-label-mono uppercase tracking-widest pb-1">
          {storeName}
        </span>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <span className="font-mono text-label-mono uppercase tracking-widest text-secondary hidden sm:inline">
          {formattedTime}
        </span>
        <Link 
          href="/" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-high border border-outline hover:border-primary text-secondary hover:text-primary transition-colors"
          title="Return to Landing Page"
        >
          <Home size={18} />
        </Link>
      </div>
    </header>
  );
}
