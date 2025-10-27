// src/controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import prisma from "../config/prisma.js";
import env from "../config/env.js";
import {
  RegisterSchema,
  LoginSchema,
  ChangePasswordSchema,
} from "../schemas/authSchemas.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

// ─────────────────────────────────────────────
// 🔧 Helper: Ensure whitelist consistency
// ─────────────────────────────────────────────
async function ensureWhitelistConsistency(email?: string, phone?: string) {
  if (!email && !phone) return;

  const existing = await prisma.whitelist.findFirst({
    where: {
      OR: [{ email: email || undefined }, { phone: phone || undefined }],
    },
  });

  if (!existing) {
    // Create new whitelist entry if none exists
    await prisma.whitelist.create({
      data: { email, phone },
    });
  } else {
    // If one field missing, fill it in
    await prisma.whitelist.update({
      where: { id: existing.id },
      data: {
        email: existing.email ?? email,
        phone: existing.phone ?? phone,
      },
    });
  }
}

// ─────────────────────────────────────────────
// 🧩 REGISTER
// ─────────────────────────────────────────────
export const register = async (req: Request, res: Response) => {
  try {
    const validated = RegisterSchema.parse(req.body);

    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });

    const hashed = await bcrypt.hash(validated.password, 10);

    // 🔍 Check whitelist table for email or phone
    const whitelisted = await prisma.whitelist.findFirst({
      where: {
        OR: [
          { email: validated.email },
          { phone: validated.phone || undefined },
        ],
      },
    });

    const isAdmin = !!whitelisted;

    // 👑 Create user
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        passwordHash: hashed,
        phone: validated.phone,
        role: isAdmin ? "ADMIN" : "CUSTOMER",
      },
    });

    // 🧠 Enrich whitelist dynamically if needed
    if (isAdmin) {
      await ensureWhitelistConsistency(validated.email, validated.phone);
    }

    // 🎟️ Generate JWT
    const secret: Secret = env.JWT_SECRET!;
    const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as any };
    const token = jwt.sign({ userId: user.id }, secret, options);

    return res.status(201).json({ success: true, data: { user, token } });
  } catch (err: any) {
    console.error("Register error:", err);
    return res
      .status(400)
      .json({ success: false, message: err.message || "Registration failed" });
  }
};

// ─────────────────────────────────────────────
// 🔑 LOGIN
// ─────────────────────────────────────────────
export const login = async (req: Request, res: Response) => {
  try {
    const validated = LoginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const ok = await bcrypt.compare(validated.password, user.passwordHash);
    if (!ok)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const secret: Secret = env.JWT_SECRET!;
    const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as any };
    const token = jwt.sign({ userId: user.id }, secret, options);

    return res.json({ success: true, data: { user, token } });
  } catch (err: any) {
    console.error("Login error:", err);
    return res
      .status(400)
      .json({ success: false, message: err.message || "Login failed" });
  }
};

// ─────────────────────────────────────────────
// 🔒 CHANGE PASSWORD
// ─────────────────────────────────────────────
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const validated = ChangePasswordSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(
      validated.oldPassword,
      user.passwordHash
    );
    if (!match)
      return res
        .status(400)
        .json({ success: false, message: "Old password incorrect" });

    const newHash = await bcrypt.hash(validated.newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err: any) {
    console.error("Change password error:", err);
    return res
      .status(400)
      .json({
        success: false,
        message: err.message || "Failed to change password",
      });
  }
};