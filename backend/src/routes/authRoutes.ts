import { Router } from "express";
import { registry } from "../docs/registry.js";
import { z } from "../config/openapi.js";
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

export const authRouter = Router();

// ✅ Swagger: Register
registry.registerPath({
  method: "post",
  path: "/auth/register",
  summary: "Register new user",
  requestBody: {
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/RegisterSchema" },
      },
    },
  },
  responses: { 201: { description: "User registered" } },
});

authRouter.post("/register", register);

// ✅ Swagger: Login
registry.registerPath({
  method: "post",
  path: "/auth/login",
  summary: "Login user",
  requestBody: {
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/LoginSchema" },
      },
    },
  },
  responses: { 200: { description: "Authenticated" } },
});

authRouter.post("/login", login);

// ✅ Swagger: Change password
registry.registerPath({
  method: "post",
  path: "/auth/change-password",
  summary: "Change user password",
  requestBody: {
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ChangePasswordSchema" },
      },
    },
  },
  responses: { 200: { description: "Password changed" } },
});

authRouter.post("/change-password", changePassword);