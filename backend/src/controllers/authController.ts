import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import env from "../config/env.js";
import { z } from "../config/openapi.js";
import { ApiResponseSchema } from "../schemas/commonSchemas.js";

// --- SCHEMAS (for validation + Swagger use) ---
export const RegisterSchema = z.object({
    email: z.string().email(),
    phone: z.string().min(7, "Invalid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(2),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

// --- ADMIN WHITELIST ---
const ADMIN_WHITELIST = {
    emails: ["admin@torr.com", "kennethdaxage@gmail.com"],
    phones: ["+254700000000", "+254711111111"],
};

// --- CONTROLLER FUNCTIONS ---

export const register = async (req: Request, res: Response) => {
    try {
        const parsed = RegisterSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input",
                error: parsed.error.issues,
            });
        }

        const { email, phone, password, name } = parsed.data;

        // Check if user exists
        const existing = await prisma.user.findFirst({
            where: { OR: [{ email }, { phone }] },
        });

        if (existing) {
            return res
                .status(409)
                .json({ success: false, message: "User already exists" });
        }

        // Determine role based on whitelist
        const role =
            ADMIN_WHITELIST.emails.includes(email) ||
                ADMIN_WHITELIST.phones.includes(phone)
                ? "ADMIN"
                : "USER";

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: { name, email, phone, password: hashedPassword, role },
            select: { id: true, name: true, email: true, phone: true, role: true },
        });

        // Sign token
        const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
            expiresIn: "7d",
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { user, token },
        });
    } catch (err) {
        console.error("Register error:", err);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const parsed = LoginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input",
                error: parsed.error.issues,
            });
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
            expiresIn: "7d",
        });

        return res.json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};