import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PlatformSubscriptionsPage() {
  const subscriptions = await prisma.subscription.findMany({
    include: { shop: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All subscriptions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {subscriptions.map((subscription) => (
          <div key={subscription.id} className="grid gap-2 rounded-2xl border p-4 md:grid-cols-4">
            <p className="font-medium">{subscription.shop.name}</p>
            <p>{subscription.planName}</p>
            <p className="capitalize">{subscription.status}</p>
            <p>{formatMoney(Number(subscription.monthlyPrice))}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
