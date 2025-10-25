import { Router } from "express";
import { registry } from "../docs/registry.js";
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct, } from "../controllers/productController.js";
export const productRouter = Router();
// ✅ Swagger: List products
registry.registerPath({
    method: "get",
    path: "/products",
    summary: "List all products",
    responses: { 200: { description: "Products listed" } },
});
productRouter.get("/", listProducts);
// ✅ Swagger: Get product by ID
registry.registerPath({
    method: "get",
    path: "/products/{id}",
    summary: "Get product by ID",
    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
    responses: { 200: { description: "Product details" } },
});
productRouter.get("/:id", getProduct);
// ✅ Swagger: Create product
registry.registerPath({
    method: "post",
    path: "/products",
    summary: "Create new product",
    requestBody: {
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/CreateProductSchema" },
            },
        },
    },
    responses: { 201: { description: "Product created" } },
});
productRouter.post("/", createProduct);
// ✅ Swagger: Update product
registry.registerPath({
    method: "put",
    path: "/products/{id}",
    summary: "Update product",
    requestBody: {
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/UpdateProductSchema" },
            },
        },
    },
    responses: { 200: { description: "Product updated" } },
});
productRouter.put("/:id", updateProduct);
// ✅ Swagger: Delete product
registry.registerPath({
    method: "delete",
    path: "/products/{id}",
    summary: "Delete product",
    parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
    responses: { 200: { description: "Product deleted" } },
});
productRouter.delete("/:id", deleteProduct);
//# sourceMappingURL=productRoutes.js.map