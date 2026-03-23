import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validators/admin";
import { toPlain } from "@/lib/serialize";

export async function GET() {
  const session = await requireRole(["shop_owner", "shop_staff"]);
  const categories = await prisma.category.findMany({
    where: { shopId: session.user.shopId! },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(toPlain(categories));
}

export async function POST(request: Request) {
  try {
    const session = await requireRole(["shop_owner", "shop_staff"]);
    const payload = categorySchema.parse(await request.json());
    const category = await prisma.category.create({
      data: {
        ...payload,
        shopId: session.user.shopId!,
      },
    });
    return NextResponse.json(toPlain(category), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Create failed" }, { status: 400 });
  }
}
