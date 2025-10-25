import express from "express";
import { registry } from "../docs/registry.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createOrder, getAllOrders, deleteOrder } from "../controllers/orderController.js";
import { CreateOrderSchema } from "../schemas/orderSchemas.js";

const router = express.Router();
router.use(authMiddleware);

registry.registerPath({
    method: "post",
    path: "/orders",
    tags: ["Orders"],
    summary: "Create a new order",
    requestBody: {
        content: {
            "application/json": {
                schema: registry.register("CreateOrderSchema", CreateOrderSchema),
            },
        },
    },
    responses: { 201: { description: "Order created" } },
});

registry.registerPath({
    method: "get",
    path: "/orders",
    tags: ["Orders"],
    summary: "Get all user orders",
    responses: { 200: { description: "List of orders" } },
});

registry.registerPath({
    method: "post",
    path: "/orders/{id}/cancel",
    tags: ["Orders"],
    summary: "Cancel an order",
    responses: { 200: { description: "Order cancelled" } },
});

router.post("/", createOrder);
router.get("/", getAllOrders);
router.post("/:id/cancel", deleteOrder);

export default router;