import nodemailer from "nodemailer";
import env from "./env.js";

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,

    pool: true,

    maxConnections: 10,

    maxMessages: 100,

    rateDelta: 1000,

    rateLimit: 10,

    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },

    tls: {
        rejectUnauthorized: false,
    },
});

(async () => {
    try {
        await transporter.verify();
        console.log("📧 SMTP connected successfully");
    } catch (err) {
        console.error("❌ SMTP connection failed");
        console.error(err);
    }
})();

export const sendMail = async ({
    to,
    subject,
    html,
    attachments = [],
}: {
    to: string | string[];
    subject: string;
    html: string;
    attachments?: any[];
}) => {
    return transporter.sendMail({
        from: `"${env.COMPANY_NAME}" <${env.SMTP_FROM}>`,
        to,
        subject,
        html,
        attachments,
    });
};

export default transporter;