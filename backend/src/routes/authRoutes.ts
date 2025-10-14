import express from "express";
import { register, login } from "../controllers/authController.js";
import { z } from "../config/openapi.js";
import { RegisterSchema, LoginSchema } from "../controllers/authController.js";
import { registry } from "../docs/registry.js";

// Register schemas for Swagger
registry.register("RegisterSchema", RegisterSchema);
registry.register("LoginSchema", LoginSchema);

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (auto-assigns admin if whitelisted)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterSchema'
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login and receive JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginSchema'
 *     responses:
 *       200:
 *         description: Successful login
 */
router.post("/login", login);

export default router;