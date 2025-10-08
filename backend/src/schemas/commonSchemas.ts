import { z } from "zod";

// ✅ Reusable UUID validator (replaces deprecated .uuid())
export const uuidSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    { message: "Invalid UUID format" }
  )
  .describe("UUID string");

// ✅ Standard API response wrapper
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
});

// ✅ Standardized error schema
export const ErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.string().optional(),
});

// Export everything cleanly
export default {
  uuidSchema,
  ApiResponseSchema,
  ErrorSchema,
};