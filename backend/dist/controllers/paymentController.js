import prisma from "../config/prisma.js";
import { CreatePaymentSchema } from "../schemas/paymentSchemas.js";
export const initiatePayment = async (req, res) => {
    try {
        const validated = CreatePaymentSchema.parse(req.body);
        const payment = await prisma.payment.create({
            data: {
                orderId: validated.orderId,
                userId: req.user.id,
                amount: validated.amount,
                status: "PENDING",
                provider: validated.provider,
            },
        });
        // Simulate external payment gateway call here...
        res.status(201).json({ success: true, data: payment });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
export const verifyPayment = async (req, res) => {
    const { paymentId } = req.body;
    const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: { status: "SUCCESS" },
    });
    res.json({ success: true, data: payment });
};
export const getPaymentHistory = async (req, res) => {
    const payments = await prisma.payment.findMany({
        where: { userId: req.user.id },
    });
    res.json({ success: true, data: payments });
};
//# sourceMappingURL=paymentController.js.map