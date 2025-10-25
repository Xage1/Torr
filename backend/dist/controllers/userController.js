import prisma from "../config/prisma.js";
import { UpdateUserSchema } from "../schemas/userSchemas.js";
export const getUserProfile = async (req, res) => {
    const auth = req;
    if (!auth.user?.id)
        return res.status(401).json({ success: false, message: "Unauthorized" });
    const user = await prisma.user.findUnique({ where: { id: auth.user.id }, select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true } });
    return res.json({ success: true, data: user });
};
export const updateUserProfile = async (req, res) => {
    try {
        const validated = UpdateUserSchema.parse(req.body);
        const auth = req;
        if (!auth.user?.id)
            return res.status(401).json({ success: false, message: "Unauthorized" });
        const updated = await prisma.user.update({ where: { id: auth.user.id }, data: validated });
        return res.json({ success: true, data: updated });
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ success: false, message: err?.message || "Failed" });
    }
};
export const deleteUserAccount = async (req, res) => {
    const auth = req;
    if (!auth.user?.id)
        return res.status(401).json({ success: false, message: "Unauthorized" });
    await prisma.user.delete({ where: { id: auth.user.id } });
    return res.json({ success: true, message: "Deleted" });
};
//# sourceMappingURL=userController.js.map