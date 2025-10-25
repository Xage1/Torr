// src/controllers/adminController.ts
import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const getAllUsers = async (_req: Request, res: Response) => {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } });
    return res.json({ success: true, data: users });
};

export const deactivateUser = async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    if (!userId) return res.status(400).json({ success: false, message: "Invalid user id" });
    const updated = await prisma.user.update({ where: { id: userId }, data: { role: "CUSTOMER" } });
    return res.json({ success: true, data: updated });
};

export const getAllOrders = async (_req: Request, res: Response) => {
    const orders = await prisma.order.findMany({ include: { OrderItem: true, Payment: true, user: { select: { id: true, email: true } } }, orderBy: { createdAt: "desc" } });
    return res.json({ success: true, data: orders });
};

export const getAllPayments = async (_req: Request, res: Response) => {
    const payments = await prisma.payment.findMany({ include: { order: true } });
    return res.json({ success: true, data: payments });
};

export const systemStats = async (_req: Request, res: Response) => {
    const [userCount, orderCount, paymentCount] = await Promise.all([prisma.user.count(), prisma.order.count(), prisma.payment.count()]);
    return res.json({ success: true, data: { userCount, orderCount, paymentCount } });
};