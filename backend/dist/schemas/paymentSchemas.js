import { z } from "../config/openapi.js";
import { uuidSchema } from "./commonSchemas";
export const PaymentSchema = z.object({
    id: uuidSchema,
    orderId: uuidSchema,
    amount: z.number().positive(),
    status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
    method: z.enum(["CREDIT_CARD", "PAYPAL", "MPESA", "BANK_TRANSFER"]),
    createdAt: z.string().datetime(),
});
export const CreatePaymentSchema = PaymentSchema.omit({ id: true, createdAt: true });
export default {
    PaymentSchema,
    CreatePaymentSchema,
};
//# sourceMappingURL=paymentSchemas.js.map