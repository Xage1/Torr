import express from "express";
import { registry } from "../docs/registry.js";
import { createPayment, refundPayment, getUserPayments } from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { CreatePaymentSchema, RefundPaymentSchema } from "../schemas/paymentSchemas.js";
const router = express.Router();
router.use(authMiddleware);
registry.registerPath({
    method: "post",
    path: "/payments",
    tags: ["Payments"],
    summary: "Create a new payment",
    requestBody: {
        content: {
            "application/json": {
                schema: registry.register("CreatePaymentSchema", CreatePaymentSchema),
            },
        },
    },
    responses: { 201: { description: "Payment created" } },
});
registry.registerPath({
    method: "get",
    path: "/payments",
    tags: ["Payments"],
    summary: "Get all payments for logged-in user",
    responses: { 200: { description: "List of payments" } },
});
registry.registerPath({
    method: "post",
    path: "/payments/refund",
    tags: ["Payments"],
    summary: "Refund a completed payment",
    requestBody: {
        content: {
            "application/json": {
                schema: registry.register("RefundPaymentSchema", RefundPaymentSchema),
            },
        },
    },
    responses: { 200: { description: "Refund successful" } },
});
router.post("/", createPayment);
router.get("/", getUserPayments);
router.post("/refund", refundPayment);
export default router;
//# sourceMappingURL=paymentRoutes.js.map