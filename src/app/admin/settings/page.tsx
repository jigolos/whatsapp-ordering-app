import { requireRole } from "@/lib/auth/session";
import { getAdminShop } from "@/lib/data/shops";
import { ShopSettingsForm } from "@/components/admin/shop-settings-form";

export default async function SettingsPage() {
  const session = await requireRole(["shop_owner", "shop_staff"]);
  const shop = await getAdminShop(session.user.shopId!);
  if (!shop) return null;

  return (
    <ShopSettingsForm
      shop={{
        name: shop.name,
        description: shop.description,
        whatsappNumber: shop.whatsappNumber,
        phoneNumber: shop.phoneNumber,
        address: shop.address,
        city: shop.city,
        currencyCode: shop.currencyCode,
        defaultLanguage: shop.defaultLanguage as "en" | "ar",
        openingHoursJson: shop.openingHoursJson,
        deliverySettingsJson: shop.deliverySettingsJson,
      }}
    />
  );
}
