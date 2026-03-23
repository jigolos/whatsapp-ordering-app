import Link from "next/link";
import { ArrowRight, Store, MessageCircleMore, ChartColumn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  {
    title: "WhatsApp checkout",
    body: "Capture clean order details, then open the exact wa.me link the shop needs.",
    icon: MessageCircleMore,
  },
  {
    title: "Built for small shops",
    body: "Menus, prices, delivery fee, and simple status tracking without online payments.",
    icon: Store,
  },
  {
    title: "Owner dashboard",
    body: "See today's orders, revenue, and best sellers from one lightweight admin area.",
    icon: ChartColumn,
  },
];

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[1.2fr,0.8fr] lg:py-24">
      <div className="space-y-6">
        <span className="inline-flex rounded-full border bg-white/70 px-3 py-1 text-sm font-medium">
          WhatsApp-first ordering for Lebanese SMBs
        </span>
        <div className="space-y-4">
          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Turn scattered chats into structured orders your team can actually track.
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            Catalogs, cart, bilingual checkout, shop dashboard, and clean WhatsApp deep links in one mobile-first SaaS app.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/s/beirut-bakery">
              Open demo shop
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/pricing">See pricing</Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4">
        {highlights.map((item) => (
          <Card key={item.title} className="border-white/80 bg-white/80">
            <CardContent className="flex gap-4 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)]">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{item.body}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
