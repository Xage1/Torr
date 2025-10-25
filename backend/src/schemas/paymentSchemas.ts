// src/schemas/paymentSchemas.ts
import { z } from "../config/openapi.js";

export const PaymentSchema = z.object({
    id: z.number().int(),
    orderId: z.number().int(),
    amount: z.number().nonnegative(),
    method: z.enum(["CREDIT_CARD", "PAYPAL", "MPESA", "BANK_TRANSFER"]),
    status: z.enum(["PENDING", "SUCCESS", "FAILED"]),
    transactionId: z.string().nullable().optional(),
    createdAt: z.string().datetime().optional(),
}).openapi("Payment");

export const CreatePaymentSchema = z.object({
    orderId: z.number().int(),
    amount: z.number().nonnegative(),
    method: z.enum(["CREDIT_CARD", "PAYPAL", "MPESA", "BANK_TRANSFER"]),
}).openapi("CreatePayment");

export const RefundPaymentSchema = z.object({
    paymentId: z.number().int(),
    reason: z.string().min(5),
}).openapi("RefundPayment");

export default { PaymentSchema, CreatePaymentSchema, RefundPaymentSchema };