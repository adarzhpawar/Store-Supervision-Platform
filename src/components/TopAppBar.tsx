"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/Sidebar";

export type TopAppBarProps = {
  storeName?: string;
};

export function TopAppBar({ storeName = "Main Store" }: TopAppBarProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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
          {currentDate}
        </span>
        <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-outline">
          <img
            alt="Admin Avatar"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuArNovtbbfZtGlvoFzfF6dLnqSF2krcjiEF-p4QkQoyzDS1oMLFX2jjzhDY3tFAVdsKwsl6GQe2tMwVUiUE8At1ueP7zMErRdD1sQa5fEt-CvPnSYT199v9Aa1WBXdfb9GuJB6GVU9I2bUi6oVI4T7i_ZEoDF_bhedOAUU8jNa2lxngqNJ-YXh-djdZue8tyKunrxwQuUwGzNtHNoeumLGNnsGZCr0xn7Kz6h4JLkHPG1QvYh3izy5JrA"
          />
        </div>
      </div>
    </header>
  );
}
