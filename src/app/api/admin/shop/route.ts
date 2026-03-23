import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { shopSettingsSchema } from "@/lib/validators/admin";
import { toPlain } from "@/lib/serialize";

export async function GET() {
  const session = await requireRole(["shop_owner", "shop_staff"]);
  const shop = await prisma.shop.findUnique({ where: { id: session.user.shopId! } });
  return NextResponse.json(toPlain(shop));
}

export async function PUT(request: Request) {
  try {
    const session = await requireRole(["shop_owner", "shop_staff"]);
    const payload = shopSettingsSchema.parse(await request.json());

    const shop = await prisma.shop.update({
      where: { id: session.user.shopId! },
      data: payload,
    });

    return NextResponse.json(toPlain(shop));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Update failed" }, { status: 400 });
  }
}
