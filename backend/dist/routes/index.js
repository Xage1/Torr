import { Router } from "express";
import authRouter from "./authRoutes.js";
import userRouter from "./userRoutes.js";
import productRouter from "./productRoutes.js";
import orderRouter from "./orderRoutes.js";
import paymentRouter from "./paymentRoutes.js";
import adminRouter from "./adminRoutes.js";
const router = Router();
// Mount all routers
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);
router.use("/payments", paymentRouter);
router.use("/admin", adminRouter);
export default router;
//# sourceMappingURL=index.js.map