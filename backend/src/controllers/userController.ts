// src/controllers/userController.ts
import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { UpdateUserSchema } from "../schemas/userSchemas.js";

export const getUserProfile = async (req: Request, res: Response) => {
    const auth = req as any;
    if (!auth.user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    const user = await prisma.user.findUnique({ where: { id: auth.user.id }, select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true } });
    return res.json({ success: true, data: user });
};

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const validated = UpdateUserSchema.parse(req.body);
        const auth = req as any;
        if (!auth.user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });
        const updated = await prisma.user.update({ where: { id: auth.user.id }, data: validated });
        return res.json({ success: true, data: updated });
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ success: false, message: err?.message || "Failed" });
    }
};

export const deleteUserAccount = async (req: Request, res: Response) => {
    const auth = req as any;
    if (!auth.user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    await prisma.user.delete({ where: { id: auth.user.id } });
    return res.json({ success: true, message: "Deleted" });
};