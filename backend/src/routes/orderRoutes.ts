import express from "express";
import {
    createOrder,
    getAllOrders,
    getOrderById,
} from "../controllers/orderController.js";
import { registry } from "../config";
import { CreateOrderSchema } from "../schemas/orderSchemas.js";

const router = express.Router();

registry.registerPath({
    method: "get",
    path: "/orders",
    summary: "Get all orders",
    responses: { 200: { description: "List of orders" } },
});

registry.registerPath({
    method: "get",
    path: "/orders/{id}",
    summary: "Get order by ID",
    responses: { 200: { description: "Order details" } },
});

registry.registerPath({
    method: "post",
    path: "/orders",
    summary: "Create new order",
    requestBody: {
        content: {
            "application/json": {
                schema: { $ref: registry.register("CreateOrderSchema", CreateOrderSchema) },
            },
        },
    },
    responses: { 201: { description: "Order created" } },
});

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);

export default router;