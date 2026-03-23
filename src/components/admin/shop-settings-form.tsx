"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ShopSettings = {
  name: string;
  description: string;
  whatsappNumber: string;
  phoneNumber: string;
  address: string;
  city: string;
  currencyCode: string;
  defaultLanguage: "en" | "ar";
  openingHoursJson: string;
  deliverySettingsJson: string;
};

export function ShopSettingsForm({ shop }: { shop: ShopSettings }) {
  const router = useRouter();
  const [draft, setDraft] = useState(shop);

  async function save() {
    await fetch("/api/admin/shop", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop settings</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        <Input value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} />
        <Input value={draft.whatsappNumber} onChange={(e) => setDraft({ ...draft, whatsappNumber: e.target.value })} />
        <Input value={draft.phoneNumber} onChange={(e) => setDraft({ ...draft, phoneNumber: e.target.value })} />
        <Input value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
        <Input value={draft.currencyCode} onChange={(e) => setDraft({ ...draft, currencyCode: e.target.value })} />
        <select className="h-10 rounded-xl border bg-white/80 px-3 text-sm" value={draft.defaultLanguage} onChange={(e) => setDraft({ ...draft, defaultLanguage: e.target.value as "en" | "ar" })}>
          <option value="en">English</option>
          <option value="ar">Arabic</option>
        </select>
        <Input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
        <Textarea value={draft.openingHoursJson} onChange={(e) => setDraft({ ...draft, openingHoursJson: e.target.value })} />
        <Textarea value={draft.deliverySettingsJson} onChange={(e) => setDraft({ ...draft, deliverySettingsJson: e.target.value })} />
        <Button type="button" onClick={save}>Save settings</Button>
      </CardContent>
    </Card>
  );
}
