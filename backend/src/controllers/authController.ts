import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { env } from "../config/env.js";
import { RegisterSchema, LoginSchema, ChangePasswordSchema } from "../schemas/authSchemas.js";
import { whitelist } from "../config/whitelist.js";

export const register = async (req: Request, res: Response) => {
    try {
        const validated = RegisterSchema.parse(req.body);

        const existing = await prisma.user.findUnique({ where: { email: validated.email } });
        if (existing) return res.status(400).json({ success: false, message: "Email already exists" });

        const hashed = await bcrypt.hash(validated.password, 10);

        // whitelist logic
        const isAdmin = whitelist.emails.includes(validated.email) ||
            (validated.phone && whitelist.phones.includes(validated.phone));

        const user = await prisma.user.create({
            data: {
                name: validated.name,
                email: validated.email,
                passwordHash: hashed,
                phone: validated.phone,
                role: isAdmin ? "ADMIN" : "CUSTOMER",
            },
        });

        const secret: Secret = env.JWT_SECRET!;
        const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as any };
        const token = jwt.sign({ userId: user.id }, secret, options);

        return res.status(201).json({ success: true, data: { user, token } });
    } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const validated = LoginSchema.parse(req.body);
        const user = await prisma.user.findUnique({ where: { email: validated.email } });
        if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const ok = await bcrypt.compare(validated.password, user.passwordHash);
        if (!ok) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const secret: Secret = env.JWT_SECRET!;
        const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as any };
        const token = jwt.sign({ userId: user.id }, secret, options);

        return res.json({ success: true, data: { user, token } });
    } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const validated = ChangePasswordSchema.parse(req.body);
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const match = await bcrypt.compare(validated.oldPassword, user.passwordHash);
        if (!match) return res.status(400).json({ success: false, message: "Old password incorrect" });

        const newHash = await bcrypt.hash(validated.newPassword, 10);
        await prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } });

        return res.json({ success: true, message: "Password changed successfully" });
    } catch (err: any) {
        return res.status(400).json({ success: false, message: err.message });
    }
};