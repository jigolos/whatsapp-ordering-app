import { requireRole } from "@/lib/auth/session";
import { getTodayAnalytics } from "@/lib/data/orders";
import { formatMoney } from "@/lib/format";
import { MetricCard } from "@/components/admin/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AnalyticsPage() {
  const session = await requireRole(["shop_owner", "shop_staff"]);
  const analytics = await getTodayAnalytics(session.user.shopId!);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Orders today" value={String(analytics.ordersToday)} />
        <MetricCard title="Revenue today" value={formatMoney(analytics.revenueToday)} />
        <MetricCard title="Top products" value={String(analytics.bestSellingProducts.length)} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Best-selling products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {analytics.bestSellingProducts.map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-2xl border p-4">
              <p>{item.name}</p>
              <p className="font-semibold">{item.quantity} sold</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
