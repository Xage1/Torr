import { access } from "fs";
import { email, z } from "zod";

export const RegisterSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
});

export const LoginSchema = z.object({
    email: z.email(),
    password: z.string(),
});

export const TokenResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
});

export default {
    RegisterSchema,
    LoginSchema,
    TokenResponseSchema,
};