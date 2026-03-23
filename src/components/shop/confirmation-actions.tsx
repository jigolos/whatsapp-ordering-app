"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmationActions({
  whatsappUrl,
  shopSlug,
}: {
  whatsappUrl: string;
  shopSlug: string;
}) {
  const attemptedRef = useRef(false);
  const [status, setStatus] = useState("Trying to open WhatsApp...");

  useEffect(() => {
    if (attemptedRef.current) {
      return;
    }

    attemptedRef.current = true;
    const timer = window.setTimeout(() => {
      setStatus("If WhatsApp did not open, use the button below.");
      window.location.replace(whatsappUrl);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [whatsappUrl]);

  return (
    <div className="space-y-4">
      <p>{status}</p>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <a href={whatsappUrl}>
            Open WhatsApp
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href={`/s/${shopSlug}`}>Back to shop</a>
        </Button>
      </div>
      <p className="break-all text-xs text-[var(--muted-foreground)]">{whatsappUrl}</p>
    </div>
  );
}
