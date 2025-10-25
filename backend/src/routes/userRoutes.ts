import express from "express";
import { registry } from "../docs/registry.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getUserProfile, updateUserProfile, deleteUserAccount } from "../controllers/userController.js";
import { UpdateUserSchema } from "../schemas/userSchemas.js";

const router = express.Router();
router.use(authMiddleware);

registry.registerPath({
    method: "get",
    path: "/users/me",
    tags: ["User"],
    summary: "Get user profile",
    responses: { 200: { description: "Profile fetched" } },
});

registry.registerPath({
    method: "put",
    path: "/users/me",
    tags: ["User"],
    summary: "Update user profile",
    requestBody: {
        content: {
            "application/json": {
                schema: registry.register("UpdateUserSchema", UpdateUserSchema),
            },
        },
    },
    responses: { 200: { description: "Profile updated" } },
});

registry.registerPath({
    method: "delete",
    path: "/users/me",
    tags: ["User"],
    summary: "Delete user account",
    responses: { 200: { description: "Account deleted" } },
});

router.get("/me", getUserProfile);
router.put("/me", updateUserProfile);
router.delete("/me", deleteUserAccount);

export default router;