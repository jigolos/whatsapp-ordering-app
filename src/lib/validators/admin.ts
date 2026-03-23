import { z } from "zod";

export const categorySchema = z.object({
  nameEn: z.string().trim().min(2).max(80),
  nameAr: z.string().trim().min(2).max(80),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const productSchema = z.object({
  categoryId: z.string().min(1),
  nameEn: z.string().trim().min(2).max(120),
  nameAr: z.string().trim().min(2).max(120),
  descriptionEn: z.string().trim().min(2).max(280),
  descriptionAr: z.string().trim().min(2).max(280),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).nullable().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  sku: z.string().max(80).optional().or(z.literal("")),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});

export const shopSettingsSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(2).max(280),
  whatsappNumber: z.string().trim().min(6).max(40),
  phoneNumber: z.string().trim().min(6).max(40),
  address: z.string().trim().min(3).max(255),
  city: z.string().trim().min(2).max(80),
  currencyCode: z.string().trim().min(3).max(6),
  defaultLanguage: z.enum(["en", "ar"]),
  openingHoursJson: z.string().min(2),
  deliverySettingsJson: z.string().min(2),
});
