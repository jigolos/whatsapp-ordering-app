import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { toPlain } from "@/lib/serialize";

export async function GET() {
  const session = await requireRole(["shop_owner", "shop_staff"]);
  const orders = await prisma.order.findMany({
    where: { shopId: session.user.shopId! },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(toPlain(orders));
}
