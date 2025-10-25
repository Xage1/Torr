import express from "express";
import {
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
} from "../controllers/userController.js";
import { registry } from "../config/openapi.js";
import { UpdateUserSchema } from "../schemas/userSchemas.js";

const router = express.Router();

registry.registerPath({
    method: "get",
    path: "/users/me",
    summary: "Get user profile",
    responses: { 200: { description: "User profile details" } },
});

registry.registerPath({
    method: "put",
    path: "/users/me",
    summary: "Update user profile",
    requestBody: {
        content: {
            "application/json": {
                schema: { $ref: registry.register("UpdateUserSchema", UpdateUserSchema) },
            },
        },
    },
    responses: { 200: { description: "Profile updated" } },
});

registry.registerPath({
    method: "delete",
    path: "/users/{id}",
    summary: "Delete a user",
    responses: { 200: { description: "User deleted" } },
});

router.get("/me", getUserProfile);
router.put("/me", updateUserProfile);
router.delete("/:id", deleteUserAccount);

export default router;