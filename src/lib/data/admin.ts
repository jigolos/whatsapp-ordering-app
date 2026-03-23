import { prisma } from "@/lib/prisma";

export async function getShopOwnerContext(userId: string) {
  const shop = await prisma.shop.findFirst({
    where: {
      ownerUserId: userId,
    },
  });

  return shop;
}
