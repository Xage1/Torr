// src/controllers/orderController.ts
import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const createOrder = async (req: Request, res: Response) => {
    try {
        const auth = req as any;
        if (!auth.user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

        const { items } = req.body;
        if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ success: false, message: "No items" });

        // compute total & record OrderItems
        const total = items.reduce((acc: number, it: any) => acc + Number(it.price || 0) * Number(it.quantity || 0), 0);

        const order = await prisma.order.create({
            data: {
                userId: auth.user.id,
                status: "PENDING",
                total,
            },
        });

        // create order items
        for (const it of items) {
            await prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: Number(it.productId),
                    quantity: Number(it.quantity),
                    price: Number(it.price || 0),
                },
            });
        }

        const created = await prisma.order.findUnique({ where: { id: order.id }, include: { OrderItem: true } });
        return res.status(201).json({ success: true, data: created });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ success: false, message: err?.message || "Failed to create order" });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    const auth = req as any;
    if (!auth.user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    const orders = await prisma.order.findMany({ where: { userId: auth.user.id }, include: { OrderItem: true } });
    return res.json({ success: true, data: orders });
};

export const getOrderById = async (req: Request, res: Response) => {
    const id = Number(req.params.orderId);
    if (!id) return res.status(400).json({ success: false, message: "Invalid id" });
    const order = await prisma.order.findUnique({ where: { id }, include: { OrderItem: true, Payment: true } });
    if (!order) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: order });
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    const id = Number(req.params.orderId);
    const { status } = req.body;
    if (!id) return res.status(400).json({ success: false, message: "Invalid id" });
    if (!["PENDING", "PAID", "SHIPPED", "CANCELLED"].includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });
    const updated = await prisma.order.update({ where: { id }, data: { status } as any });
    return res.json({ success: true, data: updated });
};

export const deleteOrder = async (req: Request, res: Response) => {
    const id = Number(req.params.orderId);
    if (!id) return res.status(400).json({ success: false, message: "Invalid id" });
    await prisma.order.delete({ where: { id } });
    return res.json({ success: true, message: "Deleted" });
};