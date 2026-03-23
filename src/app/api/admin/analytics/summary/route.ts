import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { getTodayAnalytics } from "@/lib/data/orders";

export async function GET() {
  const session = await requireRole(["shop_owner", "shop_staff"]);
  const analytics = await getTodayAnalytics(session.user.shopId!);
  return NextResponse.json(analytics);
}
