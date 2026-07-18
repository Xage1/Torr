import { User, Order } from "@prisma/client";
import { sendMail } from "../config/mailer.js";

import {
    verificationEmailTemplate,
    passwordResetTemplate,
    loginAlertTemplate,
    orderConfirmationTemplate,
    invoiceTemplate,
    paymentSuccessTemplate,
    paymentFailedTemplate,
    twoFactorTemplate,
} from "../templates/email/index.js";

export async function sendVerificationEmail(
    user: User,
    token: string
) {
    return sendMail({
        to: user.email,
        subject: "Verify your Torra Account",
        html: verificationEmailTemplate(user.name, token),
    });
}

export async function sendPasswordResetEmail(
    user: User,
    token: string
) {
    return sendMail({
        to: user.email,
        subject: "Reset your Torra Password",
        html: passwordResetTemplate(user.name, token),
    });
}

export async function sendLoginAlert(
    user: User,
    ip: string,
    device: string
) {
    return sendMail({
        to: user.email,
        subject: "New Login Detected",
        html: loginAlertTemplate(
            user.name,
            ip,
            device,
            new Date()
        ),
    });
}

export async function sendOrderConfirmation(
    user: User,
    order: Order
) {
    return sendMail({
        to: user.email,
        subject: `Order ${order.orderNumber} Confirmed`,
        html: orderConfirmationTemplate(
            user.name,
            order
        ),
    });
}

export async function sendInvoiceEmail(
    user: User,
    order: Order,
    pdfPath: string
) {
    return sendMail({
        to: user.email,
        subject: `Invoice ${order.orderNumber}`,
        html: invoiceTemplate(
            user.name,
            order
        ),
        attachments: [
            {
                filename: `${order.orderNumber}.pdf`,
                path: pdfPath,
            },
        ],
    });
}

export async function sendPaymentSuccess(
    user: User,
    order: Order
) {
    return sendMail({
        to: user.email,
        subject: "Payment Successful",
        html: paymentSuccessTemplate(
            user.name,
            order
        ),
    });
}

export async function sendPaymentFailed(
    user: User,
    order: Order
) {
    return sendMail({
        to: user.email,
        subject: "Payment Failed",
        html: paymentFailedTemplate(
            user.name,
            order
        ),
    });
}

export async function sendTwoFactorCode(
    user: User,
    code: string
) {
    return sendMail({
        to: user.email,
        subject: "Your Torra Verification Code",
        html: twoFactorTemplate(
            user.name,
            code
        ),
    });
}