import { Router } from "express";
import { registry } from "../docs/registry.js";
import { CreateOrderSchema } from "../schemas/orderSchemas.js";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

export const orderRouter = Router();

// ✅ Swagger: Create order
registry.registerPath({
  method: "post",
  path: "/orders",
  summary: "Create a new order",
  requestBody: {
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/CreateOrderSchema" },
      },
    },
  },
  responses: { 201: { description: "Order created" } },
});
orderRouter.post("/", createOrder);

// ✅ Swagger: Get all orders
registry.registerPath({
  method: "get",
  path: "/orders",
  summary: "Get user orders",
  responses: { 200: { description: "List of orders" } },
});
orderRouter.get("/", getAllOrders);

// ✅ Swagger: Get single order
registry.registerPath({
  method: "get",
  path: "/orders/{orderId}",
  summary: "Get order by ID",
  parameters: [{ name: "orderId", in: "path", required: true, schema: { type: "integer" } }],
  responses: { 200: { description: "Order details" } },
});
orderRouter.get("/:orderId", getOrderById);

// ✅ Swagger: Update order
registry.registerPath({
  method: "put",
  path: "/orders/{orderId}",
  summary: "Update order status",
  parameters: [{ name: "orderId", in: "path", required: true, schema: { type: "integer" } }],
  responses: { 200: { description: "Order updated" } },
});
orderRouter.put("/:orderId", updateOrderStatus);

// ✅ Swagger: Delete order
registry.registerPath({
  method: "delete",
  path: "/orders/{orderId}",
  summary: "Delete order",
  parameters: [{ name: "orderId", in: "path", required: true, schema: { type: "integer" } }],
  responses: { 200: { description: "Order deleted" } },
});
orderRouter.delete("/:orderId", deleteOrder);

export default orderRouter;