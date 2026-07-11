import { Router } from "express";
import authRouter from "./authRoutes.js";
import userRouter from "./userRoutes.js";
import productRouter from "./productRoutes.js";
import orderRouter from "./orderRoutes.js";
import paymentRouter from "./paymentRoutes.js";
import adminRouter from "./adminRoutes.js";
import invoiceRoutes from "./invoiceRoutes.js";
import mpesaRoutes from "./mpesaRoutes.js";
import adminAnalyticsRoutes from "./adminAnalyticsRoutes.js";

const router = Router();

// Mount all routers
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);
router.use("/payments", paymentRouter);
router.use("/admin", adminRouter);
router.use("/mpesa", mpesaRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/analytics", adminAnalyticsRoutes);
export default router;