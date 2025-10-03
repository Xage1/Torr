import { Request, Response } from "express";
import prisma from "../config/prisma";
import { success, fail } from "../utils/response";
import {
  createProductSchema,
  updateProductSchema,
  listProductsSchema
} from "../validators/productValidators";

/**
 * GET /api/products
 * Supports: q, category, minPrice, maxPrice, sortBy, sortOrder, page, limit
 */
export async function listProducts(req: Request, res: Response) {
  try {
    const parsed = listProductsSchema.parse(req.query);

    const where: any = {};

    if (parsed.q) {
      // simple full-text-like search across title and description
      where.OR = [
        { title: { contains: parsed.q, mode: "insensitive" } },
        { description: { contains: parsed.q, mode: "insensitive" } }
      ];
    }

    if (parsed.category) {
      where.category = parsed.category;
    }

    if (parsed.minPrice !== null && parsed.minPrice !== undefined) {
      where.price = { ...(where.price ?? {}), gte: parsed.minPrice };
    }

    if (parsed.maxPrice !== null && parsed.maxPrice !== undefined) {
      where.price = { ...(where.price ?? {}), lte: parsed.maxPrice };
    }

    // pagination
    const page = Math.max(1, Number(parsed.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(parsed.limit) || 20));
    const skip = (page - 1) * limit;

    // sorting
    const orderBy = { [parsed.sortBy]: parsed.sortOrder };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          stock: true,
          category: true,
          imageUrls: true,
          source: true,
          externalId: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.product.count({ where })
    ]);

    return res.json(
      success({
        items,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      })
    );
  } catch (err: any) {
    if (err?.issues) {
      return res.status(400).json(fail("Validation failed", err.issues));
    }
    console.error(err);
    return res.status(500).json(fail("Failed to list products", err?.message || err));
  }
}

/**
 * GET /api/products/:id
 */
export async function getProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json(fail("Invalid product id"));

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        stock: true,
        category: true,
        imageUrls: true,
        source: true,
        externalId: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!product) return res.status(404).json(fail("Product not found"));

    return res.json(success(product));
  } catch (err) {
    console.error(err);
    return res.status(500).json(fail("Failed to fetch product"));
  }
}

/**
 * POST /api/products
 * Admin only
 */
export async function createProduct(req: Request, res: Response) {
  try {
    const parsed = createProductSchema.parse(req.body);

    const product = await prisma.product.create({
      data: {
        title: parsed.title,
        description: parsed.description ?? null,
        price: parsed.price,
        stock: parsed.stock ?? 0,
        category: parsed.category ?? null,
        source: parsed.source ?? "MANUAL",
        externalId: parsed.externalId ?? null,
        imageUrls: parsed.imageUrls ?? []
      }
    });

    return res.status(201).json(success(product, "Product created"));
  } catch (err: any) {
    if (err?.issues) {
      return res.status(400).json(fail("Validation failed", err.issues));
    }
    console.error(err);
    return res.status(500).json(fail("Failed to create product", err?.message || err));
  }
}

/**
 * PUT /api/products/:id
 * Admin only
 */
export async function updateProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json(fail("Invalid product id"));

    const parsed = updateProductSchema.parse(req.body);

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json(fail("Product not found"));

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: parsed.title ?? existing.title,
        description: parsed.description ?? existing.description,
        price: parsed.price ?? existing.price,
        stock: parsed.stock ?? existing.stock,
        category: parsed.category ?? existing.category,
        source: parsed.source ?? existing.source,
        externalId: parsed.externalId ?? existing.externalId,
        imageUrls: parsed.imageUrls ?? existing.imageUrls
      }
    });

    return res.json(success(updated, "Product updated"));
  } catch (err: any) {
    if (err?.issues) {
      return res.status(400).json(fail("Validation failed", err.issues));
    }
    console.error(err);
    return res.status(500).json(fail("Failed to update product", err?.message || err));
  }
}

/**
 * DELETE /api/products/:id
 * Admin only
 */
export async function deleteProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json(fail("Invalid product id"));

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json(fail("Product not found"));

    await prisma.product.delete({ where: { id } });

    return res.json(success(null, "Product deleted"));
  } catch (err) {
    console.error(err);
    return res.status(500).json(fail("Failed to delete product"));
  }
}