import express from "express";
import {
    createPayment,
    refundPayment,
    getUserPayments,
} from "../controllers/paymentController.js";
import { registry } from "../config/openapi.js";
import {
    CreatePaymentSchema,
    RefundPaymentSchema,
} from "../schemas/paymentSchemas.js";

const router = express.Router();

registry.registerPath({
    method: "get",
    path: "/payments",
    summary: "Get all payments",
    responses: { 200: { description: "List of payments" } },
});

registry.registerPath({
    method: "post",
    path: "/payments",
    summary: "Create new payment",
    requestBody: {
        content: {
            "application/json": {
                schema: { $ref: registry.register("CreatePaymentSchema", CreatePaymentSchema) },
            },
        },
    },
    responses: { 201: { description: "Payment created" } },
});

registry.registerPath({
    method: "post",
    path: "/payments/refund",
    summary: "Refund a payment",
    requestBody: {
        content: {
            "application/json": {
                schema: { $ref: registry.register("RefundPaymentSchema", RefundPaymentSchema) },
            },
        },
    },
    responses: { 200: { description: "Payment refunded" } },
});

router.get("/", getUserPayments);
router.post("/", createPayment);
router.post("/refund", refundPayment);

export default router;