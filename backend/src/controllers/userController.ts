import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import * as userService from "../services/userService.js";
import { UpdateUserSchema } from "../schemas/userSchemas.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

/**
 * GET /users/profile
 */
export const getUserProfile = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const profile = await userService.getProfile(req.user.id);

        return res.json({
            success: true,
            data: profile,
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * PUT /users/profile
 */
export const updateUserProfile = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const validated = UpdateUserSchema.parse(req.body);

        const user = await userService.updateProfile(
            req.user.id,
            validated
        );

        return res.json({
            success: true,
            message: "Profile updated successfully.",
            data: user,
        });

    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * PUT /users/change-password
 */
export const changePassword = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { currentPassword, newPassword } = req.body;

        await userService.changePassword(
            req.user.id,
            currentPassword,
            newPassword
        );

        return res.json({
            success: true,
            message: "Password changed successfully.",
        });

    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * PUT /users/change-email
 */
export const changeEmail = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { email } = req.body;

        const user = await userService.changeEmail(
            req.user.id,
            email
        );

        return res.json({
            success: true,
            message: "Email updated successfully.",
            data: user,
        });

    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * GET /users/statistics
 */
export const getStatistics = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const stats = await userService.getUserStatistics(
            req.user.id
        );

        return res.json({
            success: true,
            data: stats,
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * GET /users/orders
 */
export const getOrders = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const orders = await userService.getOrders(req.user.id);

        return res.json({
            success: true,
            data: orders,
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * GET /users/payments
 */
export const getPayments = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const payments = await userService.getPayments(
            req.user.id
        );

        return res.json({
            success: true,
            data: payments,
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * GET /users/invoices
 */
export const getInvoices = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const invoices = await userService.getInvoices(
            req.user.id
        );

        return res.json({
            success: true,
            data: invoices,
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * DELETE /users/account
 */
export const deleteUserAccount = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        await userService.deleteAccount(req.user.id);

        return res.json({
            success: true,
            message: "Account deleted successfully.",
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * GET /admin/users
 */
export const getAllUsers = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (req.user?.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Forbidden",
            });
        }

        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                verified: true,
                twoFactorEnabled: true,
                createdAt: true,
            },
        });

        return res.json({
            success: true,
            count: users.length,
            data: users,
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};