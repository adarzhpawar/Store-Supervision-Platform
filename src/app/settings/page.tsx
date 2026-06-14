import { TopAppBar } from "@/components/TopAppBar";

export default function SettingsPage() {
  return (
    <main className="flex-1 flex flex-col h-full bg-background overflow-y-auto">
      <TopAppBar storeName="Stockholm Flagship" />
      <div className="flex-1 p-container-padding">
        <h1 className="font-display text-display-lg text-on-surface leading-none tracking-tight">
          Settings
        </h1>
        <p className="font-body text-body-lg text-secondary mt-2">
          Configure store preferences, taxes, invoicing, and backups.
        </p>
      </div>
    </main>
  );
}
