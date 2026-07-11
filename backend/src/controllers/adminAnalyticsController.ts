// src/controllers/adminAnalyticsController.ts

import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const dashboard = async (req: Request, res: Response) => {
    try {

        const [
            revenue,
            totalOrders,
            paidOrders,
            totalCustomers,
            totalProducts,
            inventoryValue,
            lowStock,
            topProducts,
            recentOrders,
            monthlyRevenue,
            scraperJobs
        ] = await Promise.all([

            prisma.payment.aggregate({
                where: {
                    status: "SUCCESS"
                },
                _sum: {
                    amount: true
                }
            }),

            prisma.order.count(),

            prisma.order.count({
                where: {
                    status: "PAID"
                }
            }),

            prisma.user.count({
                where: {
                    role: "CUSTOMER"
                }
            }),

            prisma.product.count(),

            prisma.product.aggregate({
                _sum: {
                    stock: true
                }
            }),

            prisma.product.findMany({
                where: {
                    stock: {
                        lte: 10
                    }
                },
                orderBy: {
                    stock: "asc"
                }
            }),

            prisma.orderItem.groupBy({
                by: ["productId"],
                _sum: {
                    quantity: true
                },
                orderBy: {
                    _sum: {
                        quantity: "desc"
                    }
                },
                take: 10
            }),

            prisma.order.findMany({
                take: 10,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    user: true,
                    Payment: true
                }
            }),

            prisma.$queryRaw`
                SELECT
                    DATE_TRUNC('month',"createdAt") as month,
                    SUM(amount) as revenue
                FROM payments
                WHERE status='SUCCESS'
                GROUP BY month
                ORDER BY month
            `,

            prisma.scrapingJob.findMany({
                orderBy: {
                    runAt: "desc"
                },
                take: 20
            })

        ]);

        const ids = topProducts.map(x => x.productId);

        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: ids
                }
            }
        });

        const merged = topProducts.map(item => ({
            product: products.find(p => p.id === item.productId),
            sold: item._sum.quantity
        }));

        return res.json({

            success: true,

            data: {

                kpis: {

                    revenue: revenue._sum.amount || 0,

                    totalOrders,

                    paidOrders,

                    totalCustomers,

                    totalProducts,

                    inventoryUnits: inventoryValue._sum.stock || 0

                },

                lowStock,

                topProducts: merged,

                monthlyRevenue,

                recentOrders,

                scraperJobs

            }

        });

    } catch (err: any) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }
};

export const salesByCategory = async (req: Request, res: Response) => {

    try {

        const data = await prisma.$queryRaw`

        SELECT
            products.category,
            SUM(order_items.quantity) as quantity,
            SUM(order_items.quantity*order_items.price) as revenue

        FROM order_items

        JOIN products
        ON order_items."productId"=products.id

        GROUP BY products.category

        ORDER BY revenue DESC

        `;

        res.json({
            success: true,
            data
        });

    } catch (err: any) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

export const topCustomers = async (req: Request, res: Response) => {

    try {

        const customers = await prisma.$queryRaw`

        SELECT

        users.id,
        users.name,
        users.email,

        COUNT(orders.id) as orders,

        SUM(orders.total) as spent

        FROM users

        JOIN orders

        ON users.id=orders."userId"

        GROUP BY users.id

        ORDER BY spent DESC

        LIMIT 20

        `;

        res.json({
            success: true,
            data: customers
        });

    } catch (err: any) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

export const dailyRevenue = async (req: Request, res: Response) => {

    try {

        const data = await prisma.$queryRaw`

        SELECT

        DATE("createdAt") day,

        SUM(amount) revenue

        FROM payments

        WHERE status='SUCCESS'

        GROUP BY day

        ORDER BY day

        `;

        res.json({
            success: true,
            data
        });

    } catch (err: any) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

export const inventoryHealth = async (req: Request, res: Response) => {

    try {

        const data = await prisma.product.findMany({

            orderBy: {
                stock: "asc"
            }

        });

        res.json({
            success: true,
            data
        });

    } catch (err: any) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

export const scraperAnalytics = async (req: Request, res: Response) => {

    try {

        const data = await prisma.scrapingJob.groupBy({

            by: ["status"],

            _count: {
                status: true
            }

        });

        res.json({
            success: true,
            data
        });

    } catch (err: any) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};