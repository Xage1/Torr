import prisma from "../config/prisma.js";
export const listProducts = async (req, res) => {
    const q = String(req.query.q ?? "").trim();
    const page = Math.max(1, Number(req.query.page ?? 1));
    const limit = Math.min(100, Number(req.query.limit ?? 20));
    const skip = (page - 1) * limit;
    const where = {};
    if (q)
        where.OR = [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }];
    if (req.query.category)
        where.category = String(req.query.category);
    const [items, total] = await Promise.all([
        prisma.product.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
        prisma.product.count({ where }),
    ]);
    return res.json({ success: true, data: { items, meta: { total, page, limit, pages: Math.ceil(total / limit) } } });
};
export const getProduct = async (req, res) => {
    const id = Number(req.params.id);
    if (!id)
        return res.status(400).json({ success: false, message: "Invalid id" });
    const p = await prisma.product.findUnique({ where: { id } });
    if (!p)
        return res.status(404).json({ success: false, message: "Product not found" });
    return res.json({ success: true, data: p });
};
export const createProduct = async (req, res) => {
    try {
        const body = req.body;
        // basic validation
        if (!body.title || typeof body.price !== "number")
            return res.status(400).json({ success: false, message: "Invalid input" });
        const created = await prisma.product.create({
            data: {
                title: body.title,
                description: body.description ?? null,
                price: body.price,
                stock: body.stock ?? 0,
                category: body.category ?? null,
                source: body.source ?? "MANUAL",
                externalId: body.externalId ?? null,
                imageUrls: body.imageUrls ?? []
            }
        });
        return res.status(201).json({ success: true, data: created });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Failed to create product" });
    }
};
export const updateProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ success: false, message: "Invalid id" });
        const body = req.body;
        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing)
            return res.status(404).json({ success: false, message: "Not found" });
        const updated = await prisma.product.update({
            where: { id }, data: {
                title: body.title ?? existing.title,
                description: body.description ?? existing.description,
                price: body.price ?? Number(existing.price),
                stock: body.stock ?? existing.stock,
                category: body.category ?? existing.category,
                source: body.source ?? existing.source,
                externalId: body.externalId ?? existing.externalId,
                imageUrls: body.imageUrls ?? existing.imageUrls
            }
        });
        return res.json({ success: true, data: updated });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Failed to update product" });
    }
};
export const deleteProduct = async (req, res) => {
    const id = Number(req.params.id);
    if (!id)
        return res.status(400).json({ success: false, message: "Invalid id" });
    await prisma.product.delete({ where: { id } });
    return res.json({ success: true, message: "Deleted" });
};
//# sourceMappingURL=productController.js.map