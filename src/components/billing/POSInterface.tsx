"use client";

import { useState, useActionState, useEffect } from "react";
import { createBill } from "@/actions/billing";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Minus, Trash2, Receipt, FileText } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "./InvoicePDF";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

type Product = {
  id: string;
  sku: string;
  name: string;
  price: string;
  stock: number;
};

type CartItem = Product & {
  quantity: number;
};

const initialState = {
  success: false,
  message: "",
};

export function POSInterface({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [discount, setDiscount] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [notes, setNotes] = useState("");

  const [state, formAction, pending] = useActionState(createBill, initialState);
  const [showReceipt, setShowReceipt] = useState(false);

  // Filter products based on search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  // Cart operations
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev; // Prevent adding more than stock
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      if (product.stock <= 0) return prev;
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQ = item.quantity + delta;
          if (newQ > item.stock || newQ < 1) return item;
          return { ...item, quantity: newQ };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );
  const total = subtotal + tax - discount;

  // Handle successful checkout
  useEffect(() => {
    if (state.success && state.billData) {
      setShowReceipt(true);
      // Reset cart and form
      setCart([]);
      setCustomerName("");
      setDiscount(0);
      setTax(0);
      setNotes("");
    }
  }, [state]);

  const itemsForForm = cart.map((item) => ({
    productId: item.id,
    quantity: item.quantity,
    unitPrice: parseFloat(item.price),
    name: item.name // Added for the pdf payload mapping indirectly
  }));

  return (
    <div className="flex flex-col md:flex-row h-full gap-4">
      {/* Left Pane: Product Catalog */}
      <div className="flex-1 flex flex-col bg-surface rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-surface/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
            <Input
              placeholder="Search products by name or SKU..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 content-start">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className="flex flex-col text-left p-4 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative"
            >
              <div className="font-medium text-on-surface line-clamp-2 mb-1">
                {product.name}
              </div>
              <div className="text-sm text-secondary mb-2">{product.sku}</div>
              <div className="mt-auto flex items-center justify-between w-full">
                <span className="font-bold text-primary">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                  {product.stock} in stock
                </Badge>
              </div>
            </button>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-10 text-center text-secondary">
              No products found matching "{search}"
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Cart & Checkout */}
      <div className="w-full md:w-[400px] lg:w-[450px] flex flex-col bg-surface rounded-xl border border-border overflow-hidden shrink-0">
        <div className="p-4 border-b border-border font-medium text-lg flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          Current Bill
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-secondary text-sm">
              <Receipt className="w-12 h-12 mb-2 opacity-20" />
              Cart is empty
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-background">
                <div className="flex-1">
                  <div className="font-medium text-sm line-clamp-1">{item.name}</div>
                  <div className="text-sm text-primary font-bold">
                    ${parseFloat(item.price).toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-surface rounded-md border border-border">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 hover:text-primary transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 hover:text-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="font-bold text-sm w-16 text-right">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Checkout Form */}
        <form action={formAction} className="border-t border-border p-4 bg-background space-y-4">
          <input type="hidden" name="items" value={JSON.stringify(itemsForForm)} />
          <input type="hidden" name="subtotal" value={subtotal} />
          <input type="hidden" name="total" value={total > 0 ? total : 0} />
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="customerName" className="text-xs">Customer Name (Optional)</Label>
              <Input
                id="customerName"
                name="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="paymentMethod" className="text-xs">Payment Method</Label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="discount" className="text-xs">Discount ($)</Label>
              <Input
                id="discount"
                name="discount"
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tax" className="text-xs">Tax ($)</Label>
              <Input
                id="tax"
                name="tax"
                type="number"
                min="0"
                step="0.01"
                value={tax}
                onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            {tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">${Math.max(0, total).toFixed(2)}</span>
            </div>
          </div>

          {state.message && !state.success && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {state.message}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full font-bold text-base h-12"
            disabled={cart.length === 0 || pending}
          >
            {pending ? "Processing..." : `Charge $${Math.max(0, total).toFixed(2)}`}
          </Button>
        </form>
      </div>

      {/* Success Receipt Modal */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Transaction Complete
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <Receipt className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-xl text-center">
              Invoice {state.invoiceNumber}
            </h3>
            <p className="text-center text-secondary">
              The bill has been successfully created and inventory has been updated.
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            {state.billData && (
              <PDFDownloadLink
                document={<InvoicePDF data={state.billData} />}
                fileName={`${state.invoiceNumber}.pdf`}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium transition-colors"
              >
                {({ loading }) =>
                  loading ? "Preparing PDF..." : "Download PDF Receipt"
                }
              </PDFDownloadLink>
            )}
            <DialogClose render={<Button variant="outline" className="w-full" />}>
              New Transaction
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
