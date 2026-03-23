export const APP_NAME = "WhatsApp Ordering System";
export const DEFAULT_LOCALE = "en";
export const LOCALES = ["en", "ar"] as const;
export const ORDER_STATUSES = [
  "new",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;

export const USER_ROLES = ["platform_admin", "shop_owner", "shop_staff"] as const;
