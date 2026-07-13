import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.js";

export const auditLogger =
    (action: string) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const originalJson = res.json.bind(res);

        res.json = ((body: any) => {
            setImmediate(async () => {
                try {
                    const auth = req as any;

                    await prisma.auditLog.create({
                        data: {
                            userId: auth.user?.id ?? null,
                            action,
                            ip:
                                req.ip ||
                                req.socket.remoteAddress ||
                                "unknown",
                            userAgent:
                                req.headers["user-agent"] || "",
                            metadata: {
                                method: req.method,
                                url: req.originalUrl,
                                params: req.params,
                                query: req.query,
                                status: res.statusCode,
                                success: body?.success ?? true,
                            },
                        },
                    });
                } catch (err) {
                    console.error("Audit Logger:", err);
                }
            });

            return originalJson(body);
        }) as any;

        next();
    };