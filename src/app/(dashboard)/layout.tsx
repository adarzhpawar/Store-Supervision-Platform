import { Sidebar } from "@/components/Sidebar";
import { requireAuth } from "@/lib/auth";
import { StoreThemeProvider } from "@/components/StoreThemeProvider";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { store } = await requireAuth();

  return (
    <StoreThemeProvider accentColor={store.accentColor}>
      <Sidebar />
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
        {children}
      </div>
    </StoreThemeProvider>
  );
}
