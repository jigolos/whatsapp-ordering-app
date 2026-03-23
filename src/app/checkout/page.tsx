import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/shop/checkout-form";
import { Card, CardContent } from "@/components/ui/card";
import { getPublicShopBySlug } from "@/lib/data/shops";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ shop?: string }>;
}) {
  const { shop: slug } = await searchParams;

  if (!slug) {
    redirect("/");
  }

  const shop = await getPublicShopBySlug(slug);
  if (!shop) {
    redirect("/");
  }

  const deliverySettings = JSON.parse(shop.deliverySettingsJson || "{}") as { fee?: number };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Checkout</h1>
        <p className="text-[var(--muted-foreground)]">Confirm the details for {shop.name} before opening WhatsApp.</p>
      </div>
      <CheckoutForm
        shopSlug={shop.slug}
        currencyCode={shop.currencyCode}
        deliveryFee={Number(deliverySettings.fee ?? 0)}
      />
      <Card className="mt-6">
        <CardContent className="p-6 text-sm text-[var(--muted-foreground)]">
          Orders are saved first, then redirected to a prefilled WhatsApp chat using the shop&apos;s configured number.
        </CardContent>
      </Card>
    </div>
  );
}
