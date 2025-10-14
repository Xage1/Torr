import prisma from "../config/prisma.js";
/**
 * @desc Fetch all users (optionally filter by role or status)
 * @route GET /api/admin/users
 * @access Admin
 */
export const getAllUsers = async (req, res) => {
    try {
        const { role, active } = req.query;
        const users = await prisma.user.findMany({
            where: {
                ...(role ? { role: String(role) } : {}),
                ...(active ? { active: active === "true" } : {}),
            },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, count: users.length, data: users });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
};
/**
 * @desc Deactivate or ban a user
 * @route PATCH /api/admin/users/:userId/deactivate
 * @access Admin
 */
export const deactivateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });
        const updated = await prisma.user.update({
            where: { id: userId },
            data: { active: false },
        });
        res.status(200).json({ success: true, message: "User deactivated", data: updated });
    }
    catch (error) {
        console.error("Error deactivating user:", error);
        res.status(500).json({ success: false, message: "Failed to deactivate user" });
    }
};
/**
 * @desc Get all orders
 * @route GET /api/admin/orders
 * @access Admin
 */
export const getAllOrders = async (_req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { items: true, user: { select: { id: true, email: true } } },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, count: orders.length, data: orders });
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
};
/**
 * @desc Get all payments
 * @route GET /api/admin/payments
 * @access Admin
 */
export const getAllPayments = async (_req, res) => {
    try {
        const payments = await prisma.payment.findMany({
            include: { user: { select: { id: true, email: true } } },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, count: payments.length, data: payments });
    }
    catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ success: false, message: "Failed to fetch payments" });
    }
};
/**
 * @desc Get system statistics (users, orders, payments, total sales)
 * @route GET /api/admin/stats
 * @access Admin
 */
export const systemStats = async (_req, res) => {
    try {
        const [userCount, activeUsers, orderCount, paymentCount, totalRevenue] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { active: true } }),
            prisma.order.count(),
            prisma.payment.count(),
            prisma.payment.aggregate({ _sum: { amount: true } }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                userCount,
                activeUsers,
                orderCount,
                paymentCount,
                totalRevenue: totalRevenue._sum.amount || 0,
            },
        });
    }
    catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ success: false, message: "Failed to fetch system stats" });
    }
};
//# sourceMappingURL=adminController.js.map