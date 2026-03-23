"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

const statuses = ["new", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"] as const;

export function OrderStatusControl({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      className="h-10 rounded-xl border bg-white/80 px-3 text-sm capitalize"
      defaultValue={status}
      disabled={pending}
      onChange={(event) =>
        startTransition(async () => {
          await fetch(`/api/admin/orders/${orderId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: event.target.value }),
          });
          router.refresh();
        })
      }
    >
      {statuses.map((item) => (
        <option key={item} value={item}>
          {item.replaceAll("_", " ")}
        </option>
      ))}
    </select>
  );
}
