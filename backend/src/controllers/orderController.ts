import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { CreateOrderSchema, UpdateOrderSchema } from "../schemas/orderSchemas.js";

export const createOrder = async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

        const validated = CreateOrderSchema.parse(req.body);
        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                totalAmount: validated.totalAmount,
                status: "PENDING",
                items: {
                    createMany: { data: validated.items },
                },
            },
            include: { items: true },
        });
        res.status(201).json({ success: true, data: order });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const orders = await prisma.order.findMany({
        where: { userId: req.user.id },
        include: { items: true },
    });
    res.json({ success: true, data: orders });
};

export const getOrderById = async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.orderId, 10);
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ success: true, data: order });
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.orderId, 10);
    const validated = UpdateOrderSchema.parse(req.body);

    const updated = await prisma.order.update({
        where: { id: orderId },
        data: { status: validated.status },
    });

    res.json({ success: true, data: updated });
};

export const deleteOrder = async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.orderId, 10);
    await prisma.order.delete({ where: { id: orderId } });
    res.json({ success: true, message: "Order deleted" });
};