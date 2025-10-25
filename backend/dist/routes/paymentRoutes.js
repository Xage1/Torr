import { Router } from "express";
import { registry } from "../docs/registry.js";
import { createPayment, refundPayment, getUserPayments, } from "../controllers/paymentController.js";
export const paymentRouter = Router();
// ✅ Swagger: Create payment
registry.registerPath({
    method: "post",
    path: "/payments",
    summary: "Create payment",
    requestBody: {
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/CreatePaymentSchema" },
            },
        },
    },
    responses: { 201: { description: "Payment created" } },
});
paymentRouter.post("/", createPayment);
// ✅ Swagger: Refund
registry.registerPath({
    method: "post",
    path: "/payments/refund",
    summary: "Refund a payment",
    requestBody: {
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/RefundPaymentSchema" },
            },
        },
    },
    responses: { 200: { description: "Payment refunded" } },
});
paymentRouter.post("/refund", refundPayment);
// ✅ Swagger: Get all
registry.registerPath({
    method: "get",
    path: "/payments",
    summary: "Get all payments (admin)",
    responses: { 200: { description: "List of payments" } },
});
paymentRouter.get("/", getUserPayments);
//# sourceMappingURL=paymentRoutes.js.map