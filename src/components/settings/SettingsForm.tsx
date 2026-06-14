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
};

export default function SettingsForm({ initialData }: { initialData: SettingsData }) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      storeName: formData.get("storeName") as string,
      storeAddress: formData.get("storeAddress") as string,
      storePhone: formData.get("storePhone") as string,
      taxRate: formData.get("taxRate") as string,
      invoicePrefix: formData.get("invoicePrefix") as string,
    };

    startTransition(async () => {
      await updateSettings(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
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

      <div className="pt-4 border-t border-border flex items-center justify-end gap-4">
        {success && <span className="text-sm text-green-600">Settings saved successfully.</span>}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
