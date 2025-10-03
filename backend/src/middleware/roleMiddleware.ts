import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

/**
 *  roleMiddleware('ADMIN') - only ADMIN allowed
 * roleMiddleware('ADMIN, 'CUSTOMER') - either allowed
*/

export function roleMiddleware(...allowedRoles: string[]){
    return (req: AuthRequest, res: Response, next : NextFunction) => {
        try {
            const user = req.user;
            if (!user) return res.status(401).json({ success: false, message: "Unauthorzed" });

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ success: false, message: "Forbidden: insufficient priviledges" });
            }
            next();
        } catch (err) {
            next(err);
        }
    };
}