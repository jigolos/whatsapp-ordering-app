"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import type { z } from "zod";
import { checkoutFormSchema } from "@/lib/validators/order";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";

type FormValues = z.infer<typeof checkoutFormSchema>;

export function CheckoutForm({
  shopSlug,
  currencyCode,
  deliveryFee,
}: {
  shopSlug: string;
  currencyCode: string;
  deliveryFee: number;
}) {
  const router = useRouter();
  const { items, clear } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      area: "",
      address: "",
      fulfillmentType: "delivery",
      customerNote: "",
    },
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const fulfillmentType = form.watch("fulfillmentType");
  const total = subtotal + (fulfillmentType === "delivery" ? deliveryFee : 0);

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/public/shop/${shopSlug}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            itemNote: item.itemNote,
          })),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to create order");
      }

      clear();
      let navigatedAway = false;
      const markNavigated = () => {
        navigatedAway = true;
      };

      window.addEventListener("pagehide", markNavigated, { once: true });
      document.addEventListener("visibilitychange", markNavigated, { once: true });
      window.location.assign(payload.whatsappUrl);

      setTimeout(() => {
        if (!navigatedAway) {
          router.push(`/confirmation?order=${payload.orderNumber}&shop=${shopSlug}&wa=${encodeURIComponent(payload.whatsappUrl)}`);
        }
      }, 1500);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-6 lg:grid-cols-[1fr,360px]" onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="customerName">Customer name</Label>
            <Input id="customerName" {...form.register("customerName")} />
            {form.formState.errors.customerName ? (
              <p className="text-sm text-red-700">{form.formState.errors.customerName.message}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="customerPhone">Phone</Label>
            <Input id="customerPhone" {...form.register("customerPhone")} />
            {form.formState.errors.customerPhone ? (
              <p className="text-sm text-red-700">{form.formState.errors.customerPhone.message}</p>
            ) : null}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="area">Area</Label>
              <Input id="area" {...form.register("area")} />
              {form.formState.errors.area ? (
                <p className="text-sm text-red-700">{form.formState.errors.area.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...form.register("address")} />
              {form.formState.errors.address ? (
                <p className="text-sm text-red-700">{form.formState.errors.address.message}</p>
              ) : null}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Fulfillment</Label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 rounded-xl border bg-white/70 px-4 py-3 text-sm">
                <input type="radio" value="delivery" {...form.register("fulfillmentType")} />
                Delivery
              </label>
              <label className="flex items-center gap-2 rounded-xl border bg-white/70 px-4 py-3 text-sm">
                <input type="radio" value="pickup" {...form.register("fulfillmentType")} />
                Pickup
              </label>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="customerNote">Order note</Label>
            <Textarea id="customerNote" {...form.register("customerNote")} />
            {form.formState.errors.customerNote ? (
              <p className="text-sm text-red-700">{form.formState.errors.customerNote.message}</p>
            ) : null}
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </CardContent>
      </Card>
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Order summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between text-sm">
              <span>
                {item.quantity} x {item.name}
              </span>
              <span>{formatMoney(item.price * item.quantity, currencyCode)}</span>
            </div>
          ))}
          <div className="border-t pt-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal, currencyCode)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery fee</span>
              <span>{formatMoney(fulfillmentType === "delivery" ? deliveryFee : 0, currencyCode)}</span>
            </div>
            <div className="mt-2 flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatMoney(total, currencyCode)}</span>
            </div>
          </div>
          <Button className="w-full" type="submit" disabled={isSubmitting || !items.length}>
            {isSubmitting ? "Placing order..." : "Place order on WhatsApp"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
