import { requireRole } from "@/lib/auth/session";
import { getAdminShop } from "@/lib/data/shops";
import { CategoryManager } from "@/components/admin/category-manager";

export default async function CategoriesPage() {
  const session = await requireRole(["shop_owner", "shop_staff"]);
  const shop = await getAdminShop(session.user.shopId!);

  if (!shop) {
    return null;
  }

  return <CategoryManager categories={shop.categories} />;
}
