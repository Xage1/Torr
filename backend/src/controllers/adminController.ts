import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const getAllUsers = async (_req: Request, res: Response) => {
    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, isActive: true },
    });
    res.json({ success: true, data: users });
};

export const deactivateUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    const updated = await prisma.user.update({
        where: { id: userId },
        data: { isActive: false },
    });
    res.json({ success: true, data: updated });
};

export const getAllOrders = async (_req: Request, res: Response) => {
    const orders = await prisma.order.findMany({
        include: {
            user: { select: { id: true, email: true } },
            items: true,
        },
    });
    res.json({ success: true, data: orders });
};

export const getAllPayments = async (_req: Request, res: Response) => {
    const payments = await prisma.payment.findMany({
        include: { order: true },
    });
    res.json({ success: true, data: payments });
};

export const systemStats = async (_req: Request, res: Response) => {
    const [userCount, orderCount, paymentCount, activeUsers] = await Promise.all([
        prisma.user.count(),
        prisma.order.count(),
        prisma.payment.count(),
        prisma.user.count({ where: { isActive: true } }),
    ]);

    res.json({
        success: true,
        data: { userCount, orderCount, paymentCount, activeUsers },
    });
};