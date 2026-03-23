import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { formatDateTime, formatMoney } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusControl } from "@/components/admin/order-status-control";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireRole(["shop_owner", "shop_staff"]);
  const order = await prisma.order.findFirst({
    where: { id, shopId: session.user.shopId! },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{order.orderNumber}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <p><strong>Customer:</strong> {order.customerName}</p>
          <p><strong>Phone:</strong> {order.customerPhone}</p>
          <p><strong>Area:</strong> {order.area}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Created:</strong> {formatDateTime(order.createdAt)}</p>
          <div><strong>Status:</strong> <OrderStatusControl orderId={order.id} status={order.status} /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border p-4">
              <p>{item.quantity} x {item.productNameSnapshot}</p>
              <p>{formatMoney(Number(item.lineTotal))}</p>
            </div>
          ))}
          <div className="border-t pt-4">
            <p className="font-semibold">Total: {formatMoney(Number(order.total))}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
