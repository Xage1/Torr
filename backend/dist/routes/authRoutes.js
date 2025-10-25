import express from "express";
import { registry } from "../docs/registry.js";
import { register, login, changePassword } from "../controllers/authController.js";
import { RegisterSchema, LoginSchema, ChangePasswordSchema } from "../schemas/authSchemas.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();
// Swagger docs
registry.registerPath({
    method: "post",
    path: "/auth/register",
    tags: ["Auth"],
    summary: "Register a new user",
    requestBody: {
        content: {
            "application/json": {
                schema: registry.register("RegisterSchema", RegisterSchema),
            },
        },
    },
    responses: { 201: { description: "User created" } },
});
registry.registerPath({
    method: "post",
    path: "/auth/login",
    tags: ["Auth"],
    summary: "Login user",
    requestBody: {
        content: {
            "application/json": {
                schema: registry.register("LoginSchema", LoginSchema),
            },
        },
    },
    responses: { 200: { description: "Login successful" } },
});
registry.registerPath({
    method: "post",
    path: "/auth/change-password",
    tags: ["Auth"],
    summary: "Change user password",
    requestBody: {
        content: {
            "application/json": {
                schema: registry.register("ChangePasswordSchema", ChangePasswordSchema),
            },
        },
    },
    responses: { 200: { description: "Password changed" } },
});
router.post("/register", register);
router.post("/login", login);
router.post("/change-password", authMiddleware, changePassword);
export default router;
//# sourceMappingURL=authRoutes.js.map