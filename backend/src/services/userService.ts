import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

export const getProfile = async (userId: number) => {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            verified: true,
            twoFactorEnabled: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

export const updateProfile = async (
    userId: number,
    data: {
        name?: string;
        phone?: string;
    }
) => {
    return prisma.user.update({
        where: {
            id: userId,
        },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            verified: true,
            twoFactorEnabled: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

export const changePassword = async (
    userId: number,
    currentPassword: string,
    newPassword: string
) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error("User not found.");
    }

    const valid = await bcrypt.compare(
        currentPassword,
        user.passwordHash
    );

    if (!valid) {
        throw new Error("Current password is incorrect.");
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            passwordHash,
            failedAttempts: 0,
            lockedUntil: null,
        },
    });

    return true;
};

export const changeEmail = async (
    userId: number,
    email: string
) => {
    const exists = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (exists) {
        throw new Error("Email already exists.");
    }

    return prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            email,
            verified: false,
        },
        select: {
            id: true,
            name: true,
            email: true,
            verified: true,
        },
    });
};

export const getOrders = async (userId: number) => {
    return prisma.order.findMany({
        where: {
            userId,
        },
        include: {
            OrderItem: {
                include: {
                    product: true,
                },
            },
            Payment: true,
            Invoice: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getPayments = async (userId: number) => {
    return prisma.payment.findMany({
        where: {
            order: {
                userId,
            },
        },
        include: {
            order: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getInvoices = async (userId: number) => {
    return prisma.invoice.findMany({
        where: {
            order: {
                userId,
            },
        },
        include: {
            order: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getUserStatistics = async (
    userId: number
) => {
    const [
        orders,
        completed,
        payments,
        invoices,
    ] = await Promise.all([
        prisma.order.count({
            where: {
                userId,
            },
        }),

        prisma.order.count({
            where: {
                userId,
                status: "DELIVERED",
            },
        }),

        prisma.payment.aggregate({
            where: {
                order: {
                    userId,
                },
                status: "SUCCESS",
            },
            _sum: {
                amount: true,
            },
        }),

        prisma.invoice.count({
            where: {
                order: {
                    userId,
                },
            },
        }),
    ]);

    return {
        totalOrders: orders,
        deliveredOrders: completed,
        invoices,
        totalSpent: payments._sum.amount ?? 0,
    };
};

export const deleteAccount = async (
    userId: number
) => {
    await prisma.user.delete({
        where: {
            id: userId,
        },
    });

    return true;
};