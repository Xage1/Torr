import jwt from "jsonwebtoken";
import env from "../config/env.js";
import prisma from "../config/prisma.js";
export async function authMiddleware(req, res, next) {
    try {
        const header = req.header("Authorization");
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Authorization required" });
        }
        const token = header.slice(7).trim();
        const secret = env.JWT_SECRET;
        if (!secret)
            return res.status(500).json({ success: false, message: "Server misconfigured" });
        let payload;
        try {
            payload = jwt.verify(token, secret);
        }
        catch (e) {
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }
        if (!payload || typeof payload !== "object") {
            return res.status(401).json({ success: false, message: "Invalid token payload" });
        }
        const maybeUserId = payload.userId;
        const userId = typeof maybeUserId === "string" ? Number(maybeUserId) : Number(maybeUserId);
        if (!userId || Number.isNaN(userId)) {
            return res.status(401).json({ success: false, message: "Invalid token payload (userId)" });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, role: true },
        });
        if (!user)
            return res.status(401).json({ success: false, message: "Invalid token (user not found)" });
        req.user = { id: user.id, email: user.email, role: user.role };
        return next();
    }
    catch (err) {
        console.error("authMiddleware error", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
export function requireRole(role) {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        if (req.user.role !== role)
            return res.status(403).json({ success: false, message: "Forbidden" });
        next();
    };
}
//# sourceMappingURL=authMiddleware.js.map