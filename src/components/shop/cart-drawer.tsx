"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatMoney } from "@/lib/format";

export function CartDrawer({ currencyCode }: { currencyCode: string }) {
  const { items, shopSlug, updateQuantity, removeItem } = useCart();
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="fixed bottom-4 left-1/2 z-40 h-12 -translate-x-1/2 rounded-full px-5 shadow-xl sm:right-4 sm:left-auto sm:translate-x-0">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Cart ({totalCount})
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your cart</DialogTitle>
          <DialogDescription>Review items before moving to checkout.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {items.length ? (
            items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between gap-3 rounded-xl border p-3">
                <div className="space-y-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {formatMoney(item.price, currencyCode)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <Button variant="outline" size="sm" type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" type="button" onClick={() => removeItem(item.productId)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-xl border border-dashed p-6 text-center text-sm text-[var(--muted-foreground)]">
              Your cart is empty.
            </p>
          )}
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal, currencyCode)}</span>
          </div>
          <Button asChild className="w-full" disabled={!items.length || !shopSlug}>
            <Link href={`/checkout?shop=${shopSlug}`}>Go to checkout</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
