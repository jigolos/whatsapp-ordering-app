import { notFound } from "next/navigation";
import { MapPin, Phone, Clock3 } from "lucide-react";
import { getDirection, resolveLocale } from "@/lib/locales";
import { getPublicShopBySlug } from "@/lib/data/shops";
import { ProductGrid } from "@/components/shop/product-grid";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { Badge } from "@/components/ui/badge";

export default async function StorefrontPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const shop = await getPublicShopBySlug(slug);

  if (!shop) {
    notFound();
  }

  const locale = resolveLocale(lang ?? shop.defaultLanguage);
  const dir = getDirection(locale);
  const openingHours = JSON.parse(shop.openingHoursJson || "[]") as Array<{ day: string; hours: string }>;

  return (
    <div dir={dir} className="pb-24">
      <section className="relative overflow-hidden border-b bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{shop.city}</Badge>
              <Badge className="bg-white text-slate-700">/{shop.slug}</Badge>
            </div>
            <h1 className="text-4xl font-black tracking-tight">{shop.name}</h1>
            <p className="max-w-2xl text-[var(--muted-foreground)]">{shop.description}</p>
            <div className="grid gap-3 text-sm text-[var(--muted-foreground)] sm:grid-cols-3">
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {shop.phoneNumber}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {shop.address}</p>
              <p className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> {openingHours[0]?.hours ?? "Daily"}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8">
        <ProductGrid
          shopSlug={shop.slug}
          locale={locale}
          currencyCode={shop.currencyCode}
          categories={shop.categories}
          products={shop.products.map((product) => ({
            ...product,
            price: Number(product.price),
          }))}
        />
      </section>
      <CartDrawer currencyCode={shop.currencyCode} />
    </div>
  );
}
