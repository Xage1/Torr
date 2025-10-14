import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { UpdateUserSchema } from "../schemas/userSchemas.js";

export const getUserProfile = async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    res.json({ success: true, data: user });
};

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const validated = UpdateUserSchema.parse(req.body);
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: validated,
        });
        res.json({ success: true, data: updatedUser });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const deleteUserAccount = async (req: Request, res: Response) => {
    await prisma.user.delete({ where: { id: req.user.id } });
    res.json({ success: true, message: "User account deleted successfully" });
};