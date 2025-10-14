import prisma from "../config/prisma.js";
import { CreateOrderSchema } from "../schemas/orderSchemas.js";
import { ZodError } from "zod";
/**
 * Create a new order
 */
export const createOrder = async (req, res) => {
    try {
        const validated = CreateOrderSchema.parse(req.body);
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                items: {
                    createMany: { data: validated.items },
                },
                totalAmount: validated.totalAmount,
                status: "PENDING",
            },
            include: { items: true },
        });
        res.status(201).json({ success: true, data: order });
    }
    catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({ success: false, message: err.errors });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};
/**
 * Get all orders for the authenticated user
 */
export const getAllOrders = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const orders = await prisma.order.findMany({
            where: { userId: req.user.id },
            include: { items: true },
            orderBy: { createdAt: "desc" },
        });
        res.json({ success: true, data: orders });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
/**
 * Get a specific order by ID
 */
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        if (req.user?.id !== order.userId && req.user?.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }
        res.json({ success: true, data: order });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
/**
 * Update order status (ADMIN only)
 */
export const updateOrderStatus = async (req, res) => {
    try {
        if (req.user?.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }
        const { orderId } = req.params;
        const validated = UpdateOrderStatusSchema.parse(req.body);
        const updated = await prisma.order.update({
            where: { id: orderId },
            data: { status: validated.status },
        });
        res.json({ success: true, data: updated });
    }
    catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({ success: false, message: err.errors });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};
/**
 * Delete an order (owner or admin)
 */
export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        if (req.user?.id !== order.userId && req.user?.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }
        await prisma.order.delete({ where: { id: orderId } });
        res.json({ success: true, message: "Order deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
//# sourceMappingURL=orderController.js.map