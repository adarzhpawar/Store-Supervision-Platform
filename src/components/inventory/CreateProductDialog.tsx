"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductForm } from "./ProductForm";
import { createProduct } from "@/actions/inventory";
import { Plus } from "lucide-react";

export function CreateProductDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" />
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Enter the details of the new product here.
          </DialogDescription>
        </DialogHeader>
        <ProductForm action={createProduct} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
