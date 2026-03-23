"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { formatMoney } from "@/lib/format";

type Product = {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl?: string | null;
  price: number;
  isFeatured: boolean;
  categoryId: string;
};

type Category = {
  id: string;
  nameEn: string;
  nameAr: string;
};

export function ProductGrid({
  shopSlug,
  locale,
  currencyCode,
  categories,
  products,
}: {
  shopSlug: string;
  locale: "en" | "ar";
  currencyCode: string;
  categories: Category[];
  products: Product[];
}) {
  const addItem = useCart((state) => state.addItem);

  return (
    <div className="space-y-8">
      {categories.map((category) => {
        const categoryProducts = products.filter((product) => product.categoryId === category.id);
        if (!categoryProducts.length) {
          return null;
        }

        return (
          <section key={category.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {locale === "ar" ? category.nameAr : category.nameEn}
              </h2>
              <span className="text-sm text-[var(--muted-foreground)]">{categoryProducts.length} items</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {categoryProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">
                          {locale === "ar" ? product.nameAr : product.nameEn}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                          {locale === "ar" ? product.descriptionAr : product.descriptionEn}
                        </p>
                      </div>
                      {product.isFeatured ? <Badge>Featured</Badge> : null}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">{formatMoney(product.price, currencyCode)}</span>
                      <Button
                        size="sm"
                        onClick={() =>
                          addItem(shopSlug, {
                            productId: product.id,
                            name: locale === "ar" ? product.nameAr : product.nameEn,
                            price: product.price,
                            imageUrl: product.imageUrl,
                          })
                        }
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
