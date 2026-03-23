import Link from "next/link";
import { LayoutDashboard, Package, Shapes, ShoppingBag, Settings, ChartColumn, CreditCard, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const shopLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Shapes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/analytics", label: "Analytics", icon: ChartColumn },
  { href: "/admin/subscription", label: "Subscription", icon: CreditCard },
];

const platformLinks = [
  { href: "/platform/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/platform/shops", label: "Shops", icon: Building2 },
  { href: "/platform/subscriptions", label: "Subscriptions", icon: CreditCard },
];

export function AdminShell({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "platform_admin" | "shop_owner" | "shop_staff";
}) {
  const links = role === "platform_admin" ? platformLinks : shopLinks;

  return (
    <div className="min-h-screen bg-[#f8f4ea]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px,1fr]">
        <aside className="rounded-3xl border bg-white/80 p-4 shadow-sm">
          <div className="mb-6 space-y-1 px-2">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-foreground)]">Admin</p>
            <h2 className="text-xl font-bold">Control center</h2>
          </div>
          <nav className="space-y-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-[var(--accent)]">
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 px-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Back to site</Link>
            </Button>
          </div>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
