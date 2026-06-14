"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CircleDollarSign, Users, Package, Settings } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Revenue", href: "/revenue", icon: CircleDollarSign },
  { label: "Workers", href: "/workers", icon: Users },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function SidebarContent() {
  const pathname = usePathname();

  return (
    <>
      {/* Brand Header */}
      <div className="px-4 mb-8 pt-4 md:pt-0">
        <h1 className="font-headline text-headline-md font-semibold text-on-surface tracking-tight uppercase">
          StoreSync
        </h1>
        <p className="font-mono text-label-mono text-secondary mt-1">
          Premium Management
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-body text-body-md flex items-center gap-3 transition-colors duration-200 px-4 py-3 rounded-lg hover:bg-surface-container-low",
                isActive
                  ? "text-on-surface font-bold relative after:content-[''] after:absolute after:-right-2 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full"
                  : "text-secondary hover:text-on-surface"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* CTA Bottom Button */}
      <div className="mt-auto px-4 pb-4 md:pb-0">
        <Link href="/billing" className="w-full block">
          <button className="w-full coral-action font-mono text-label-mono uppercase tracking-widest text-center cursor-pointer">
            Create New Bill
          </button>
        </Link>
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <nav className="bg-surface w-72 h-screen flex-col border-r border-outline/10 fixed left-0 top-0 py-margin-md px-margin-sm gap-base z-20 flex-shrink-0 hidden md:flex">
      <SidebarContent />
    </nav>
  );
}
