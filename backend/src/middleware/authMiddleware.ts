// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../config/env";
import prisma from "../config/prisma";

export interface AuthUser {
    id: number;
    email: string;
    role: string;
}

export interface AuthRequest extends Request {
    user?: AuthUser;
}

export async function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const header = req.header("Authorization");
        if (!header || !header.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ success: false, message: "Authorization required" });
        }

        const token = header.slice(7).trim(); // remove "Bearer "

        // Ensure secret exists at runtime. This narrows `secret` to `string` for TS.
        const secret = env.JWT_SECRET;
        if (!secret) {
            console.error("JWT_SECRET is not set in environment");
            return res
                .status(500)
                .json({ success: false, message: "Server misconfiguration" });
        }

        // jwt.verify returns string | JwtPayload
        let decoded: string | JwtPayload;
        try {
            decoded = jwt.verify(token, secret);
        } catch (verifyErr) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid or expired token" });
        }

        // We require an object payload that contains userId
        if (!decoded || typeof decoded !== "object") {
            return res
                .status(401)
                .json({ success: false, message: "Invalid token payload" });
        }

        // Extract userId robustly (token might contain userId as string or number)
        const maybeUserId = (decoded as any).userId;
        const userId =
            typeof maybeUserId === "string"
                ? parseInt(maybeUserId, 10)
                : typeof maybeUserId === "number"
                    ? maybeUserId
                    : NaN;

        if (!userId || Number.isNaN(userId)) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid token payload (userId)" });
        }

        // Fetch minimal user fields
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, role: true },
        });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        // Attach typed user to request
        req.user = { id: user.id, email: user.email, role: user.role };

        return next();
    } catch (err) {
        console.error("authMiddleware error:", err);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}