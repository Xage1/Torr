import express from "express";
import {
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";
import { registry } from "../config/openapi.js";
import {
    CreateProductSchema,
    UpdateProductSchema,
} from "../schemas/productSchemas.js";

const router = express.Router();

registry.registerPath({
    method: "get",
    path: "/products",
    summary: "Get all products",
    responses: { 200: { description: "List of products" } },
});

registry.registerPath({
    method: "get",
    path: "/products/{id}",
    summary: "Get product by ID",
    responses: { 200: { description: "Product details" } },
});

registry.registerPath({
    method: "post",
    path: "/products",
    summary: "Create new product",
    requestBody: {
        content: {
            "application/json": {
                schema: { $ref: registry.register("CreateProductSchema", CreateProductSchema) },
            },
        },
    },
    responses: { 201: { description: "Product created" } },
});

registry.registerPath({
    method: "put",
    path: "/products/{id}",
    summary: "Update existing product",
    requestBody: {
        content: {
            "application/json": {
                schema: { $ref: registry.register("UpdateProductSchema", UpdateProductSchema) },
            },
        },
    },
    responses: { 200: { description: "Product updated" } },
});

registry.registerPath({
    method: "delete",
    path: "/products/{id}",
    summary: "Delete product",
    responses: { 200: { description: "Product deleted" } },
});

router.get("/", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;