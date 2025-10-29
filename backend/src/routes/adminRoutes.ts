// src/routes/adminRoutes.ts
import express, { Router, RequestHandler } from "express";
import path from "path";
import { registry } from "../docs/registry.js";
import {
  getAllUsers,
  deactivateUser,
  getAllOrders,
  getAllPayments,
  systemStats,
  importProducts,
} from "../controllers/adminController.js";
import {
  authMiddleware,
  requireRole,
  AuthRequest,
} from "../middleware/authMiddleware.js";

const adminRouter = Router();

// ─────────────────────────────────────────────
// 🧩 Type-safe middleware casting
// ─────────────────────────────────────────────
const auth: RequestHandler = authMiddleware as unknown as RequestHandler;
const adminOnly: RequestHandler = requireRole("ADMIN") as unknown as RequestHandler;

// ─────────────────────────────────────────────
// 📦 IMPORT PRODUCTS
// ─────────────────────────────────────────────
registry.registerPath({
  method: "post",
  path: "/admin/import-products",
  tags: ["Admin"],
  summary: "Import products from scraper output (ads.json + images/)",
  responses: {
    200: { description: "Import summary returned" },
    401: { description: "Unauthorized" },
    403: { description: "Forbidden" },
  },
});
adminRouter.post("/import-products", auth, adminOnly, importProducts);

// ─────────────────────────────────────────────
// 👥 USERS
// ─────────────────────────────────────────────
registry.registerPath({
  method: "get",
  path: "/admin/users",
  summary: "List all users (admin)",
  responses: { 200: { description: "Users retrieved" } },
});
adminRouter.get("/users", auth, adminOnly, getAllUsers);

registry.registerPath({
  method: "put",
  path: "/admin/users/{userId}/deactivate",
  summary: "Deactivate a user (admin)",
  parameters: [
    { name: "userId", in: "path", required: true, schema: { type: "integer" } },
  ],
  responses: { 200: { description: "User deactivated" } },
});
adminRouter.put("/users/:userId/deactivate", auth, adminOnly, deactivateUser);

// ─────────────────────────────────────────────
// 💸 ORDERS & PAYMENTS
// ─────────────────────────────────────────────
registry.registerPath({
  method: "get",
  path: "/admin/orders",
  summary: "List all orders (admin)",
  responses: { 200: { description: "Orders retrieved" } },
});
adminRouter.get("/orders", auth, adminOnly, getAllOrders);

registry.registerPath({
  method: "get",
  path: "/admin/payments",
  summary: "List all payments (admin)",
  responses: { 200: { description: "Payments retrieved" } },
});
adminRouter.get("/payments", auth, adminOnly, getAllPayments);

// ─────────────────────────────────────────────
// 📊 SYSTEM STATS
// ─────────────────────────────────────────────
registry.registerPath({
  method: "get",
  path: "/admin/stats",
  summary: "Get system statistics (admin)",
  responses: { 200: { description: "Stats returned" } },
});
adminRouter.get("/stats", auth, adminOnly, systemStats);

export default adminRouter;