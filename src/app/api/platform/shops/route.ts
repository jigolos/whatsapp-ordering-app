import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { toPlain } from "@/lib/serialize";

export async function GET() {
  await requireRole(["platform_admin"]);
  const shops = await prisma.shop.findMany({
    include: { owner: true, subscriptions: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(toPlain(shops));
}

export async function POST(request: Request) {
  await requireRole(["platform_admin"]);
  const payload = await request.json();
  const shop = await prisma.shop.create({ data: payload });
  return NextResponse.json(toPlain(shop), { status: 201 });
}
