import { NextResponse } from "next/server";
import { getPublicShopBySlug } from "@/lib/data/shops";
import { toPlain } from "@/lib/serialize";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shop = await getPublicShopBySlug(slug);

  if (!shop) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  return NextResponse.json(toPlain(shop));
}
