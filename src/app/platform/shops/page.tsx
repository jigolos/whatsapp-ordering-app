import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PlatformShopsPage() {
  const shops = await prisma.shop.findMany({
    include: { owner: true, subscriptions: { take: 1, orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All shops</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {shops.map((shop) => (
          <div key={shop.id} className="grid gap-2 rounded-2xl border p-4 md:grid-cols-4">
            <div>
              <p className="font-medium">{shop.name}</p>
              <p className="text-sm text-[var(--muted-foreground)]">/{shop.slug}</p>
            </div>
            <p>{shop.owner.email}</p>
            <p className="capitalize">{shop.isActive ? "active" : "suspended"}</p>
            <p className="capitalize">{shop.subscriptions[0]?.status ?? "no subscription"}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
