import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { formatDateTime, formatMoney } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusControl } from "@/components/admin/order-status-control";

export default async function OrdersPage() {
  const session = await requireRole(["shop_owner", "shop_staff"]);
  const orders = await prisma.order.findMany({
    where: { shopId: session.user.shopId! },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="grid gap-3 rounded-2xl border p-4 md:grid-cols-[1.4fr,0.8fr,0.7fr,160px] md:items-center">
            <div>
              <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">{order.orderNumber}</Link>
              <p className="text-sm text-[var(--muted-foreground)]">{order.customerName} • {order.customerPhone}</p>
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">{formatDateTime(order.createdAt)}</p>
            <p className="font-semibold">{formatMoney(Number(order.total))}</p>
            <OrderStatusControl orderId={order.id} status={order.status} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
