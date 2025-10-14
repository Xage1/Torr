import { z } from "../config/openapi.js";
import { uuidSchema } from "./commonSchemas";
export const OrderItemSchema = z.object({
    productId: uuidSchema,
    quantity: z.number().int().positive(),
});
export const OrderSchema = z.object({
    id: uuidSchema,
    userId: uuidSchema,
    items: z.array(OrderItemSchema),
    totalAmount: z.number().positive(),
    status: z.enum(["PENDING", "CONFIRMED", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]),
    createdAt: z.string().datetime({ offset: true }),
});
export const CreateOrderSchema = OrderSchema.omit({ id: true, createdAt: true });
export const UpdateOrderSchema = OrderSchema.partial();
export default {
    OrderSchema,
    OrderItemSchema,
    CreateOrderSchema,
    UpdateOrderSchema,
};
//# sourceMappingURL=orderSchemas.js.map