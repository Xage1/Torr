import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./docs/registry.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// Register routes
app.use("/api/auth", authRoutes);

// Generate OpenAPI docs dynamically
const generator = new OpenApiGeneratorV3(registry.definitions);
const openApiDoc = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Torr API Documentation",
    version: "1.0.0",
    description: "Comprehensive API documentation for the Torr backend",
  },
  servers: [{ url: "/api" }],
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));

// Error handler
app.use(errorHandler);

export default app;