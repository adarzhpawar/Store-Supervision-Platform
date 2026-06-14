import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "StoreSync - Premium Store Management",
  description: "A premium store management system built with Scandinavian Minimalist design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="antialiased min-h-screen flex text-on-surface bg-background">
        <Sidebar />
        <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
