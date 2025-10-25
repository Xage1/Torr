import prisma from "../config/prisma.js";
import { UpdateUserSchema } from "../schemas/userSchemas.js";
/**
 * Get authenticated user profile
 */
export const getUserProfile = async (req, res) => {
    if (!req.user?.id)
        return res.status(401).json({ success: false, message: "Unauthorized" });
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
        },
    });
    return res.json({ success: true, data: user });
};
/**
 * Update authenticated user's profile
 */
export const updateUserProfile = async (req, res) => {
    try {
        const validated = UpdateUserSchema.parse(req.body);
        if (!req.user?.id)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const updated = await prisma.user.update({
            where: { id: req.user.id },
            data: validated,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
            },
        });
        return res.json({ success: true, data: updated });
    }
    catch (err) {
        console.error(err);
        return res
            .status(400)
            .json({ success: false, message: err?.message || "Validation failed" });
    }
};
/**
 * ADMIN ONLY – Get all users
 */
export const getAllUsers = async (req, res) => {
    if (req.user?.role !== "ADMIN") {
        return res
            .status(403)
            .json({ success: false, message: "Forbidden: Admin access required" });
    }
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, data: users });
};
/**
 * Delete or deactivate current user (self)
 */
export const deleteUserAccount = async (req, res) => {
    if (!req.user?.id)
        return res.status(401).json({ success: false, message: "Unauthorized" });
    await prisma.user.delete({ where: { id: req.user.id } });
    return res.json({ success: true, message: "Account deleted" });
};
//# sourceMappingURL=userController.js.map