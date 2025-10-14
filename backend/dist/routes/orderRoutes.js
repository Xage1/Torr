import express from "express";
import { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder, } from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();
router.use(authMiddleware); // protect all routes
router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:orderId", getOrderById);
router.put("/:orderId", updateOrderStatus);
router.delete("/:orderId", deleteOrder);
export default router;
//# sourceMappingURL=orderRoutes.js.map