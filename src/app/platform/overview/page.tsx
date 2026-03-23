import { prisma } from "@/lib/prisma";
import { MetricCard } from "@/components/admin/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PlatformOverviewPage() {
  const [shopCount, orderCount, userCount, subscriptions] = await Promise.all([
    prisma.shop.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.subscription.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { shop: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Active shops" value={String(shopCount)} />
        <MetricCard title="Orders stored" value={String(orderCount)} />
        <MetricCard title="Users" value={String(userCount)} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent subscriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="flex items-center justify-between rounded-2xl border p-4">
              <div>
                <p className="font-medium">{subscription.shop.name}</p>
                <p className="text-sm text-[var(--muted-foreground)]">{subscription.planName}</p>
              </div>
              <p className="text-sm font-semibold capitalize">{subscription.status}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
