import { Router } from "express";
import {
    listProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

/**
 * Public
 */

router.get("/", listProducts);
router.get("/:id", getProduct);

/**
 * Admin-only
 */

router.post("/", authMiddleware, roleMiddleware("ADMIN"), createProduct);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateProduct);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteProduct);

export default router;