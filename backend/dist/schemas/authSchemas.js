// src/schemas/authSchemas.ts
import { z } from "../config/openapi.js";
export const RegisterSchema = z.object({
    name: z.string().min(2).openapi({ example: "Jane Doe" }).describe("Full name"),
    email: z.string().email().openapi({ example: "jane@torr.com" }),
    phone: z.string().min(7).optional().openapi({ example: "+2547xxxxxxx" }),
    password: z.string().min(6).openapi({ example: "secret123" }),
}).openapi("Register");
export const LoginSchema = z.object({
    email: z.string().email().openapi({ example: "jane@torr.com" }),
    password: z.string().openapi({ example: "secret123" }),
}).openapi("Login");
export const ChangePasswordSchema = z.object({
    oldPassword: z.string(),
    newPassword: z.string().min(6),
}).openapi("ChangePassword");
export default { RegisterSchema, LoginSchema, ChangePasswordSchema };
//# sourceMappingURL=authSchemas.js.map