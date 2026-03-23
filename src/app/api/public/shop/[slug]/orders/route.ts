import { NextResponse } from "next/server";
import { createOrderForShop } from "@/lib/data/orders";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { order, whatsappUrl } = await createOrderForShop(slug, body);

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      whatsappUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create order" },
      { status: 400 },
    );
  }
}
