import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./docs/registry.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Import all route groups
import {
  authRoutes,
  userRoutes,
  productRoutes,
  orderRoutes,
  paymentRoutes,
  adminRoutes,
} from "./routes/index.js";

const app = express();

// Security, logging, and parsing middleware
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health check route
app.get("/health", (req, res) => res.json({ status: "ok", service: "Torr API" }));

// Core API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Generate OpenAPI docs dynamically
const generator = new OpenApiGeneratorV3(registry.definitions);
const openApiDoc = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Torr API Documentation",
    version: "1.0.0",
    description: "Comprehensive API documentation for the Torr backend services",
  },
  servers: [{ url: "/api" }],
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));

// Global error handler (must come last)
app.use(errorHandler);

export default app;