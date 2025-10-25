// src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./docs/registry.js";
import router from "./routes/index.js"; // ✅ single router import
import { errorHandler } from "./middleware/errorHandler.js";
const app = express();
// Middleware setup
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
// Health check route
app.get("/health", (_req, res) => res.json({ ok: true }));
// ✅ Mount all routes in one go (they’re already prefixed correctly inside index.ts)
app.use("/api", router);
// ✅ Generate and serve Swagger docs
const generator = new OpenApiGeneratorV3(registry.definitions ?? {});
const openApiDoc = generator.generateDocument({
    openapi: "3.0.0",
    info: { title: "Torra API", version: "1.0.0" },
    servers: [{ url: "/api" }],
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));
// Global error handler
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map