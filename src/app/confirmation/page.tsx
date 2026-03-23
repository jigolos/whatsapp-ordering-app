import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationActions } from "@/components/shop/confirmation-actions";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; shop?: string; wa?: string }>;
}) {
  const { order, shop, wa } = await searchParams;
  if (!order || !shop || !wa) {
    redirect("/");
  }

  const whatsappUrl = decodeURIComponent(wa);

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Order saved</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Your order <strong>{order}</strong> was stored successfully.</p>
          <ConfirmationActions whatsappUrl={whatsappUrl} shopSlug={shop} />
        </CardContent>
      </Card>
    </div>
  );
}
