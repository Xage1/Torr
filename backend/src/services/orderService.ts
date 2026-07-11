import prisma from "../config/prisma.js";

interface OrderItemInput {
    productId: number;
    quantity: number;
}

export const createOrder = async (
    userId: number,
    items: OrderItemInput[]
) => {

    if (!items.length) {
        throw new Error("Order contains no items.");
    }

    return await prisma.$transaction(async (tx) => {

        //------------------------------------------------
        // Generate Order Number
        //------------------------------------------------

        const count = await tx.order.count();

        const orderNumber =
            `TOR-${new Date().getFullYear()}-${String(count + 1).padStart(6, "0")}`;

        //------------------------------------------------
        // Validate Products
        //------------------------------------------------

        let total = 0;

        const orderItems: any[] = [];

        for (const item of items) {

            const product = await tx.product.findUnique({
                where: {
                    id: Number(item.productId),
                },
            });

            if (!product) {
                throw new Error(`Product ${item.productId} not found.`);
            }

            if (item.quantity <= 0) {
                throw new Error("Quantity must be greater than zero.");
            }

            if (product.stock < item.quantity) {
                throw new Error(
                    `${product.title} has only ${product.stock} remaining.`
                );
            }

            //------------------------------------------------
            // Snapshot current selling price
            //------------------------------------------------

            const linePrice = Number(product.price);

            total += linePrice * item.quantity;

            orderItems.push({
                productId: product.id,
                quantity: item.quantity,
                price: linePrice,
            });

            //------------------------------------------------
            // Reserve Stock
            //------------------------------------------------

            await tx.product.update({
                where: {
                    id: product.id,
                },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });
        }

        //------------------------------------------------
        // Create Order
        //------------------------------------------------

        const order = await tx.order.create({

            data: {

                orderNumber,

                userId,

                status: "CREATED",

                total,

                OrderItem: {

                    create: orderItems,

                },

            },

            include: {

                OrderItem: {

                    include: {

                        product: true,

                    },

                },

                Payment: true,

            },

        });

        return order;

    });

};