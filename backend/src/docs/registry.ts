// src/docs/registry.ts
import { z } from "zod";
import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// ✅ Must run before any schemas are imported
extendZodWithOpenApi(z);

// Import schemas AFTER OpenAPI extension is applied
import * as productSchemas from "../schemas/productSchemas.js";
import * as userSchemas from "../schemas/userSchemas.js";
import * as authSchemas from "../schemas/authSchemas.js";
import * as orderSchemas from "../schemas/orderSchemas.js";
import * as paymentSchemas from "../schemas/paymentSchemas.js";
import * as commonSchemas from "../schemas/commonSchemas.js";

export const registry = new OpenAPIRegistry();

// Collect all schema modules
const schemaGroups = {
  productSchemas,
  userSchemas,
  authSchemas,
  orderSchemas,
  paymentSchemas,
  commonSchemas,
};

// Register all schemas safely
for (const [groupName, group] of Object.entries(schemaGroups)) {
  for (const [schemaName, schemaValue] of Object.entries(group)) {
    if (
      schemaValue &&
      typeof schemaValue === "object" &&
      "_def" in schemaValue &&
      typeof schemaValue._def === "object"
    ) {
      try {
        registry.register(`${groupName}.${schemaName}`, schemaValue as any);
      } catch (err) {
        console.warn(
          `⚠️ Failed to register schema ${groupName}.${schemaName}:`,
          (err as Error).message
        );
      }
    }
  }
}