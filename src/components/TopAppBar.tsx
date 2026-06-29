"use client";

import { Menu, Home, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/Sidebar";
import { useState, useEffect } from "react";
import Link from "next/link";
import { logoutAction } from "@/actions/auth";

import { usePathname } from "next/navigation";

export type TopAppBarProps = {
  storeName?: string;
};

export function TopAppBar({ storeName = "Main Store" }: TopAppBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    const timeoutId = setTimeout(() => {
      setCurrentTime(new Date());
      intervalId = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
    }, 0);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsOpen(false), 0);
    }
  }, [pathname, isOpen]);

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
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger render={
              <button className="text-on-surface hover:text-on-surface-variant flex items-center justify-center p-1">
                <Menu size={24} />
              </button>
            } />
            <SheetContent side="left" className="bg-surface border-r border-outline/10 p-0 w-72 flex flex-col pt-margin-md px-margin-sm pb-8 gap-base overflow-y-auto">
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
          title="Return to Dashboard"
        >
          <Home size={18} />
        </Link>
        <form action={logoutAction}>
          <button 
            type="submit"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-high border border-outline hover:border-error hover:text-error text-secondary transition-colors"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </form>
      </div>
    </header>
  );
}
