import { Router } from "express";
import { z } from "../config/openapi.js";
import { getAllUsers, deactivateUser, getAllOrders, getAllPayments, systemStats, } from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { registry } from "../docs/registry.js";
// Initialize router
const router = Router();
/* ===========================
   📘 Swagger + Zod Schemas
=========================== */
// ---- Base Models ----
const UserSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    role: z.string(),
    active: z.boolean().optional(),
});
const OrderSchema = z.object({
    id: z.number(),
    userId: z.number(),
    total: z.number(),
    status: z.string(),
});
const PaymentSchema = z.object({
    id: z.number(),
    orderId: z.number(),
    amount: z.number(),
    method: z.string(),
    status: z.string(),
});
// ---- Routes ----
registry.registerPath({
    method: "get",
    path: "/api/admin/users",
    tags: ["Admin"],
    summary: "Get all users (Admin only)",
    security: [{ bearerAuth: [] }],
    responses: {
        200: {
            description: "List of users",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean(),
                        data: z.array(UserSchema),
                    }),
                },
            },
        },
    },
});
registry.registerPath({
    method: "patch",
    path: "/api/admin/users/{userId}/deactivate",
    tags: ["Admin"],
    summary: "Deactivate a user account",
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({
            userId: z.string(),
        }),
    },
    responses: {
        200: {
            description: "User deactivated",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean(),
                        data: UserSchema,
                    }),
                },
            },
        },
    },
});
registry.registerPath({
    method: "get",
    path: "/api/admin/orders",
    tags: ["Admin"],
    summary: "Retrieve all orders",
    security: [{ bearerAuth: [] }],
    responses: {
        200: {
            description: "List of orders",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean(),
                        data: z.array(OrderSchema),
                    }),
                },
            },
        },
    },
});
registry.registerPath({
    method: "get",
    path: "/api/admin/payments",
    tags: ["Admin"],
    summary: "Retrieve all payments",
    security: [{ bearerAuth: [] }],
    responses: {
        200: {
            description: "List of payments",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean(),
                        data: z.array(PaymentSchema),
                    }),
                },
            },
        },
    },
});
registry.registerPath({
    method: "get",
    path: "/api/admin/stats",
    tags: ["Admin"],
    summary: "Retrieve system statistics",
    security: [{ bearerAuth: [] }],
    responses: {
        200: {
            description: "System metrics",
            content: {
                "application/json": {
                    schema: z.object({
                        success: z.boolean(),
                        data: z.object({
                            userCount: z.number(),
                            orderCount: z.number(),
                            paymentCount: z.number(),
                        }),
                    }),
                },
            },
        },
    },
});
/* ===========================
   🚀 Express Routes
=========================== */
// All admin routes require auth
router.use(authMiddleware);
// User management
router.get("/users", getAllUsers);
router.patch("/users/:userId/deactivate", deactivateUser);
// Orders & Payments
router.get("/orders", getAllOrders);
router.get("/payments", getAllPayments);
// Dashboard stats
router.get("/stats", systemStats);
export default router;
//# sourceMappingURL=adminRoutes.js.map