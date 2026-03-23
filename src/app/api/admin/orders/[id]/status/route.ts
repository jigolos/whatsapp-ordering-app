import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { updateStatusSchema } from "@/lib/validators/order";
import { toPlain } from "@/lib/serialize";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole(["shop_owner", "shop_staff"]);
    const { id } = await params;
    const { status } = updateStatusSchema.parse(await request.json());
    const existing = await prisma.order.findFirst({
      where: { id, shopId: session.user.shopId! },
    });
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    await prisma.auditLog.create({
      data: {
        shopId: session.user.shopId ?? null,
        userId: session.user.id,
        action: "order.status.updated",
        entityType: "Order",
        entityId: id,
        metadataJson: JSON.stringify({ status }),
      },
    });

    return NextResponse.json(toPlain(order));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Status update failed" }, { status: 400 });
  }
}
