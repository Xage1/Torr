// src/controllers/orderController.ts

import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import * as orderService from "../services/orderService.js";

const ORDER_STATUSES = [
    "CREATED",
    "AWAITING_PAYMENT",
    "PAID",
    "PROCESSING",
    "READY_FOR_PICKUP",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
];

export const createOrder = async (req: Request, res: Response) => {
    try {
        const auth = req as any;

        if (!auth.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order must contain at least one item.",
            });
        }

        const order = await orderService.createOrder(
            auth.user.id,
            items
        );

        return res.status(201).json({
            success: true,
            message: "Order created successfully.",
            data: order,
        });

    } catch (err: any) {
        console.error("Create Order Error:", err);

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Failed to create order.",
        });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const auth = req as any;

        if (!auth.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const orders = await prisma.order.findMany({
            where: {
                userId: auth.user.id,
            },
            include: {
                OrderItem: {
                    include: {
                        product: true,
                    },
                },
                Payment: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.json({
            success: true,
            count: orders.length,
            data: orders,
        });

    } catch (err: any) {
        console.error("Get Orders Error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve orders.",
        });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const auth = req as any;

        if (!auth.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const orderId = Number(req.params.orderId);

        if (isNaN(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID.",
            });
        }

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId: auth.user.id,
            },
            include: {
                OrderItem: {
                    include: {
                        product: true,
                    },
                },
                Payment: true,
            },
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        return res.json({
            success: true,
            data: order,
        });

    } catch (err: any) {
        console.error("Get Order Error:", err);

        return res.status(500).json({
            success: false,
            message: err.message || "Failed to retrieve order.",
        });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const orderId = Number(req.params.orderId);

        if (isNaN(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID.",
            });
        }

        const { status } = req.body;

        if (!ORDER_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status.",
                allowedStatuses: ORDER_STATUSES,
            });
        }

        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
            },
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        const updatedOrder = await prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                status: status as any,
            },
        });

        return res.json({
            success: true,
            message: "Order status updated successfully.",
            data: updatedOrder,
        });

    } catch (err: any) {
        console.error("Update Order Error:", err);

        return res.status(500).json({
            success: false,
            message: err.message || "Failed to update order.",
        });
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const orderId = Number(req.params.orderId);

        if (isNaN(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID.",
            });
        }

        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
            },
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        await prisma.order.delete({
            where: {
                id: orderId,
            },
        });

        return res.json({
            success: true,
            message: "Order deleted successfully.",
        });

    } catch (err: any) {
        console.error("Delete Order Error:", err);

        return res.status(500).json({
            success: false,
            message: err.message || "Failed to delete order.",
        });
    }
};