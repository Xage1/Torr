import express from "express";
import { registry } from "../config/openapi.js";
import {
    register,
    login,
    changePassword,
} from "../controllers/authController.js";
import {
    RegisterSchema,
    LoginSchema,
    ChangePasswordSchema,
} from "../schemas/authSchemas.js";

const router = express.Router();

registry.registerPath({
    method: "post",
    path: "/auth/register",
    summary: "Register a new user",
    requestBody: {
        content: {
            "application/json": {
                schema: { $ref: registry.register("RegisterSchema", RegisterSchema) },
            },
        },
    },
    responses: { 201: { description: "User registered successfully" } },
});

registry.registerPath({
    method: "post",
    path: "/auth/login",
    summary: "Login a user",
    requestBody: {
        content: {
            "application/json": {
                schema: { $ref: registry.register("LoginSchema", LoginSchema) },
            },
        },
    },
    responses: { 200: { description: "User logged in successfully" } },
});

registry.registerPath({
    method: "post",
    path: "/auth/change-password",
    summary: "Change user password",
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    $ref: registry.register(
                        "ChangePasswordSchema",
                        ChangePasswordSchema
                    ),
                },
            },
        },
    },
    responses: { 200: { description: "Password changed successfully" } },
});

router.post("/register", register);
router.post("/login", login);
router.post("/change-password", changePassword);

export default router;