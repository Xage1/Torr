// src/schemas/userSchemas.ts
import { z } from "../config/openapi.js";
export const UserSchema = z.object({
    id: z.number().int().positive().openapi({ example: 1 }),
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    role: z.enum(["ADMIN", "CUSTOMER"]),
    createdAt: z.string().datetime().optional(),
}).openapi("User");
export const UpdateUserSchema = z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
}).openapi("UpdateUser");
export default { UserSchema, UpdateUserSchema };
//# sourceMappingURL=userSchemas.js.map