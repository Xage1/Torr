import axios from "axios";
import prisma from "../config/prisma.js";

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken() {
    if (cachedToken && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    const consumerKey = process.env.MPESA_CONSUMER_KEY!;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;

    const auth = Buffer.from(
        `${consumerKey}:${consumerSecret}`
    ).toString("base64");

    const url =
        process.env.MPESA_ENV === "production"
            ? "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
            : "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

    const { data } = await axios.get(url, {
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });

    cachedToken = data.access_token;
    tokenExpiry = Date.now() + 3500 * 1000;

    return cachedToken;
}

function timestamp() {
    const now = new Date();

    const pad = (n: number) => n.toString().padStart(2, "0");

    return (
        now.getFullYear() +
        pad(now.getMonth() + 1) +
        pad(now.getDate()) +
        pad(now.getHours()) +
        pad(now.getMinutes()) +
        pad(now.getSeconds())
    );
}

function password(ts: string) {
    return Buffer.from(
        process.env.MPESA_SHORTCODE! +
            process.env.MPESA_PASSKEY! +
            ts
    ).toString("base64");
}

export async function initiateSTKPush(
    orderId: number,
    phone: string
) {
    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
    });

    if (!order) throw new Error("Order not found");

    const token = await getAccessToken();

    const ts = timestamp();

    const body = {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password(ts),
        Timestamp: ts,
        TransactionType: "CustomerPayBillOnline",
        Amount: Number(order.total),
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: order.orderNumber,
        TransactionDesc: "Torra Store Purchase",
    };

    const url =
        process.env.MPESA_ENV === "production"
            ? "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
            : "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    const { data } = await axios.post(url, body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const payment = await prisma.payment.create({
        data: {
            orderId: order.id,
            method: "MPESA",
            amount: order.total,
            status: "STK_SENT",
            checkoutRequestId: data.CheckoutRequestID,
            merchantRequestId: data.MerchantRequestID,
        },
    });

    await prisma.order.update({
        where: {
            id: order.id,
        },
        data: {
            status: "AWAITING_PAYMENT",
        },
    });

    return {
        payment,
        stk: data,
    };
}