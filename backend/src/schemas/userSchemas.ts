import { z } from "../config/openapi.js";
import { email } from "zod";

export const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(["CLIENT", "PROVIDER", "ADMIN"]),
    isActive: z.boolean(),
});

export const CreateUserSchema = UserSchema.omit({ id: true });
export const UpdateUserSchema = UserSchema.partial();

export default {
    UserSchema,
    CreateUserSchema,
    UpdateUserSchema,
};
