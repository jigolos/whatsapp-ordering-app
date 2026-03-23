import { describe, expect, it } from "vitest";
import { buildWaLink, buildWhatsappMessage } from "@/lib/data/orders";

describe("order formatting", () => {
  it("builds a structured WhatsApp message", () => {
    const message = buildWhatsappMessage({
      shopName: "Beirut Bakery",
      orderNumber: "BEIRUT-20260320-0001",
      customerName: "Maya",
      customerPhone: "+96170000000",
      area: "Hamra",
      address: "Main street",
      fulfillmentType: "delivery",
      items: [{ name: "Cheese Man2oushe", quantity: 2, lineTotal: 4 }],
      subtotal: 4,
      deliveryFee: 1.5,
      total: 5.5,
      customerNote: "Please call on arrival",
      currencyCode: "USD",
    });

    expect(message).toContain("New Order");
    expect(message).toContain("Order No: BEIRUT-20260320-0001");
    expect(message).toContain("2 x Cheese Man2oushe = 4.00 USD");
    expect(message).toContain("Delivery Fee: 1.50 USD");
  });

  it("encodes the wa.me link safely", () => {
    const link = buildWaLink("+961 70 000 000", "Hello world");
    expect(link).toBe("https://wa.me/96170000000?text=Hello%20world");
  });
});
