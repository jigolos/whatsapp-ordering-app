import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators/admin";
import { toPlain } from "@/lib/serialize";

export async function GET() {
  const session = await requireRole(["shop_owner", "shop_staff"]);
  const products = await prisma.product.findMany({
    where: { shopId: session.user.shopId! },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(toPlain(products));
}

export async function POST(request: Request) {
  try {
    const session = await requireRole(["shop_owner", "shop_staff"]);
    const payload = productSchema.parse(await request.json());
    const product = await prisma.product.create({
      data: {
        ...payload,
        shopId: session.user.shopId!,
        imageUrl: payload.imageUrl || null,
        sku: payload.sku || null,
      },
    });
    return NextResponse.json(toPlain(product), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Create failed" }, { status: 400 });
  }
}
