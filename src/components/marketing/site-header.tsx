import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="border-b bg-white/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm text-[var(--muted-foreground)]">
            Pricing
          </Link>
          <Link href="/s/beirut-bakery" className="text-sm text-[var(--muted-foreground)]">
            Demo shop
          </Link>
          <Button asChild size="sm">
            <Link href="/auth/login">Admin login</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
