import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar />
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
        {children}
      </div>
    </>
  );
}
