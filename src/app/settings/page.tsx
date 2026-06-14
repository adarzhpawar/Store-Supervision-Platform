import { TopAppBar } from "@/components/TopAppBar";
import { getSettings } from "@/actions/settings";
import SettingsForm from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const settings = await getSettings();

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
