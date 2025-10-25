// src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./docs/registry.js";
import { authRoutes, userRoutes, productRoutes, orderRoutes, paymentRoutes, adminRoutes } from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

// generate openapi and serve
const generator = new OpenApiGeneratorV3(registry.definitions ?? {});
const openApiDoc = generator.generateDocument({
  openapi: "3.0.0",
  info: { title: "Torra API", version: "1.0.0" },
  servers: [{ url: "/api" }],
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));

app.use(errorHandler);

export default app;