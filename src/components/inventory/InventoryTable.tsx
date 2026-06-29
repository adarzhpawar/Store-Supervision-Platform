"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { EditProductDialog } from "./EditProductDialog";
import { DeleteProductDialog } from "./DeleteProductDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categoryColors = [
  "bg-slate-500/10 text-slate-700 border-slate-500/20",
  "bg-gray-500/10 text-gray-700 border-gray-500/20",
  "bg-zinc-500/10 text-zinc-700 border-zinc-500/20",
  "bg-neutral-500/10 text-neutral-700 border-neutral-500/20",
  "bg-stone-500/10 text-stone-700 border-stone-500/20",
  "bg-red-500/10 text-red-700 border-red-500/20",
  "bg-orange-500/10 text-orange-700 border-orange-500/20",
  "bg-amber-500/10 text-amber-700 border-amber-500/20",
  "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  "bg-lime-500/10 text-lime-700 border-lime-500/20",
  "bg-green-500/10 text-green-700 border-green-500/20",
  "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  "bg-teal-500/10 text-teal-700 border-teal-500/20",
  "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
  "bg-sky-500/10 text-sky-700 border-sky-500/20",
  "bg-blue-500/10 text-blue-700 border-blue-500/20",
  "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
  "bg-violet-500/10 text-violet-700 border-violet-500/20",
  "bg-purple-500/10 text-purple-700 border-purple-500/20",
  "bg-fuchsia-500/10 text-fuchsia-700 border-fuchsia-500/20",
  "bg-pink-500/10 text-pink-700 border-pink-500/20",
  "bg-rose-500/10 text-rose-700 border-rose-500/20",
];

function getCategoryColor(category: string) {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % categoryColors.length;
  return categoryColors[index];
}

type ProductType = { id: string; name: string; sku: string; barcode?: string | null; category?: string | null; price: string; costPrice?: string | null; stock: number; minStock: number; importedDate?: string | null; expiryDate?: string | null; };

interface InventoryTableProps {
  products: ProductType[];
}

export function InventoryTable({ products }: InventoryTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean) as string[]);
    return ["All", ...Array.from(cats).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const handleEdit = (product: ProductType) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (product: ProductType) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex items-center gap-3">
        <label htmlFor="category-filter" className="text-sm font-medium text-foreground">
          Category
        </label>
        <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v || '')}>
          <SelectTrigger id="category-filter" className="h-9 w-[180px] bg-surface text-sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full h-32 flex items-center justify-center text-muted-foreground bg-surface rounded-xl border border-border">
            No products found.
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-surface border border-border rounded-xl p-5 hover:border-border-hover transition-colors relative group shadow-sm hover:shadow-md">
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  } />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(product)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(product)} className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mb-5 pr-8">
                <h3 className="font-display text-lg font-medium text-on-surface truncate" title={product.name}>{product.name}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-xs font-mono bg-surface-hover px-2 py-0.5 rounded text-secondary border border-border">{product.sku}</span>
                  {product.category && <span className={`text-xs px-2 py-0.5 rounded border ${getCategoryColor(product.category)}`}>{product.category}</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-background rounded-lg p-3 border border-border">
                  <p className="text-[11px] text-secondary mb-1 uppercase tracking-wider font-semibold">Price</p>
                  <p className="font-medium text-on-surface text-lg">₹{Number(product.price).toFixed(2)}</p>
                </div>
                <div className="bg-background rounded-lg p-3 border border-border">
                  <p className="text-[11px] text-secondary mb-1 uppercase tracking-wider font-semibold">Stock</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-on-surface text-lg">{product.stock}</p>
                    {product.stock <= product.minStock ? (
                      <Badge variant="destructive" className="h-5 text-[10px] px-1.5 font-semibold">Low</Badge>
                    ) : (
                      <Badge variant="outline" className="h-5 text-[10px] px-1.5 text-green-600 border-green-600/30 bg-green-500/10 font-semibold">OK</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-[11px] text-secondary mb-0.5 uppercase tracking-wider font-semibold">Imported</p>
                  <p className="text-sm text-on-surface font-medium">{product.importedDate ? new Date(product.importedDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-secondary mb-0.5 uppercase tracking-wider font-semibold">Expires</p>
                  <p className="text-sm text-on-surface font-medium">{product.expiryDate ? new Date(product.expiryDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}</p>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {selectedProduct && (
        <>
          <EditProductDialog
            product={selectedProduct}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          />
          <DeleteProductDialog
            product={selectedProduct}
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          />
        </>
      )}
    </div>
  );
}
