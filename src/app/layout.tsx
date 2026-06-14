import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased min-h-screen flex flex-col text-on-surface bg-background">
        {children}
      </body>
    </html>
  );
}
