import prisma from "../config/prisma.js";

export async function logPaymentAudit(
    paymentId: number,
    action: string,
    payload: any = {}
) {
    return prisma.paymentAudit.create({
        data: {
            paymentId,
            action,
            payload,
        },
    });
}