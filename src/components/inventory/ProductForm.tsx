"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Saving..." : label}
    </Button>
  );
}

interface ProductFormProps {
  action: (state: any, formData: FormData) => Promise<any>;
  initialData?: any;
  onSuccess?: () => void;
}

const initialState = {
  message: null,
  errors: {},
  success: false,
};

export function ProductForm({ action, initialData, onSuccess }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  // Close dialog on success
  useEffect(() => {
    if (state.success && onSuccess) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" defaultValue={initialData?.sku} required />
          {state.errors?.sku && (
            <p className="text-sm text-red-500">{state.errors.sku[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="barcode">Barcode</Label>
          <Input id="barcode" name="barcode" defaultValue={initialData?.barcode} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" name="name" defaultValue={initialData?.name} required />
        {state.errors?.name && (
          <p className="text-sm text-red-500">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" defaultValue={initialData?.category} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" name="price" type="number" step="0.01" defaultValue={initialData?.price} required />
          {state.errors?.price && (
            <p className="text-sm text-red-500">{state.errors.price[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="costPrice">Cost Price ($)</Label>
          <Input id="costPrice" name="costPrice" type="number" step="0.01" defaultValue={initialData?.costPrice} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Current Stock</Label>
          <Input id="stock" name="stock" type="number" defaultValue={initialData?.stock ?? 0} required />
          {state.errors?.stock && (
            <p className="text-sm text-red-500">{state.errors.stock[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="minStock">Min Stock Level</Label>
          <Input id="minStock" name="minStock" type="number" defaultValue={initialData?.minStock ?? 0} required />
        </div>
      </div>

      {state.message && !state.success && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {state.message}
        </div>
      )}

      <SubmitButton label={initialData ? "Update Product" : "Add Product"} />
    </form>
  );
}
