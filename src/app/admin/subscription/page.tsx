import { requireRole } from "@/lib/auth/session";
import { getAdminShop } from "@/lib/data/shops";
import { formatMoney } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SubscriptionPage() {
  const session = await requireRole(["shop_owner", "shop_staff"]);
  const shop = await getAdminShop(session.user.shopId!);
  const current = shop?.subscriptions[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {current ? (
          <>
            <p><strong>Plan:</strong> {current.planName}</p>
            <p><strong>Status:</strong> {current.status}</p>
            <p><strong>Monthly price:</strong> {formatMoney(Number(current.monthlyPrice))}</p>
          </>
        ) : (
          <p>No subscription record yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
