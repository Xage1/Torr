import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../config/prisma.js";
import env from "../config/env.js";

export const authenticate: RequestHandler = async (req, res, next) => {

    try {

        const header = req.headers.authorization;

        if (!header?.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization required"
            });
        }

        const token = header.substring(7);

        const payload = jwt.verify(
            token,
            env.JWT_SECRET
        ) as JwtPayload;

        const user = await prisma.user.findUnique({

            where: {
                id: Number(payload.userId)
            },

            select: {
                id: true,
                email: true,
                role: true
            }

        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        req.user = user;

        next();

    } catch {

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });

    }

};

export const authorize =
    (...roles: ("ADMIN" | "CUSTOMER")[]): RequestHandler =>
    (req, res, next) => {

        if (!req.user) {

            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });

        }

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: "Forbidden"
            });

        }

        next();

    };