"use client";

import React from "react";

export const themeColors = [
  { id: "red", label: "Scandinavian Red" },
  { id: "blue", label: "Ocean Blue" },
  { id: "emerald", label: "Forest Emerald" },
  { id: "zinc", label: "Minimalist Zinc" },
  { id: "amber", label: "Warm Amber" },
];

const colorMaps: Record<string, { light: Record<string, string>; dark: Record<string, string> }> = {
  red: {
    light: { primary: "#b71422", ring: "#b71422", sidebarPrimary: "#b71422", sidebarPrimaryForeground: "#ffffff", primaryForeground: "#ffffff" },
    dark: { primary: "#ffb3ae", ring: "#ffb3ae", sidebarPrimary: "#ffb3ae", sidebarPrimaryForeground: "#410004", primaryForeground: "#410004" },
  },
  blue: {
    light: { primary: "#2563eb", ring: "#2563eb", sidebarPrimary: "#2563eb", sidebarPrimaryForeground: "#ffffff", primaryForeground: "#ffffff" },
    dark: { primary: "#60a5fa", ring: "#60a5fa", sidebarPrimary: "#60a5fa", sidebarPrimaryForeground: "#000000", primaryForeground: "#000000" },
  },
  emerald: {
    light: { primary: "#059669", ring: "#059669", sidebarPrimary: "#059669", sidebarPrimaryForeground: "#ffffff", primaryForeground: "#ffffff" },
    dark: { primary: "#34d399", ring: "#34d399", sidebarPrimary: "#34d399", sidebarPrimaryForeground: "#000000", primaryForeground: "#000000" },
  },
  zinc: {
    light: { primary: "#18181b", ring: "#18181b", sidebarPrimary: "#18181b", sidebarPrimaryForeground: "#ffffff", primaryForeground: "#ffffff" },
    dark: { primary: "#fafafa", ring: "#fafafa", sidebarPrimary: "#fafafa", sidebarPrimaryForeground: "#000000", primaryForeground: "#000000" },
  },
  amber: {
    light: { primary: "#d97706", ring: "#d97706", sidebarPrimary: "#d97706", sidebarPrimaryForeground: "#ffffff", primaryForeground: "#ffffff" },
    dark: { primary: "#fbbf24", ring: "#fbbf24", sidebarPrimary: "#fbbf24", sidebarPrimaryForeground: "#000000", primaryForeground: "#000000" },
  },
};

export function StoreThemeProvider({ accentColor, children }: { accentColor: string; children: React.ReactNode }) {
  const map = colorMaps[accentColor] || colorMaps.red;

  // We inject a style block to override the root variables globally
  return (
    <>
      <style suppressHydrationWarning dangerouslySetInnerHTML={{
        __html: `
        :root {
          --primary: ${map.light.primary};
          --primary-foreground: ${map.light.primaryForeground};
          --ring: ${map.light.ring};
          --sidebar-primary: ${map.light.sidebarPrimary};
          --sidebar-primary-foreground: ${map.light.sidebarPrimaryForeground};
          --sidebar-ring: ${map.light.sidebarPrimary};
        }
        .dark {
          --primary: ${map.dark.primary};
          --primary-foreground: ${map.dark.primaryForeground};
          --ring: ${map.dark.ring};
          --sidebar-primary: ${map.dark.sidebarPrimary};
          --sidebar-primary-foreground: ${map.dark.sidebarPrimaryForeground};
          --sidebar-ring: ${map.dark.sidebarPrimary};
        }
        `
      }} />
      {children}
    </>
  );
}
