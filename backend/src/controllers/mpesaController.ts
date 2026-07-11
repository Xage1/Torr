import { Request, Response } from "express";
import { initiateSTKPush } from "../services/mpesaService.js";

export const stkPush = async (
    req: Request,
    res: Response
) => {
    try {
        const { orderId, phone } = req.body;

        const result = await initiateSTKPush(
            Number(orderId),
            phone
        );

        res.json({
            success: true,
            message: "STK Push sent.",
            data: result,
        });
    } catch (e: any) {
        res.status(500).json({
            success: false,
            message: e.message,
        });
    }
};