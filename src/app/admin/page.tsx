import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { getTodayAnalytics } from "@/lib/data/orders";
import { formatDateTime, formatMoney } from "@/lib/format";
import { MetricCard } from "@/components/admin/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const session = await requireRole(["shop_owner", "shop_staff"]);
  const shopId = session.user.shopId;

  if (!shopId) {
    return <div className="rounded-3xl border bg-white p-6">No shop is linked to this account yet.</div>;
  }

  const [analytics, recentOrders] = await Promise.all([
    getTodayAnalytics(shopId),
    prisma.order.findMany({
      where: { shopId },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Orders today" value={String(analytics.ordersToday)} />
        <MetricCard title="Revenue today" value={formatMoney(analytics.revenueToday)} />
        <MetricCard title="Best seller" value={analytics.bestSellingProducts[0]?.name ?? "No orders yet"} />
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent orders</CardTitle>
          <Button asChild variant="outline">
            <Link href="/admin/orders">View all orders</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between rounded-2xl border p-4">
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-sm text-[var(--muted-foreground)]">{order.customerName} • {formatDateTime(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatMoney(Number(order.total))}</p>
                <p className="text-sm capitalize text-[var(--muted-foreground)]">{order.status.replaceAll("_", " ")}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
