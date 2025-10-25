// src/docs/registry.ts
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

// create registry and register schemas in their schema files (those schema files call .openapi)
export const registry = new OpenAPIRegistry();