"use client";

import { useState, useTransition } from "react";
import { updateSettings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SettingsData = {
  id: string;
  storeName: string;
  storeAddress: string | null;
  storePhone: string | null;
  taxRate: string;
  invoicePrefix: string;
  accentColor: string;
};

export default function SettingsForm({ initialData }: { initialData: SettingsData }) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccess(false);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      storeName: formData.get("storeName") as string,
      storeAddress: formData.get("storeAddress") as string,
      storePhone: formData.get("storePhone") as string,
      taxRate: formData.get("taxRate") as string,
      invoicePrefix: formData.get("invoicePrefix") as string,
      accentColor: formData.get("accentColor") as string,
    };

    startTransition(async () => {
      const res = await updateSettings(data);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div className="space-y-4">
        <h2 className="text-xl font-display font-medium">General Settings</h2>
        
        <div className="space-y-2">
          <Label htmlFor="storeName">Store Name</Label>
          <Input 
            id="storeName" 
            name="storeName" 
            defaultValue={initialData.storeName} 
            required 
            placeholder="e.g. Stockholm Flagship"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="storePhone">Contact Phone</Label>
          <Input 
            id="storePhone" 
            name="storePhone" 
            defaultValue={initialData.storePhone || ""} 
            pattern="^\+?[1-9]\d{1,14}$"
            title="Please provide a valid phone number (e.g., +1234567890)"
            placeholder="e.g. +46 123 456 789"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="storeAddress">Store Address</Label>
          <Input 
            id="storeAddress" 
            name="storeAddress" 
            defaultValue={initialData.storeAddress || ""} 
            placeholder="e.g. Drottninggatan 1, Stockholm"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <h2 className="text-xl font-display font-medium">Billing Settings</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
            <Input 
              id="taxRate" 
              name="taxRate" 
              type="number"
              step="0.01"
              defaultValue={initialData.taxRate} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
            <Input 
              id="invoicePrefix" 
              name="invoicePrefix" 
              defaultValue={initialData.invoicePrefix} 
              required 
              placeholder="e.g. INV-"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <h2 className="text-xl font-display font-medium">Appearance</h2>
        
        <div className="space-y-3">
          <Label>Accent Color</Label>
          <div className="flex items-center gap-4">
            {[
              { id: "red", bg: "bg-[#b71422] dark:bg-[#ffb3ae]", label: "Red" },
              { id: "blue", bg: "bg-[#2563eb] dark:bg-[#60a5fa]", label: "Blue" },
              { id: "emerald", bg: "bg-[#059669] dark:bg-[#34d399]", label: "Emerald" },
              { id: "zinc", bg: "bg-[#18181b] dark:bg-[#fafafa]", label: "Zinc" },
              { id: "amber", bg: "bg-[#d97706] dark:bg-[#fbbf24]", label: "Amber" },
            ].map((color) => (
              <label key={color.id} className="relative flex flex-col items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="accentColor" 
                  value={color.id} 
                  defaultChecked={initialData.accentColor === color.id}
                  className="peer sr-only"
                />
                <div className={`w-8 h-8 rounded-full ${color.bg} outline outline-1 outline-border outline-offset-2 peer-checked:outline-2 peer-checked:outline-ring transition-all group-hover:scale-110`}></div>
                <span className="text-[10px] uppercase font-mono text-secondary tracking-widest">{color.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-end gap-4">
        {error && <span className="text-sm text-red-600">{error}</span>}
        {success && <span className="text-sm text-green-600">Settings saved successfully.</span>}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
