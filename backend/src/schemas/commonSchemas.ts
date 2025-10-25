// src/schemas/commonSchemas.ts
import { z } from "../config/openapi.js";

export const uuidSchema = z.string().regex(/^[0-9]+$/).describe("numeric-id-as-string");
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
});
export const ErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.string().optional(),
});

export default { uuidSchema, ApiResponseSchema, ErrorSchema };