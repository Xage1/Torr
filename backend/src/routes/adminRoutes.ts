import express from "express";
import {
    getAllUsers,
    deactivateUser,
    getAllOrders,
    getAllPayments,
    systemStats,
} from "../controllers/adminController.js";
import { registry } from "../docs/registry.js";
import { z } from "../config/openapi.js"

const router = express.Router();

registry.registerPath({
    method: "get",
    path: "/admin/users",
    summary: "Get all users (Admin only)",
    responses: { 200: { description: "List of all users" } },
});

registry.registerPath({
    method: "patch",
    path: "/admin/users/{userId}/deactivate",
    summary: "Deactivate a user (Admin only)",
    responses: { 200: { description: "User deactivated" } },
});

registry.registerPath({
    method: "get",
    path: "/admin/orders",
    summary: "Get all orders (Admin only)",
    responses: { 200: { description: "List of all orders" } },
});

registry.registerPath({
    method: "get",
    path: "/admin/payments",
    summary: "Get all payments (Admin only)",
    responses: { 200: { description: "List of all payments" } },
});

registry.registerPath({
    method: "get",
    path: "/admin/stats",
    summary: "System statistics (Admin only)",
    responses: { 200: { description: "System stats summary" } },
});

router.get("/users", getAllUsers);
router.patch("/users/:userId/deactivate", deactivateUser);
router.get("/orders", getAllOrders);
router.get("/payments", getAllPayments);
router.get("/stats", systemStats);

export default router;