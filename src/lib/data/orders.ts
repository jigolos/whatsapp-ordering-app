import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { APP_NAME } from "@/lib/constants";
import { createOrderSchema } from "@/lib/validators/order";

function decimalToNumber(value: Prisma.Decimal | number) {
  return Number(value);
}

function sanitizeWhatsappNumber(raw: string) {
  return raw.replace(/[^\d]/g, "");
}

function padSequence(sequence: number) {
  return sequence.toString().padStart(4, "0");
}

async function nextOrderNumber(shopId: string, shopName: string) {
  const today = new Date();
  const stamp = today.toISOString().slice(0, 10).replaceAll("-", "");
  const prefix = shopName.replace(/[^A-Za-z0-9]/g, "").slice(0, 6).toUpperCase() || "SHOP";
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const count = await prisma.order.count({
    where: {
      shopId,
      createdAt: {
        gte: startOfDay,
      },
    },
  });

  return `${prefix}-${stamp}-${padSequence(count + 1)}`;
}

export function buildWhatsappMessage(args: {
  shopName: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  area: string;
  address: string;
  fulfillmentType: "delivery" | "pickup";
  items: Array<{ name: string; quantity: number; lineTotal: number }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  customerNote?: string | null;
  currencyCode: string;
}) {
  const note = args.customerNote?.trim() ? args.customerNote.trim() : "None";
  const itemsText = args.items
    .map((item) => `- ${item.quantity} x ${item.name} = ${item.lineTotal.toFixed(2)} ${args.currencyCode}`)
    .join("\n");

  return [
    "New Order",
    "",
    `Shop: ${args.shopName}`,
    `Order No: ${args.orderNumber}`,
    "",
    "Customer:",
    `- Name: ${args.customerName}`,
    `- Phone: ${args.customerPhone}`,
    `- Area: ${args.area}`,
    `- Address: ${args.address}`,
    `- Fulfillment: ${args.fulfillmentType}`,
    "",
    "Items:",
    itemsText,
    "",
    `Subtotal: ${args.subtotal.toFixed(2)} ${args.currencyCode}`,
    `Delivery Fee: ${args.deliveryFee.toFixed(2)} ${args.currencyCode}`,
    `Total: ${args.total.toFixed(2)} ${args.currencyCode}`,
    "",
    "Note:",
    note,
    "",
    `Sent from ${APP_NAME}`,
  ].join("\n");
}

export function buildWaLink(phoneNumber: string, message: string) {
  const sanitized = sanitizeWhatsappNumber(phoneNumber);
  return `https://api.whatsapp.com/send?phone=${sanitized}&text=${encodeURIComponent(message)}`;
}

export async function createOrderForShop(slug: string, input: unknown) {
  const payload = createOrderSchema.parse(input);
  const shop = await prisma.shop.findFirst({
    where: {
      slug,
      isActive: true,
    },
    include: {
      products: true,
    },
  });

  if (!shop) {
    throw new Error("Shop not found");
  }

  const productMap = new Map(shop.products.map((product) => [product.id, product]));
  const deliverySettings = JSON.parse(shop.deliverySettingsJson || "{}") as { fee?: number };
  const deliveryFee = payload.fulfillmentType === "delivery" ? Number(deliverySettings.fee ?? 0) : 0;

  const items = payload.items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product || !product.isAvailable) {
      throw new Error("One or more selected products are unavailable");
    }

    const unitPrice = decimalToNumber(product.price);
    return {
      product,
      quantity: item.quantity,
      itemNote: item.itemNote,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const total = subtotal + deliveryFee;
  const orderNumber = await nextOrderNumber(shop.id, shop.name);
  const whatsappMessage = buildWhatsappMessage({
    shopName: shop.name,
    orderNumber,
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    area: payload.area,
    address: payload.address,
    fulfillmentType: payload.fulfillmentType,
    items: items.map((item) => ({
      name: shop.defaultLanguage === "ar" ? item.product.nameAr : item.product.nameEn,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    })),
    subtotal,
    deliveryFee,
    total,
    customerNote: payload.customerNote,
    currencyCode: shop.currencyCode,
  });

  const order = await prisma.order.create({
    data: {
      shopId: shop.id,
      orderNumber,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      area: payload.area,
      address: payload.address,
      fulfillmentType: payload.fulfillmentType,
      subtotal,
      deliveryFee,
      total,
      customerNote: payload.customerNote || null,
      whatsappMessage,
      items: {
        create: items.map((item) => ({
          productId: item.product.id,
          productNameSnapshot: shop.defaultLanguage === "ar" ? item.product.nameAr : item.product.nameEn,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
          itemNote: item.itemNote || null,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  return {
    order,
    whatsappUrl: buildWaLink(shop.whatsappNumber, whatsappMessage),
    shop,
  };
}

export async function getTodayAnalytics(shopId: string) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: {
      shopId,
      createdAt: {
        gte: startOfDay,
      },
    },
    include: { items: true },
  });

  const revenue = orders.reduce((sum, order) => sum + decimalToNumber(order.total), 0);
  const bestSellers = new Map<string, number>();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      bestSellers.set(
        item.productNameSnapshot,
        (bestSellers.get(item.productNameSnapshot) ?? 0) + item.quantity,
      );
    });
  });

  return {
    ordersToday: orders.length,
    revenueToday: revenue,
    bestSellingProducts: [...bestSellers.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity })),
  };
}
