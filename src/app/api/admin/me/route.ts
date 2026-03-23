import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";

export async function GET() {
  const session = await requireRole(["shop_owner", "shop_staff", "platform_admin"]);
  return NextResponse.json(session.user);
}
