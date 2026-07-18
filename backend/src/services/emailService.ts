import nodemailer from "nodemailer";

import env from "../config/env.js";

import { verificationEmailTemplate } from "../templates/email/verificationEmailTemplate.js";
import { passwordResetTemplate } from "../templates/email/passwordResetTemplate.js";
import { loginAlertTemplate } from "../templates/email/loginAlertTemplate.js";
import { orderConfirmationTemplate } from "../templates/email/orderConfirmationTemplate.js";
import { invoiceTemplate } from "../templates/email/invoiceTemplate.js";
import { paymentSuccessTemplate } from "../templates/email/paymentSuccessTemplate.js";
import { paymentFailedTemplate } from "../templates/email/paymentFailedTemplate.js";
import { twoFactorTemplate } from "../templates/email/twoFactorTemplate.js";
import { welcomeTemplate } from "../templates/email/welcomeTemplate.js";
import { emailChangedTemplate } from "../templates/email/emailChangedTemplate.js";
import { accountLockedTemplate } from "../templates/email/accountLockedTemplate.js";
import { passwordChangedTemplate } from "../templates/email/passwordChangedTemplate.js";
import { sessionRevokedTemplate } from "../templates/email/sessionRevokedTemplate.js";
import { adminNotificationTemplate } from "../templates/email/adminNotificationTemplate.js";
import { orderShippedTemplate } from "../templates/email/orderShippedTemplate.js";
import { orderDeliveredTemplate } from "../templates/email/orderDeliveredTemplate.js";
import { refundProcessedTemplate } from "../templates/email/refundProcessedTemplate.js";
import { newsletterTemplate } from "../templates/email/newsletterTemplate.js";

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: Number(env.SMTP_PORT) === 465,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

const FROM = `"Torra" <${env.SMTP_FROM}>`;

async function sendEmail(
    to: string,
    subject: string,
    html: string
) {
    return transporter.sendMail({
        from: FROM,
        to,
        subject,
        html,
    });
}

export const sendVerificationEmail = (
    email: string,
    name: string,
    link: string
) =>
    sendEmail(
        email,
        "Verify your Torra account",
        verificationEmailTemplate(name, link)
    );

export const sendPasswordResetEmail = (
    email: string,
    name: string,
    link: string
) =>
    sendEmail(
        email,
        "Reset your Torra password",
        passwordResetTemplate(name, link)
    );

export const sendLoginAlert = (
    email: string,
    name: string,
    ip: string,
    device: string
) =>
    sendEmail(
        email,
        "New login detected",
        loginAlertTemplate(name, ip, device)
    );

export const sendOrderConfirmation = (
    email: string,
    name: string,
    order: any
) =>
    sendEmail(
        email,
        `Order ${order.orderNumber}`,
        orderConfirmationTemplate(name, order)
    );

export const sendInvoice = (
    email: string,
    name: string,
    invoice: any
) =>
    sendEmail(
        email,
        `Invoice ${invoice.invoiceNumber}`,
        invoiceTemplate(name, invoice)
    );

export const sendPaymentSuccess = (
    email: string,
    name: string,
    payment: any
) =>
    sendEmail(
        email,
        "Payment received",
        paymentSuccessTemplate(name, payment)
    );

export const sendPaymentFailed = (
    email: string,
    name: string,
    payment: any
) =>
    sendEmail(
        email,
        "Payment failed",
        paymentFailedTemplate(name, payment)
    );

export const sendTwoFactorCode = (
    email: string,
    name: string,
    code: string
) =>
    sendEmail(
        email,
        "Your Torra verification code",
        twoFactorTemplate(name, code)
    );

export const sendWelcomeEmail = (
    email: string,
    name: string
) =>
    sendEmail(
        email,
        "Welcome to Torra",
        welcomeTemplate(name)
    );

export const sendEmailChanged = (
    email: string,
    name: string
) =>
    sendEmail(
        email,
        "Email updated",
        emailChangedTemplate(name)
    );

export const sendAccountLocked = (
    email: string,
    name: string
) =>
    sendEmail(
        email,
        "Account locked",
        accountLockedTemplate(name)
    );

export const sendPasswordChanged = (
    email: string,
    name: string
) =>
    sendEmail(
        email,
        "Password changed",
        passwordChangedTemplate(name)
    );

export const sendSessionRevoked = (
    email: string,
    name: string
) =>
    sendEmail(
        email,
        "Session revoked",
        sessionRevokedTemplate(name)
    );

export const sendAdminNotification = (
    email: string,
    title: string,
    message: string
) =>
    sendEmail(
        email,
        title,
        adminNotificationTemplate(title, message)
    );

export const sendOrderShipped = (
    email: string,
    name: string,
    order: any
) =>
    sendEmail(
        email,
        "Order shipped",
        orderShippedTemplate(name, order)
    );

export const sendOrderDelivered = (
    email: string,
    name: string,
    order: any
) =>
    sendEmail(
        email,
        "Order delivered",
        orderDeliveredTemplate(name, order)
    );

export const sendRefundProcessed = (
    email: string,
    name: string,
    refund: any
) =>
    sendEmail(
        email,
        "Refund processed",
        refundProcessedTemplate(name, refund)
    );

export const sendNewsletter = (
    email: string,
    name: string,
    content: string
) =>
    sendEmail(
        email,
        "Torra Newsletter",
        newsletterTemplate(name, content)
    );

export default transporter;