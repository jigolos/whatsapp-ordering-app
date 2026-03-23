import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { toPlain } from "@/lib/serialize";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole(["platform_admin"]);
  const { id } = await params;
  const payload = await request.json();
  const shop = await prisma.shop.update({ where: { id }, data: payload });
  return NextResponse.json(toPlain(shop));
}
