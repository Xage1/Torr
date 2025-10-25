// src/routes/userRoutes.ts
import express from "express";
import { registry } from "../docs/registry.js";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUserAccount,
} from "../controllers/userController.js";

const userRouter = express.Router();

// TS FIX: Middleware typing conflicts → use `as any` to satisfy Express type system
const auth = authMiddleware as any;
const adminOnly = requireRole("ADMIN") as any;

// ─────────────────────────────────────────────
// 📘 Get authenticated user profile
// ─────────────────────────────────────────────
registry.registerPath({
  method: "get",
  path: "/users/me",
  tags: ["Users"],
  summary: "Get authenticated user profile",
  responses: {
    200: { description: "User profile returned" },
    401: { description: "Unauthorized" },
  },
});
userRouter.get("/me", auth, getUserProfile as any);

// ─────────────────────────────────────────────
// ✏️ Update user profile
// ─────────────────────────────────────────────
registry.registerPath({
  method: "put",
  path: "/users/me",
  tags: ["Users"],
  summary: "Update user profile",
  requestBody: {
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/UpdateUserSchema" },
      },
    },
  },
  responses: {
    200: { description: "Profile updated" },
    400: { description: "Validation error" },
    401: { description: "Unauthorized" },
  },
});
userRouter.put("/me", auth, updateUserProfile as any);

// ─────────────────────────────────────────────
// 👑 Admin: Get all users
// ─────────────────────────────────────────────
registry.registerPath({
  method: "get",
  path: "/admin/users",
  tags: ["Admin"],
  summary: "Admin: Get all users",
  responses: {
    200: { description: "List of all users" },
    403: { description: "Forbidden" },
  },
});
userRouter.get("/admin/users", auth, adminOnly, getAllUsers as any);

// ─────────────────────────────────────────────
// ❌ Admin: Delete/deactivate user
// ─────────────────────────────────────────────
registry.registerPath({
  method: "delete",
  path: "/admin/users/{userId}",
  tags: ["Admin"],
  summary: "Admin: Delete or deactivate user",
  parameters: [
    {
      name: "userId",
      in: "path",
      required: true,
      schema: { type: "integer" },
    },
  ],
  responses: {
    200: { description: "User deleted or deactivated" },
    403: { description: "Forbidden" },
  },
});
userRouter.delete("/admin/users/:userId", auth, adminOnly, deleteUserAccount as any);

export default userRouter;