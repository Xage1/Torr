import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const downloadInvoice =
async (
    req: Request,
    res: Response
) => {

    const id = Number(
        req.params.id
    );

    const invoice =
        await prisma.invoice.findUnique({

            where: {
                id,
            },
        });

    if (
        !invoice ||
        !invoice.pdfPath
    ) {
        return res
            .status(404)
            .json({
                success: false,
                message:
                    "Invoice not found",
            });
    }

    return res.download(
        invoice.pdfPath
    );
};