import jwt from "jsonwebtoken";
import env from "../config/env";
import prisma from "../config/prisma";
export async function authMiddleware(req, res, next) {
    try {
        const header = req.header("Authorization");
        if (!header || !header.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ success: false, message: "Authorization required" });
        }
        const token = header.slice(7).trim();
        const secret = env.JWT_SECRET;
        if (!secret) {
            console.error("JWT_SECRET missing from env");
            return res
                .status(500)
                .json({ success: false, message: "Server misconfiguration" });
        }
        let decoded;
        try {
            decoded = jwt.verify(token, secret);
        }
        catch {
            return res
                .status(401)
                .json({ success: false, message: "Invalid or expired token" });
        }
        if (!decoded || typeof decoded !== "object") {
            return res
                .status(401)
                .json({ success: false, message: "Invalid token payload" });
        }
        const userId = Number(decoded.userId);
        if (!userId || Number.isNaN(userId)) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid token payload (userId)" });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, role: true },
        });
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid or deleted user" });
        }
        req.user = user;
        return next();
    }
    catch (err) {
        console.error("authMiddleware error:", err);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}
/**
 * Require a specific role to access route.
 * Example usage: router.get("/admin", requireRole("ADMIN"), handler)
 */
export function requireRole(role) {
    return (req, res, next) => {
        if (!req.user) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized access" });
        }
        if (req.user.role !== role) {
            return res
                .status(403)
                .json({ success: false, message: "Forbidden: insufficient permissions" });
        }
        next();
    };
}
//# sourceMappingURL=authMiddleware.js.map