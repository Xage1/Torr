import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as productSchemas from "./productSchemas.js";
import * as userSchemas from "./userSchemas.js";
import * as authSchemas from "./authSchemas.js";
import * as orderSchemas from "./orderSchemas.js";
import * as paymentSchemas from "./paymentSchemas.js";
import * as commonSchemas from "./commonSchemas.js";

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

// Iterate and register all Zod schemas safely
for (const [groupName, group] of Object.entries(schemaGroups)) {
  for (const [schemaName, schemaValue] of Object.entries(group)) {
    // Only register if it’s a Zod schema (has ._def)
    if (
      schemaValue &&
      typeof schemaValue === "object" &&
      "_def" in schemaValue &&
      typeof schemaValue._def === "object"
    ) {
      registry.register(`${groupName}.${schemaName}`, schemaValue as any);
    }
  }
}