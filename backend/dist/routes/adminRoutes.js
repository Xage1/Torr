import { Router } from "express";
import { registry } from "../docs/registry.js";
import { getAllUsers, deactivateUser, getAllOrders, getAllPayments, systemStats, } from "../controllers/adminController.js";
export const adminRouter = Router();
// ✅ Get users
registry.registerPath({
    method: "get",
    path: "/admin/users",
    summary: "List all users (admin)",
    responses: { 200: { description: "Users retrieved" } },
});
adminRouter.get("/users", getAllUsers);
// ✅ Deactivate user
registry.registerPath({
    method: "put",
    path: "/admin/users/{userId}/deactivate",
    summary: "Deactivate a user (admin)",
    parameters: [{ name: "userId", in: "path", required: true, schema: { type: "integer" } }],
    responses: { 200: { description: "User deactivated" } },
});
adminRouter.put("/users/:userId/deactivate", deactivateUser);
// ✅ Get orders
registry.registerPath({
    method: "get",
    path: "/admin/orders",
    summary: "List all orders (admin)",
    responses: { 200: { description: "Orders retrieved" } },
});
adminRouter.get("/orders", getAllOrders);
// ✅ Get payments
registry.registerPath({
    method: "get",
    path: "/admin/payments",
    summary: "List all payments (admin)",
    responses: { 200: { description: "Payments retrieved" } },
});
adminRouter.get("/payments", getAllPayments);
// ✅ System stats
registry.registerPath({
    method: "get",
    path: "/admin/stats",
    summary: "Get system statistics (admin)",
    responses: { 200: { description: "Stats returned" } },
});
adminRouter.get("/stats", systemStats);
//# sourceMappingURL=adminRoutes.js.map