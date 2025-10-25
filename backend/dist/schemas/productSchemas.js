// src/schemas/productSchemas.ts
import { z } from "../config/openapi.js";
export const ProductSchema = z.object({
    id: z.number().int(),
    title: z.string(),
    description: z.string().nullable().optional(),
    price: z.number().nonnegative(),
    stock: z.number().int().nonnegative(),
    category: z.string().nullable().optional(),
    imageUrls: z.array(z.string().url()).optional(),
    source: z.string().optional(),
    externalId: z.string().optional(),
    createdAt: z.string().datetime().optional(),
}).openapi("Product");
export const CreateProductSchema = ProductSchema.omit({ id: true, createdAt: true }).openapi("CreateProduct");
export const UpdateProductSchema = ProductSchema.partial().openapi("UpdateProduct");
export default { ProductSchema, CreateProductSchema, UpdateProductSchema };
//# sourceMappingURL=productSchemas.js.map