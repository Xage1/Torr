import prisma from "../config/prisma.js";
import { randomUUID } from "crypto";
import { generateInvoicePDF } from "./pdfInvoiceService.js";
import { sendInvoiceEmail } from "./emailService.js";

export async function generateInvoice(
    orderId: number
) {
    const order =
        await prisma.order.findUnique({

            where: {
                id: orderId,
            },

            include: {
                user: true,

                OrderItem: {
                    include: {
                        product: true,
                    },
                },
            },
        });

    if (!order)
        throw new Error(
            "Order not found"
        );

    const existing =
        await prisma.invoice.findUnique({

            where: {
                orderId,
            },
        });

    if (existing) {
        return existing;
    }

    const subtotal =
        Number(order.total);

    const tax =
        Number(
            (subtotal * 0.16).toFixed(2)
        );

    const total =
        subtotal + tax;

    const invoice =
        await prisma.invoice.create({

            data: {

                invoiceNumber:
                    `INV-${Date.now()}-${randomUUID().substring(0, 6).toUpperCase()}`,

                orderId,

                subtotal,

                tax,

                total,

                paid: true,
            },
        });

    const completeInvoice =
        await prisma.invoice.findUnique({

            where: {
                id: invoice.id,
            },

            include: {

                order: {

                    include: {

                        user: true,

                        OrderItem: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
        });

    const pdfPath =
        await generateInvoicePDF(
            completeInvoice
        );

    const updated =
        await prisma.invoice.update({

            where: {
                id: invoice.id,
            },

            data: {
                pdfPath,
            },
        });

    if (
        completeInvoice?.order?.user
            ?.email
    ) {
        await sendInvoiceEmail(
            completeInvoice.order.user.email,
            invoice.invoiceNumber,
            pdfPath
        );
    }

    return updated;
}