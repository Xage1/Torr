import { z } from "../config/openapi.js";

export const ProductSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().optional(),
    price: z.number().nonnegative(),
    inStock: z.boolean(),
    category: z.string(),
});


export const CreateProductSchema = ProductSchema.omit({ id: true });
export const UpdateProductSchema = ProductSchema.partial();

export default {
    ProductSchema,
    CreateProductSchema,
    UpdateProductSchema,
};
