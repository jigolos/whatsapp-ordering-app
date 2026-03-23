import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(50),
  itemNote: z.string().max(200).optional(),
});

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  customerPhone: z.string().trim().min(6).max(40),
  area: z.string().trim().min(2).max(120),
  address: z.string().trim().min(3).max(255),
  fulfillmentType: z.enum(["delivery", "pickup"]),
  customerNote: z.string().trim().max(500).optional().or(z.literal("")),
  items: z.array(cartItemSchema).min(1),
});

export const checkoutFormSchema = createOrderSchema.omit({
  items: true,
});

export const updateStatusSchema = z.object({
  status: z.enum([
    "new",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ]),
});
