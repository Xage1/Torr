// src/schemas/orderSchemas.ts
import { z } from "../config/openapi.js";

export const OrderItemSchema = z.object({
  productId: z.number().int(),
  quantity: z.number().int().positive(),
}).openapi("OrderItem");

export const OrderSchema = z.object({
  id: z.number().int(),
  userId: z.number().int().nullable(),
  items: z.array(OrderItemSchema),
  total: z.number().nonnegative(),
  status: z.enum(["PENDING", "PAID", "SHIPPED", "CANCELLED"]),
  createdAt: z.string().datetime().optional(),
}).openapi("Order");

export const CreateOrderSchema = OrderSchema.omit({ id: true, createdAt: true }).openapi("CreateOrder");
export const UpdateOrderSchema = z.object({ status: z.enum(["PENDING", "PAID", "SHIPPED", "CANCELLED"]).optional() }).openapi("UpdateOrder");

export default { OrderSchema, CreateOrderSchema, UpdateOrderSchema, OrderItemSchema };