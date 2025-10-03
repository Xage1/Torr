import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  price: z.union([z.string(), z.number()]).transform((v) => Number(v)).refine((v) => !Number.isNaN(v) && v >= 0, {
    message: "price must be a non-negative number"
  }),
  stock: z.number().int().nonnegative().optional().default(0),
  category: z.string().optional(),
  source: z.string().optional(),
  externalId: z.string().optional(),
  imageUrls: z.array(z.string().url()).optional().default([])
});

export const updateProductSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.union([z.string(), z.number()]).transform((v) => Number(v)).optional().refine((v) => !Number.isNaN(v) && v >= 0, {
    message: "price must be a non-negative number"
  }),
  stock: z.number().int().nonnegative().optional(),
  category: z.string().optional(),
  source: z.string().optional(),
  externalId: z.string().optional(),
  imageUrls: z.array(z.string().url()).optional()
});

export const listProductsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.union([z.string(), z.number()]).optional().transform((v) => (v ?? null) === null ? null : Number(v)),
  maxPrice: z.union([z.string(), z.number()]).optional().transform((v) => (v ?? null) === null ? null : Number(v)),
  sortBy: z.enum(["createdAt", "price", "title"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.union([z.string(), z.number()]).optional().transform((v) => Number(v) || 1),
  limit: z.union([z.string(), z.number()]).optional().transform((v) => Number(v) || 20)
});
