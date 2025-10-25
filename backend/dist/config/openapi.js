// src/config/openapi.ts
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
// IMPORTANT: extend before importing/creating schemas that call .openapi()
extendZodWithOpenApi(z);
export { z };
//# sourceMappingURL=openapi.js.map