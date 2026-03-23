import { prisma } from "@/lib/prisma";

export async function getPublicShopBySlug(slug: string) {
  return prisma.shop.findFirst({
    where: {
      slug,
      isActive: true,
    },
    include: {
      categories: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
      products: {
        where: { isAvailable: true },
        orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
      },
    },
  });
}

export async function getAdminShop(shopId: string) {
  return prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      categories: {
        orderBy: { sortOrder: "asc" },
      },
      products: {
        include: { category: true },
        orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
      },
      subscriptions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
