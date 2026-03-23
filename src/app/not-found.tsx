import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted-foreground)]">404</p>
        <h1 className="text-4xl font-black tracking-tight">Page not found</h1>
        <p className="text-[var(--muted-foreground)]">The shop or dashboard page you requested could not be found.</p>
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
