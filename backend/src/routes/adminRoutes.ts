// src/routes/adminRoutes.ts
import express from "express";
import { getAllUsers, deactivateUser, getAllOrders, getAllPayments, systemStats } from "../controllers/adminController.js";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";
import { registry } from "../docs/registry.js";

const router = express.Router();
router.use(authMiddleware, requireRole("ADMIN"));

registry.registerPath({ method: "get", path: "/admin/users", summary: "Admin - list users", responses: { 200: { description: "OK" } } });
router.get("/users", getAllUsers);

registry.registerPath({ method: "post", path: "/admin/users/:userId/deactivate", summary: "Deactivate user", responses: { 200: { description: "OK" } } });
router.post("/users/:userId/deactivate", deactivateUser);

registry.registerPath({ method: "get", path: "/admin/orders", summary: "Admin - list orders", responses: { 200: { description: "OK" } } });
router.get("/orders", getAllOrders);

registry.registerPath({ method: "get", path: "/admin/payments", summary: "Admin - list payments", responses: { 200: { description: "OK" } } });
router.get("/payments", getAllPayments);

registry.registerPath({ method: "get", path: "/admin/stats", summary: "System stats", responses: { 200: { description: "OK" } } });
router.get("/stats", systemStats);

export default router;