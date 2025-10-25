import prisma from "../config/prisma.js";
export const createPayment = async (req, res) => {
    try {
        const auth = req;
        if (!auth.user?.id)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const { orderId, amount, method } = req.body;
        const orderIdNum = Number(orderId);
        if (!orderIdNum)
            return res.status(400).json({ success: false, message: "Invalid order id" });
        const order = await prisma.order.findUnique({ where: { id: orderIdNum } });
        if (!order)
            return res.status(404).json({ success: false, message: "Order not found" });
        const payment = await prisma.payment.create({
            data: {
                orderId: orderIdNum,
                method,
                amount,
                status: "PENDING",
            },
        });
        return res.status(201).json({ success: true, data: payment });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err?.message || "Failed to create payment" });
    }
};
export const getUserPayments = async (req, res) => {
    const auth = req;
    if (!auth.user?.id)
        return res.status(401).json({ success: false, message: "Unauthorized" });
    const payments = await prisma.payment.findMany({ where: { /* userId field not in prisma model; filter by order.userId if needed */}, include: { order: true } });
    // Note: your Prisma Payment model doesn't have userId; if needed extend schema. For now return all payments for admin or payments by orders for this user:
    const userPayments = await prisma.payment.findMany({
        where: { order: { userId: auth.user.id } },
        include: { order: true },
    });
    return res.json({ success: true, data: userPayments });
};
export const refundPayment = async (req, res) => {
    try {
        const auth = req;
        if (!auth.user?.id)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const { paymentId, reason } = req.body;
        const pid = Number(paymentId);
        if (!pid)
            return res.status(400).json({ success: false, message: "Invalid payment id" });
        const payment = await prisma.payment.findUnique({ where: { id: pid }, include: { order: true } });
        if (!payment)
            return res.status(404).json({ success: false, message: "Payment not found" });
        // verify ownership (order user)
        if (payment.order.userId !== auth.user.id && auth.user.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }
        // create refund record if you have a refund table - else update status
        await prisma.payment.update({ where: { id: pid }, data: { status: "FAILED" } });
        return res.json({ success: true, message: "Refund flag applied (simulate refund)" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err?.message || "Refund failed" });
    }
};
//# sourceMappingURL=paymentController.js.map