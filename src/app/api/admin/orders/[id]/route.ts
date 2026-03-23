import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { toPlain } from "@/lib/serialize";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole(["shop_owner", "shop_staff"]);
  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, shopId: session.user.shopId! },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(toPlain(order));
}
