import { SiteHeader } from "@/components/marketing/site-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PricingPage() {
  return (
    <div>
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-8 max-w-2xl space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Simple pricing for local Lebanese shops</h1>
          <p className="text-[var(--muted-foreground)]">Start with a low-friction setup fee and a lightweight monthly subscription.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Launch package</CardTitle>
              <CardDescription>For shops getting online for the first time.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-4xl font-black">$35</p>
              <p className="text-sm text-[var(--muted-foreground)]">One-time setup including catalog upload and WhatsApp message formatting.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Monthly subscription</CardTitle>
              <CardDescription>Manage products, orders, and store settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-4xl font-black">$15/mo</p>
              <p className="text-sm text-[var(--muted-foreground)]">Includes multi-language storefront, owner dashboard, and support for cash delivery or pickup.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
