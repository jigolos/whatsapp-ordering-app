import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { toPlain } from "@/lib/serialize";

export async function GET() {
  await requireRole(["platform_admin"]);
  const subscriptions = await prisma.subscription.findMany({
    include: { shop: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(toPlain(subscriptions));
}
