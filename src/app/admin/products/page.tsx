import { requireRole } from "@/lib/auth/session";
import { getAdminShop } from "@/lib/data/shops";
import { ProductManager } from "@/components/admin/product-manager";

export default async function ProductsPage() {
  const session = await requireRole(["shop_owner", "shop_staff"]);
  const shop = await getAdminShop(session.user.shopId!);

  if (!shop) {
    return null;
  }

  return (
    <ProductManager
      categories={shop.categories.map((category) => ({ id: category.id, nameEn: category.nameEn }))}
      products={shop.products.map((product) => ({
        id: product.id,
        categoryId: product.categoryId,
        nameEn: product.nameEn,
        nameAr: product.nameAr,
        descriptionEn: product.descriptionEn,
        descriptionAr: product.descriptionAr,
        price: Number(product.price),
        sortOrder: product.sortOrder,
        isAvailable: product.isAvailable,
        isFeatured: product.isFeatured,
      }))}
    />
  );
}
