import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { CreatePaymentSchema } from "../schemas/paymentSchemas.js";

export const createPayment = async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

        const validated = CreatePaymentSchema.parse(req.body);
        const payment = await prisma.payment.create({
            data: {
                orderId: parseInt(validated.orderId.toString(), 10),
                userId: req.user.id,
                amount: validated.amount,
                method: validated.method,
                status: "PENDING",
            },
        });

        res.status(201).json({ success: true, data: payment });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const getUserPayments = async (req: Request, res: Response) => {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const payments = await prisma.payment.findMany({
        where: { userId: req.user.id },
    });
    res.json({ success: true, data: payments });
};