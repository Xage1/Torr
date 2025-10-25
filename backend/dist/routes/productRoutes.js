import express from "express";
import { registry } from "../docs/registry.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createProduct, updateProduct, listProducts, getProduct } from "../controllers/productController.js";
import { CreateProductSchema, UpdateProductSchema } from "../schemas/productSchemas.js";
const router = express.Router();
router.use(authMiddleware);
registry.registerPath({
    method: "post",
    path: "/products",
    tags: ["Products"],
    summary: "Create product",
    requestBody: {
        content: {
            "application/json": {
                schema: registry.register("CreateProductSchema", CreateProductSchema),
            },
        },
    },
    responses: { 201: { description: "Product created" } },
});
registry.registerPath({
    method: "put",
    path: "/products/{id}",
    tags: ["Products"],
    summary: "Update product",
    requestBody: {
        content: {
            "application/json": {
                schema: registry.register("UpdateProductSchema", UpdateProductSchema),
            },
        },
    },
    responses: { 200: { description: "Updated" } },
});
router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
export default router;
//# sourceMappingURL=productRoutes.js.map