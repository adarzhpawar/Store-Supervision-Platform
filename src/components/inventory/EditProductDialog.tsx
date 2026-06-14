"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProductForm } from "./ProductForm";
import { updateProduct } from "@/actions/inventory";

interface EditProductDialogProps {
  product: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProductDialog({ product, open, onOpenChange }: EditProductDialogProps) {
  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details and save changes.
          </DialogDescription>
        </DialogHeader>
        <ProductForm action={updateProductWithId} initialData={product} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
