// src/controllers/paymentController.ts

import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { extractMpesaMetadata } from "../utils/mpesaMetadata.js";
import { generateInvoice } from "../services/invoiceService.js";
import { logPaymentAudit } from "../services/paymentAuditService.js";

export const mpesaCallback = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const callback = req.body;

        const stk = callback?.Body?.stkCallback;

        if (!stk) {
            return res.json({
                ResultCode: 0,
                ResultDesc: "Ignored",
            });
        }

        const checkoutRequestId = stk.CheckoutRequestID;
        const merchantRequestId = stk.MerchantRequestID;
        const resultCode = Number(stk.ResultCode);
        const resultDescription = stk.ResultDesc;

        const payment = await prisma.payment.findFirst({
            where: {
                checkoutRequestId,
            },
            include: {
                order: true,
            },
        });

        if (!payment) {
            return res.json({
                ResultCode: 0,
                ResultDesc: "Payment not found",
            });
        }

        // ---------------------------------------------------
        // Idempotency
        // ---------------------------------------------------

        if (
            payment.status === "SUCCESS" &&
            payment.mpesaReceiptNumber
        ) {
            return res.json({
                ResultCode: 0,
                ResultDesc: "Already processed",
            });
        }

        // ---------------------------------------------------
        // Failed Payment
        // ---------------------------------------------------

        if (resultCode !== 0) {
            await prisma.payment.update({
                where: {
                    id: payment.id,
                },
                data: {
                    status: "FAILED",
                    resultCode,
                    resultDescription,
                    rawCallback: callback,
                },
            });

            await prisma.order.update({
                where: {
                    id: payment.orderId,
                },
                data: {
                    status: "AWAITING_PAYMENT",
                },
            });

            await logPaymentAudit(
                payment.id,
                "PAYMENT_FAILED",
                callback
            );

            return res.json({
                ResultCode: 0,
                ResultDesc: "Accepted",
            });
        }

        // ---------------------------------------------------
        // Extract Metadata
        // ---------------------------------------------------

        const metadata = extractMpesaMetadata(callback);

        // ---------------------------------------------------
        // Duplicate Receipt Check
        // ---------------------------------------------------

        const duplicate = await prisma.payment.findFirst({
            where: {
                mpesaReceiptNumber:
                    metadata.receipt,
                NOT: {
                    id: payment.id,
                },
            },
        });

        if (duplicate) {
            await logPaymentAudit(
                payment.id,
                "DUPLICATE_RECEIPT",
                callback
            );

            return res.json({
                ResultCode: 0,
                ResultDesc: "Duplicate",
            });
        }

        // ---------------------------------------------------
        // Amount Verification
        // ---------------------------------------------------

        const expected = Number(payment.amount);

        if (expected !== metadata.amount) {
            await prisma.payment.update({
                where: {
                    id: payment.id,
                },
                data: {
                    status: "FAILED",
                    resultCode,
                    resultDescription: "Amount mismatch",
                    rawCallback: callback,
                },
            });

            await logPaymentAudit(
                payment.id,
                "AMOUNT_MISMATCH",
                {
                    expected,
                    received: metadata.amount,
                }
            );

            return res.json({
                ResultCode: 0,
                ResultDesc: "Accepted",
            });
        }

        // ---------------------------------------------------
        // Update Payment
        // ---------------------------------------------------

        const updatedPayment =
            await prisma.payment.update({
                where: {
                    id: payment.id,
                },
                data: {
                    status: "SUCCESS",
                    merchantRequestId,
                    checkoutRequestId,
                    mpesaReceiptNumber:
                        metadata.receipt,
                    phoneNumber:
                        metadata.phone,
                    transactionDate:
                        metadata.transactionDate,
                    resultCode,
                    resultDescription,
                    rawCallback: callback,
                },
            });

        // ---------------------------------------------------
        // Update Order
        // ---------------------------------------------------

        await prisma.order.update({
            where: {
                id: payment.orderId,
            },
            data: {
                status: "PAID",
            },
        });

        // ---------------------------------------------------
        // Invoice
        // ---------------------------------------------------

        await generateInvoice(
            payment.orderId
        );

        // ---------------------------------------------------
        // Audit Log
        // ---------------------------------------------------

        await logPaymentAudit(
            updatedPayment.id,
            "PAYMENT_SUCCESS",
            callback
        );

        return res.json({
            ResultCode: 0,
            ResultDesc: "Accepted",
        });

    } catch (error) {

        console.error(error);

        return res.json({
            ResultCode: 0,
            ResultDesc: "Accepted",
        });
    }
};

export const getPayment = async (
    req: Request,
    res: Response
) => {

    const id = Number(req.params.id);

    const payment =
        await prisma.payment.findUnique({

            where: {
                id,
            },

            include: {
                order: {
                    include: {
                        OrderItem: {
                            include: {
                                product: true,
                            },
                        },
                        Invoice: true,
                    },
                },
            },
        });

    if (!payment) {
        return res.status(404).json({
            success: false,
            message: "Payment not found",
        });
    }

    return res.json({
        success: true,
        data: payment,
    });
};

export const getPayments = async (
    req: Request,
    res: Response
) => {

    const payments =
        await prisma.payment.findMany({

            include: {
                order: true,
            },

            orderBy: {
                createdAt: "desc",
            },
        });

    return res.json({
        success: true,
        count: payments.length,
        data: payments,
    });
};

export const getPaymentAudit = async (
    req: Request,
    res: Response
) => {

    const paymentId = Number(req.params.id);

    const logs =
        await prisma.paymentAudit.findMany({

            where: {
                paymentId,
            },

            orderBy: {
                createdAt: "asc",
            },
        });

    return res.json({
        success: true,
        count: logs.length,
        data: logs,
    });
};