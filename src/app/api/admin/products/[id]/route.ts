import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators/admin";
import { toPlain } from "@/lib/serialize";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole(["shop_owner", "shop_staff"]);
    const { id } = await params;
    const payload = productSchema.parse(await request.json());
    const existing = await prisma.product.findFirst({
      where: { id, shopId: session.user.shopId! },
    });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...payload,
        imageUrl: payload.imageUrl || null,
        sku: payload.sku || null,
      },
    });
    return NextResponse.json(toPlain(product));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole(["shop_owner", "shop_staff"]);
  const { id } = await params;
  const existing = await prisma.product.findFirst({
    where: { id, shopId: session.user.shopId! },
  });
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
