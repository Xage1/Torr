import { Request, Response } from "express";
import prisma from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import { env } from "../config/env"; // make sure you use named export if you followed that style
import jwt, { SignOptions } from "jsonwebtoken";
import { success, fail } from "../utils/response";
import { registerSchema, loginSchema } from "../validators/authValidators";

// helper for token signing
function generateToken(userId: number): string {
    const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as any }; // cast here
    return jwt.sign({ userId }, env.JWT_SECRET as string, options);
}

export async function register(req: Request, res: Response) {
    try {
        const parsed = registerSchema.parse(req.body);

        const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
        if (existing) {
            return res.status(400).json(fail("Email already in use"));
        }

        const passwordHash = await hashPassword(parsed.password);

        const user = await prisma.user.create({
            data: {
                name: parsed.name,
                email: parsed.email,
                passwordHash,
                phone: parsed.phone ?? null,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        const token = generateToken(user.id);

        return res.status(201).json(success({ user, token }, "Registered"));
    } catch (err: any) {
        if (err?.issues) {
            return res.status(400).json(fail("Validation failed", err.issues));
        }
        console.error(err);
        return res.status(500).json(fail("Registration failed", err?.message || err));
    }
}

export async function login(req: Request, res: Response) {
    try {
        const parsed = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email: parsed.email } });
        if (!user) return res.status(400).json(fail("Invalid credentials"));

        const ok = await comparePassword(parsed.password, user.passwordHash);
        if (!ok) return res.status(400).json(fail("Invalid credentials"));

        const token = generateToken(user.id);

        return res.json(
            success(
                {
                    token,
                    user: { id: user.id, email: user.email, name: user.name, role: user.role },
                },
                "Logged in"
            )
        );
    } catch (err: any) {
        if (err?.issues) {
            return res.status(400).json(fail("Validation failed", err.issues));
        }
        console.error(err);
        return res.status(500).json(fail("Login failed", err?.message || err));
    }
}

export async function profile(req: Request, res: Response) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (req as any).user?.id;
        if (!userId) return res.status(401).json(fail("Unauthorized"));

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
        });

        if (!user) return res.status(404).json(fail("User not found"));

        return res.json(success(user));
    } catch (err) {
        console.error(err);
        return res.status(500).json(fail("Could not fetch profile"));
    }
}
