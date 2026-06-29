import { TopAppBar } from "@/components/TopAppBar";
import { requireAuth } from "@/lib/auth";
import SettingsForm from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const { store } = await requireAuth();

  const settings = {
    id: store.id,
    storeName: store.name,
    storeAddress: store.address,
    storePhone: store.phone,
    taxRate: store.taxRate,
    invoicePrefix: store.invoicePrefix,
    accentColor: store.accentColor,
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-background overflow-y-auto">
      <TopAppBar storeName={settings.storeName} />
      <div className="flex-1 p-container-padding max-w-4xl">
        <h1 className="font-display text-display-lg text-on-surface leading-none tracking-tight mb-2">
          Settings
        </h1>
        <p className="font-body text-body-lg text-secondary mb-8">
          Configure store preferences, taxes, and invoicing.
        </p>

        <SettingsForm initialData={settings} />
      </div>
    </main>
  );
}
